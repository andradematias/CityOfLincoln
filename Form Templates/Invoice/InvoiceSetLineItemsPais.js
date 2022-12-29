let logger = require('../log');

module.exports.getCredentials = function () {
    var options = {};
    options.customerAlias = "CityofLincoln";
    options.databaseAlias = "Permits";
    options.userId = "9c9fc654-5068-4e99-9f0c-da5258e5fd5f";
    options.password = "GBmuogNipLwWXea5dsXbYLRJ2yZETc8odeMZ5M8xmIA=";
    options.clientId = "9c9fc654-5068-4e99-9f0c-da5258e5fd5f";
    options.clientSecret = "GBmuogNipLwWXea5dsXbYLRJ2yZETc8odeMZ5M8xmIA=";
    return options;
};

module.exports.main = async function (ffCollection, vvClient, response) {
    /*Script Name:  InvoiceSetLineItemsPaid
     Customer:      City of Lincoln
     Purpose:       The purpose of this process is to mark all Invoice Line Items associated with an invoice as paid and generate any certificates if they were paid.
    
     Parameters:    Invoice ID (String, Required)
                    
     Return Array:  [0] Status: 'Success', 'Error'
                    [1] Message
                    [2] certificatesGenerated (array of object. Each object has a REVISIONID and instanceName) or null
                    [3] errorLog or null
                    
     Pseudo code:   1. Call getForms to get all Invoice Line Items associated with an Invoice.
                    2. Call postFormRevision to update the Status of all Invoice Line Items associated with the Invoice to Paid.
                    3. Call LibGenerateOpPermCertificate to generate certificates for all line items that were paid.
                    4. Call LibEmailGenerateAndCreateCommunicationLog to send person who paid a receipt.
                    5. Send response with return array.
   
     Date of Dev: 02/14/2021
     Last Rev Date: 12/08/2021
     Revision Notes:
     02/14/2021  - Rocky Borg: Script created.
     05/19/2021 - Maxwell Rehbein: Added Handling for Rentals New Building Construction, no inspections generated, simply approve the permit. Also fixed for renewal fee.
     06/24/2021 - Maxwell Rehbein: Updates for renewal late fee. If found, set paid and set permit to approved.
     11/22/2021 - Maxwell Rehbein: Updated query in rental renewal process to find permits even if they have been expired to set expired, resolved for an error if no permit is found.
     12/08/2022 - Rocky Borg: Fix length check for OpPerm renewal certificates.
     */

    logger.info('Start of the process InvoiceSetLineItemsPaid at ' + Date())

    /**********************
     Configurable Variables
    ***********************/
    // Form Template ID.
    let invoiceLineItemTemplateID = 'Invoice Line Item'
    let certificateTemplateID = 'OpPerm Certificate'

    let emailTemplateName = "Invoice Receipt"

    let rentalPermitTemplateID = 'Rental Permit'

    let TokenInvoiceID = '[Invoice ID]'
    let TokenCertificateURL = '[Certificate URL]'
    let TokenReceiptURL = '[Receipt URL]'

    // Response array populated in try or catch block, used in response sent in finally block.
    let outputCollection = []
    // Array for capturing error messages that may occur within helper functions.
    let errorLog = []

    try {
        /*********************
         Form Record Variables
        **********************/
        // Create variables for the values on the form record
        let InvoiceID = getFieldValueByName('Invoice ID')
        let PrimaryID = getFieldValueByName('Primary ID')
        let PaidByEmail = getFieldValueByName('Paid By Email')
        let baseURL = getFieldValueByName('Base URL')
        let InvoiceCategory = getFieldValueByName('Invoice Category')

        // Specific fields are detailed in the errorLog sent in the response to the client.
        if (errorLog.length > 0) {
            throw new Error(`Please provide a value for the required fields.`)
        }


        /****************
         Helper Functions
        *****************/
        // Check if field object has a value property and that value is truthy before returning value.
        function getFieldValueByName(fieldName, isOptional) {
            try {
                let fieldObj = ffCollection.getFormFieldByName(fieldName)
                let fieldValue = fieldObj && (fieldObj.hasOwnProperty('value') ? fieldObj.value : null)

                if (fieldValue === null) {
                    throw new Error(`A value property for ${fieldName} was not found.`)
                }
                if (!isOptional && !fieldValue) {
                    throw new Error(`A value for ${fieldName} was not provided.`)
                }
                return fieldValue
            } catch (error) {
                errorLog.push(error.message)
            }
        }

        /****************
         BEGIN ASYNC CODE
        *****************/
        // STEP 1 - Call getForms to get all Invoice Line Items associated with an Invoice.
        let queryParams = {
            q: `[Invoice ID] eq '${InvoiceID}' AND [Status] eq 'Not Paid'`,
            expand: true
        };

        let getFormsResp = await vvClient.forms.getForms(queryParams, invoiceLineItemTemplateID)
        getFormsResp = JSON.parse(getFormsResp)
        let getFormsData = (getFormsResp.hasOwnProperty('data') ? getFormsResp.data : null);

        if (getFormsResp.meta.status !== 200) {
            throw new Error(`Error encountered when calling getForms. ${getFormsResp.meta.statusMsg}.`)
        }
        if (!getFormsData || !Array.isArray(getFormsData)) {
            throw new Error(`Data was not returned when calling getForms.`)
        }

        let invoiceLineItems = getFormsData

        // OPERATIONAL PERMITS
        let newOpPermCert = getFormsData.filter(elem => elem['category'] === 'Operational Permits' && elem['sub Category'] === 'Initial Permit Fee')
        let renewalOpPermCert = getFormsData.filter(elem => elem['category'] === 'Operational Permits' && elem['sub Category'] === 'Renewal Fee')
        let feeScheduleAdjustments = getFormsData.filter(elem => elem['category'] === 'Operational Permits' && elem['sub Category'] === 'Initial Permit Adjustment')

        let newCert = []

        for (const record of newOpPermCert) {
            newCert.push({ 'Permit ID': record['primary ID'], 'Certificate Year': record['opPerm Certificate Year'] })
        }


        let renewalCert = []

        for (const record of renewalOpPermCert) {
            renewalCert.push({ 'Permit ID': record['primary ID'], 'Certificate Year': record['opPerm Certificate Year'] })
        }

        // RENTALS
        let rentalRenewalFee = getFormsData.filter(elem => elem['category'] === 'Rentals' && elem['sub Category'] === 'Apartment License Late Fee')
        let apartmentLicenseFee = getFormsData.filter(elem => elem['category'] === 'Rentals' && elem['sub Category'] === 'Apartment License Fee')
        let certificateOfComplianceFee = getFormsData.filter(elem => elem['category'] === 'Rentals' && elem['sub Category'] === 'Certificate of Compliance Fee')
        let newBuildingPermitFee = getFormsData.filter(elem => elem['category'] === 'Rentals' && elem['sub Category'] === 'Apartment License Fee - New Building Construction')
        let rentalRenewalPermitFee = getFormsData.filter(elem => elem['category'] === 'Rentals' && elem['sub Category'] === 'Renewal Fee')


        for (const rentalRenewal of rentalRenewalFee) {
            // Find and approve the new Rental Permit record after successful invoice payment
            let renewalRentalPermitQueryParams = {
                q: `[Record ID] eq '${rentalRenewal['primary ID']}' AND ([Status] eq 'New' OR [Status] eq 'Delinquent')`,
                fields: 'instanceName, revisionId, property ID'
            };

            let getRenewalRentalPermitResponse = await vvClient.forms.getForms(renewalRentalPermitQueryParams, rentalPermitTemplateID);
            getRenewalRentalPermitResponse = JSON.parse(getRenewalRentalPermitResponse);
            let getRenewalRentalPermitData = (getRenewalRentalPermitResponse.hasOwnProperty('data') ? getRenewalRentalPermitResponse.data : null);
            let getRenewalRentalPermitLength = (Array.isArray(getRenewalRentalPermitData) ? getRenewalRentalPermitData.length : 0);

            if (getRenewalRentalPermitResponse.meta.status !== 200) {
                throw new Error(`Error encountered when calling getForms. ${getRenewalRentalPermitResponse.meta.statusMsg}.`);
            }
            if (!getRenewalRentalPermitData || !Array.isArray(getRenewalRentalPermitData)) {
                throw new Error(`Data was not returned when calling getForms.`);
            }
            if (getRenewalRentalPermitLength >= 1) {
                let renewalRentalPermitUpdate = {
                    'Status': 'Approved',
                };

                let postRenewalRentalPermitResponse = await vvClient.forms.postFormRevision(null, renewalRentalPermitUpdate, rentalPermitTemplateID, getRenewalRentalPermitData[0]['revisionId']);
                if (postRenewalRentalPermitResponse.meta.status !== 201) {
                    throw new Error(`An error was encountered when attempting to update the ${rentalPermitTemplateID} form. ${postRenewalRentalPermitResponse.hasOwnProperty('meta') ? postRenewalRentalPermitResponse.meta.statusMsg : postRenewalRentalPermitResponse.message}`);
                }
            }
        }


        for (const rentalRenewal of rentalRenewalPermitFee) {
            // Find and approve the new Rental Permit record after successful invoice payment
            let renewalRentalPermitQueryParams = {
                q: `[Record ID] eq '${rentalRenewal['primary ID']}' AND ([Status] eq 'New' OR [Status] eq 'Delinquent')`,
                fields: 'instanceName, revisionId, property ID'
            };

            let getRenewalRentalPermitResponse = await vvClient.forms.getForms(renewalRentalPermitQueryParams, rentalPermitTemplateID);
            getRenewalRentalPermitResponse = JSON.parse(getRenewalRentalPermitResponse);
            let getRenewalRentalPermitData = (getRenewalRentalPermitResponse.hasOwnProperty('data') ? getRenewalRentalPermitResponse.data : null);
            let getRenewalRentalPermitLength = (Array.isArray(getRenewalRentalPermitData) ? getRenewalRentalPermitData.length : 0);

            if (getRenewalRentalPermitResponse.meta.status !== 200) {
                throw new Error(`Error encountered when calling getForms. ${getRenewalRentalPermitResponse.meta.statusMsg}.`);
            }
            if (!getRenewalRentalPermitData || !Array.isArray(getRenewalRentalPermitData)) {
                throw new Error(`Data was not returned when calling getForms.`);
            }

            let renewalRentalPermitUpdate = {
                'Status': 'Approved',
            };

            let postRenewalRentalPermitResponse = await vvClient.forms.postFormRevision(null, renewalRentalPermitUpdate, rentalPermitTemplateID, getRenewalRentalPermitData[0]['revisionId']);
            if (postRenewalRentalPermitResponse.meta.status !== 201) {
                throw new Error(`An error was encountered when attempting to update the ${rentalPermitTemplateID} form. ${postRenewalRentalPermitResponse.hasOwnProperty('meta') ? postRenewalRentalPermitResponse.meta.statusMsg : postRenewalRentalPermitResponse.message}`);
            }

            // Find and expire the old Rental Permit record after successful invoice payment
            let propertyID = getRenewalRentalPermitData[0]['property ID'];
            let expiringRentalPermitQueryParams = {
                q: `[Property ID] eq '${propertyID}' AND ([Status] eq 'About to Expire' OR [Status] eq 'Expired')`,
                fields: 'instanceName, revisionId'
            };

            let getExpiringRentalPermitResponse = await vvClient.forms.getForms(expiringRentalPermitQueryParams, rentalPermitTemplateID)
            getExpiringRentalPermitResponse = JSON.parse(getExpiringRentalPermitResponse)
            let getExpiringRentalPermitData = (getExpiringRentalPermitResponse.hasOwnProperty('data') ? getExpiringRentalPermitResponse.data : null);
            let getExpiringRentalPermitLength = (Array.isArray(getExpiringRentalPermitData) ? getExpiringRentalPermitData.length : 0)

            if (getExpiringRentalPermitResponse.meta.status !== 200) {
                throw new Error(`Error encountered when calling getForms. ${getExpiringRentalPermitResponse.meta.statusMsg}.`);
            }
            if (!getExpiringRentalPermitData || !Array.isArray(getExpiringRentalPermitData)) {
                throw new Error(`Data was not returned when calling getForms.`);
            }

            if (getExpiringRentalPermitLength > 0) {
                let expiringRentalPermitUpdate = {
                    'Status': 'Expired'
                };

                let postExpiringRentalPermitResp = await vvClient.forms.postFormRevision(null, expiringRentalPermitUpdate, rentalPermitTemplateID, getExpiringRentalPermitData[0]['revisionId']);
                if (postExpiringRentalPermitResp.meta.status !== 201) {
                    throw new Error(`An error was encountered when attempting to update the ${rentalPermitTemplateID} form. ${postExpiringRentalPermitResp.hasOwnProperty('meta') ? postExpiringRentalPermitResp.meta.statusMsg : postExpiringRentalPermitResp.message}`);
                }
            }
        }

        //Update status of the Rental Permit New Building Construction to Approved. 
        for (const newBuildingPermit of newBuildingPermitFee) {

            let queryParams = {
                q: `[Record ID] eq '${newBuildingPermit['primary ID']}'`,
                fields: 'instanceName, revisionId'
            };

            let getFormsResp = await vvClient.forms.getForms(queryParams, rentalPermitTemplateID)
            getFormsResp = JSON.parse(getFormsResp)
            let getFormsData = (getFormsResp.hasOwnProperty('data') ? getFormsResp.data : null);
            let getFormsLength = (Array.isArray(getFormsData) ? getFormsData.length : 0)

            if (getFormsResp.meta.status !== 200) {
                throw new Error(`Error encountered when calling getForms. ${getFormsResp.meta.statusMsg}.`)
            }
            if (!getFormsData || !Array.isArray(getFormsData)) {
                throw new Error(`Data was not returned when calling getForms.`)
            }

            let formUpdateObj = {
                'Status': 'Approved',
            }

            let postFormResp = await vvClient.forms.postFormRevision(null, formUpdateObj, rentalPermitTemplateID, getFormsData[0]['revisionId'])
            if (postFormResp.meta.status !== 201) {
                throw new Error(`An error was encountered when attempting to update the ${rentalPermitTemplateID} form. ${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message}`)
            }

        }

        let rentalNewInspections = []

        for (const apartmentLicense of apartmentLicenseFee) {
            rentalNewInspections.push(apartmentLicense['primary ID'])
        }

        for (const cocLicense of certificateOfComplianceFee) {
            rentalNewInspections.push(cocLicense['primary ID'])
        }

        rentalNewInspections = [...new Set(rentalNewInspections)]

        for (const newInspection of rentalNewInspections) {
            let rentalInspectionArr = [
                { name: 'COC ID', value: newInspection },
                { name: 'New or Renewal', value: 'New' },
            ];

            let rentalInspectionResp = await vvClient.scripts.runWebService('LibRentalStartInspection', rentalInspectionArr)
            let rentalInspectionData = (rentalInspectionResp.hasOwnProperty('data') ? rentalInspectionResp.data : null)

            if (rentalInspectionResp.meta.status !== 200) {
                throw new Error(`There was an error when calling LibRentalStartInspection.`)
            }
            if (!rentalInspectionData || !Array.isArray(rentalInspectionData)) {
                throw new Error(`Data was not returned when calling LibRentalStartInspection.`)
            }
            if (rentalInspectionData[0] === 'Error') {
                throw new Error(`The call to LibRentalStartInspection returned with an error. ${rentalInspectionData[1]}.`)
            }
            if (rentalInspectionData[0] !== 'Success') {
                throw new Error(`The call to LibRentalStartInspection returned with an unhandled error.`)
            }
        }


        // STEP 2 - Call postFormRevision to update the Status of all Invoice Line Items associated with the Invoice to Paid.
        for (const lineItem of invoiceLineItems) {
            let formUpdateObj = {
                'Status': 'Paid',
                'Form Saved': 'True'
            }

            let postFormResp = await vvClient.forms.postFormRevision(null, formUpdateObj, invoiceLineItemTemplateID, lineItem['revisionId'])
            if (postFormResp.meta.status !== 201) {
                throw new Error(`An error was encountered when attempting to update the ${invoiceLineItemTemplateID} form. ${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message}`)
            }
        }


        // STEP 3 - Call LibGenerateOpPermCertificate to generate certificates for all line items that were paid.
        let generatedOpPermCertificates = ''

        if (newCert.length > 0 || renewalCert.length > 0) {
            let genCertArr = [
                { name: 'New Certificates', value: newCert },
                { name: 'Renewal Certificates', value: renewalCert },
            ];

            let opPermGenCertResp = await vvClient.scripts.runWebService('LibGenerateOpPermCertificate', genCertArr)
            let opPermGenCertData = (opPermGenCertResp.hasOwnProperty('data') ? opPermGenCertResp.data : null)

            if (opPermGenCertResp.meta.status !== 200) {
                throw new Error(`There was an error when calling LibGenerateOpPermCertificate.`)
            }
            if (!opPermGenCertData || !Array.isArray(opPermGenCertData)) {
                throw new Error(`Data was not returned when calling LibGenerateOpPermCertificate.`)
            }
            if (opPermGenCertData[0] === 'Error') {
                throw new Error(`The call to LibGenerateOpPermCertificate returned with an error. ${opPermGenCertData[1]}.`)
            }
            if (opPermGenCertData[0] !== 'Success') {
                throw new Error(`The call to LibGenerateOpPermCertificate returned with an unhandled error.`)
            }

            generatedOpPermCertificates = opPermGenCertData[2]

            for (const renewalCert of opPermGenCertData[2]) {
                generatedCertificatesURL.push(`<a href="${baseURL}/ReportViewer?rpid=75f93588-2788-eb11-81fc-a5e993b5732d&PermitID=${renewalCert['instanceName']}">Click here to print the Certificate for ${renewalCert['instanceName']}.</a>`)
            }
        }


        // STEP 4 - Call getForms to get Certificates of a paid fee schedule adjustment.
        let generatedCertificatesURL = []

        for (const paidPermit of feeScheduleAdjustments) {
            let queryParams = {
                q: `[Operational Permit ID] eq '${paidPermit['primary ID']}' AND [Certificate Type] eq 'New'`,
                fields: 'instanceName, revisionId'
            };

            let getFormsResp = await vvClient.forms.getForms(queryParams, certificateTemplateID)
            getFormsResp = JSON.parse(getFormsResp)
            let getFormsData = (getFormsResp.hasOwnProperty('data') ? getFormsResp.data : null);
            let getFormsLength = (Array.isArray(getFormsData) ? getFormsData.length : 0)

            if (getFormsResp.meta.status !== 200) {
                throw new Error(`Error encountered when calling getForms. ${getFormsResp.meta.statusMsg}.`)
            }
            if (!getFormsData || !Array.isArray(getFormsData)) {
                throw new Error(`Data was not returned when calling getForms.`)
            }


            // STEP 4A - Update Certificate Status.
            if (getFormsLength > 0) {
                let formUpdateObj = {
                    'Status': 'Open'
                }

                let postFormResp = await vvClient.forms.postFormRevision(null, formUpdateObj, certificateTemplateID, getFormsData[0]['revisionId'])
                if (postFormResp.meta.status !== 201) {
                    throw new Error(`An error was encountered when attempting to update the ${certificateTemplateID} form. ${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message}`)
                }

                generatedCertificatesURL.push(`<a href="${baseURL}/ReportViewer?rpid=75f93588-2788-eb11-81fc-a5e993b5732d&PermitID=${getFormsData[0]['instanceName']}">Click here to print the Certificate for ${getFormsData[0]['instanceName']}.</a>`)
            }
        }


        // STEP 5 - Call LibEmailGenerateAndCreateCommunicationLog to send person who paid a receipt.
        let certificateURLS = `${generatedCertificatesURL.join('<br><br>')} <br><br> You can print a Certificate from your home screen under the Open Certificates tab.`

        if (InvoiceCategory === 'Rentals') {
            certificateURLS = ''
        }

        let tokenArr = [
            { name: TokenInvoiceID, value: InvoiceID },
            { name: TokenCertificateURL, value: certificateURLS },
            { name: TokenReceiptURL, value: `<a href="${baseURL}/ReportViewer?rpid=fad5b59f-cbdf-4b81-a085-25a02d5e2f6c&InvoiceID=${InvoiceID}">Click here to print your receipt.</a>` },
        ];
        let emailRequestArr = [
            { name: 'Email Name', value: emailTemplateName },
            { name: 'Tokens', value: tokenArr },
            { name: 'Email Address', value: PaidByEmail },
            { name: 'Email AddressCC', value: '' },
            { name: 'SendDateTime', value: '' },
            { name: 'RELATETORECORD', value: [InvoiceID, PrimaryID] },
            {
                name: 'OTHERFIELDSTOUPDATE', value: {
                    'Primary Record ID': InvoiceID,
                    'Other Record': PrimaryID
                }
            }
        ];

        let emailCommLogResp = await vvClient.scripts.runWebService('LibEmailGenerateAndCreateCommunicationLog', emailRequestArr)
        let emailCommLogData = (emailCommLogResp.hasOwnProperty('data') ? emailCommLogResp.data : null)

        if (emailCommLogResp.meta.status !== 200) {
            throw new Error(`There was an error when calling LibEmailGenerateAndCreateCommunicationLog.`)
        }
        if (!emailCommLogData || !Array.isArray(emailCommLogData)) {
            throw new Error(`Data was not returned when calling LibEmailGenerateAndCreateCommunicationLog.`)
        }
        if (emailCommLogData[0] === 'Error') {
            throw new Error(`The call to LibEmailGenerateAndCreateCommunicationLog returned with an error. ${emailCommLogData[1]}.`)
        }
        if (emailCommLogData[0] !== 'Success') {
            throw new Error(`The call to LibEmailGenerateAndCreateCommunicationLog returned with an unhandled error.`)
        }


        // STEP 6 - Send response with return array.
        outputCollection[0] = 'Success'
        outputCollection[1] = 'Invoice Line Items Paid.'
        outputCollection[2] = generatedOpPermCertificates
        outputCollection[3] = null

    } catch (error) {
        // Log errors captured.
        logger.info(JSON.stringify(`${error} ${errorLog}`))
        outputCollection[0] = 'Error'
        outputCollection[1] = `${error.message}`
        outputCollection[2] = null
        outputCollection[3] = errorLog
    } finally {
        response.json(200, outputCollection)
    }
}
