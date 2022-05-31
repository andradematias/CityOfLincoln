let logger = require('../log');
let moment = require('moment-timezone');

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
    /*Script Name:  OpPermOperationalPermitNextStep2
     Customer:      City of Lincoln
     Purpose:       The purpose of this process is to handle submission of an Operational Permit.
    
     Parameters:    
                    
     Return Array:  [0] Status: 'Success', 'Error'
                    [1] Message
                    [2] error array or null
                    
     Pseudo code:   1. Call LibGenerateInvoiceLineItem to generate an Invoice Line Item for the initial permit fee.
                    2. Send response with return array.
   
     Date of Dev: 02/25/2021
     Last Rev Date: 05/27/2022
     Revision Notes:
     02/15/2021  - Rocky Borg: Script created.
     02/01/2022 - Maxwell Rehbein: changed late fee date to after Feb 28 2022
     02/25/2022 - Morgan Ward: update late fee date to after March 31 2022 (fee will begin April 1st). Ticket 92290 (S-CCF-000356).
     03/30/2022 - Morgan Ward: update late fee date to after April 30 2022 (fee will begin May 1st). Ticket 93768 (S-CCF-000392).
     04/27/2022 - Joshua Scott: update late fee date to after may 30 2022 (fee will begin June 1st). Ticket 94243 (S-CCF-000413).
       05/27/2022 - Nikola Mathews: update late fee date to after June 30 2022 (fee will begin July  1st).  See STEP 18 - Charge 
                      late fee on migration renewals after June 30 2022.  Ticket 94731 (S-CCF-000429).
     */

    logger.info('Start of the process OpPermOperationalPermitNextStep2 at ' + Date())

    /**********************
     Configurable Variables
    ***********************/
    // Form Template Names
    let contactRecordTemplateID = 'Contact Record'
    let designeeTemplateID = 'Designee'
    let inspectionTemplateID = 'OpPerm Inspection'

    let timeZone = 'America/Chicago'
    let dateFormat = 'L'

    // Response array populated in try or catch block, used in response sent in finally block.
    let outputCollection = []
    // Array for capturing error messages that may occur within helper functions.
    let errorLog = []

    try {
        /*********************
         Form Record Variables
        **********************/
        // Create variables for the values on the form record
        let baseURL = getFieldValueByName('Base URL')
        let migrationRenewal = getFieldValueByName('Migration Renewal', 'isOptional')
        let PermitClassification = getFieldValueByName('ClassificationDD', 'isOptional')

        let OperationalPermitID = getFieldValueByName('OperationalPermitID')
        let BusinessID = getFieldValueByName('Business ID')
        let ProfileID = getFieldValueByName('Profile ID', 'isOptional')
        let OperationalPermitType = getFieldValueByName('Operational Permit Type')
        let PermitFee = getFieldValueByName('Permit Fee')


        // let FacilityName = getFieldValueByName('Facility Name')
        let FacilityStreetAddress = getFieldValueByName('Facility Street Address')
        let FacilityRoomSuite = getFieldValueByName('Facility Room Suite', 'isOptional')
        // let FacilityZipCode = getFieldValueByName('Facility Zip Code', 'isOptional')
        // let FacilityCity = getFieldValueByName('Facility City')
        // let FacilityState = getFieldValueByName('Facility State')
        // let FacilityCounty = getFieldValueByName('Facility County', 'isOptional')
        let FacilityID = getFieldValueByName('Facility ID', 'isOptional')


        let BillingBusinessName = getFieldValueByName('Billing Business Name')
        let BillingFirstName = getFieldValueByName('Billing First Name', 'isOptional')
        let BillingLastName = getFieldValueByName('Billing Last Name', 'isOptional')
        let BillingMI = getFieldValueByName('Billing MI', 'isOptional')
        let BillingEmail = getFieldValueByName('Billing Email')
        let BillingWorkPhone = getFieldValueByName('Billing Work Phone', 'isOptional')
        let BillingCellPhone = getFieldValueByName('Billing Cell Phone', 'isOptional')
        let BillingStreetAddress = getFieldValueByName('Billing Street Address')
        let BillingRoomSuite = getFieldValueByName('Billing Room Suite', 'isOptional')
        let BillingZipCode = getFieldValueByName('Billing Zip Code')
        let BillingCity = getFieldValueByName('Billing City')
        let BillingState = getFieldValueByName('Billing State')
        let BillingCounty = getFieldValueByName('Billing County', 'isOptional')
        let BillingContactID = getFieldValueByName('Billing Contact ID', 'isOptional')


        let OnSiteFirstName = getFieldValueByName('On Site First Name')
        let OnSiteLastName = getFieldValueByName('On Site Last Name')
        let OnSiteMI = getFieldValueByName('On Site MI', 'isOptional')
        let OnSiteEmail = getFieldValueByName('On Site Email')
        let OnSiteWorkPhone = getFieldValueByName('On Site Work Phone', 'isOptional')
        let OnSiteCellPhone = getFieldValueByName('On Site Cell Phone', 'isOptional')
        let OnSiteContactID = getFieldValueByName('On Site Contact ID', 'isOptional')


        let ApplicantEmail = getFieldValueByName('Applicant Email', 'isOptional')
        let ApplicantFirstName = getFieldValueByName('Applicant First Name')
        let ApplicantLastName = getFieldValueByName('Applicant Last Name')
        let ApplicantPhone = getFieldValueByName('Applicant Phone', 'isOptional')

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
        if (!ProfileID) {

            if (!ApplicantEmail) {
                throw new Error(`An applicant email is required when an Operational Permit is completed by City Staff.`)
            }


            // STEP 1 - Call LibOpPermGetOrCreateUser to create account for Applicant when being filled out by city staff.
            let updateUserObject = [
                { name: 'Business Name', value: BillingBusinessName },
                { name: 'Business ID', value: BusinessID },
                { name: 'First Name', value: ApplicantFirstName },
                { name: 'Last Name', value: ApplicantLastName },
                { name: 'Email', value: ApplicantEmail },
                { name: 'Contact Type', value: 'Manager' },
                { name: 'BaseURL', value: baseURL },

            ]

            let userUpdateResp = await vvClient.scripts.runWebService('LibOpPermGetOrCreateUser', updateUserObject);
            let userUpdateData = (userUpdateResp.hasOwnProperty('data') ? userUpdateResp.data : null);

            if (userUpdateResp.meta.status != 200) {
                throw new Error(`An error was returned when updating the user account.`)
            }
            if (!userUpdateData || !Array.isArray(userUpdateData)) {
                throw new Error(`Data was not returned when calling LibOpPermGetOrCreateUser.`)
            }
            if (userUpdateData[0] === 'Error') {
                throw new Error(`The call to LibOpPermGetOrCreateUser returned with an error. ${userUpdateData[1]}.`)
            }
            if (userUpdateData[0] !== 'Success') {
                throw new Error(`The call to LibOpPermGetOrCreateUser returned with an unhandled error.`)
            }

            ProfileID = userUpdateData[2]

        }


        // STEP 2 - Check if contact record already exists for Applicant.
        let managerContactID = ''

        if (!ProfileID) {

            if (!ApplicantEmail) {
                throw new Error(`An Applicant Email is required when a form is completed by City of Lincoln staff.`)
            }

            let ApplicantEmailSearch = ApplicantEmail.replace(/'/g, "\\'")

            let queryParams = {
                q: `[Business ID] eq '${BusinessID}' AND [Email Address] eq '${ApplicantEmailSearch}' AND [Type Manager] eq 'True'`,
                fields: 'revisionId, instanceName'
            }

            let getFormsResp = await vvClient.forms.getForms(queryParams, contactRecordTemplateID)
            getFormsResp = JSON.parse(getFormsResp)
            let getFormsData = (getFormsResp.hasOwnProperty('data') ? getFormsResp.data : null);
            let getFormsLength = (Array.isArray(getFormsData) ? getFormsData.length : 0)

            if (getFormsResp.meta.status !== 200) {
                throw new Error(`Error encountered when calling getForms. ${getFormsResp.meta.statusMsg}.`)
            }
            if (!getFormsData || !Array.isArray(getFormsData)) {
                throw new Error(`Data was not returned when calling getForms.`)
            }

            if (getFormsLength > 0) {
                managerContactID = getFormsData[0]['instanceName']
            }


            if (!managerContactID) {
                // STEP 3 - Create a contact for the business owner that is linked to the Individual Record.
                let postFormsContactObj = {
                    'Type Manager': 'true',
                    'Owner Contact': 'true',
                    'Business ID': BusinessID,
                    'First Name': ApplicantFirstName,
                    'Last Name': ApplicantLastName,
                    'Email Address': ApplicantEmail,
                    'Work Phone': ApplicantPhone,
                    'Status': 'Active',
                    'chkbxFormSave': 'True',
                    'Manage or Owner': 'True',
                    'Profile ID': ProfileID
                }

                let postFormsContactResp = await vvClient.forms.postForms(null, postFormsContactObj, contactRecordTemplateID)
                let postFormsContactData = (postFormsContactResp.hasOwnProperty('data') ? postFormsContactResp.data : null)

                if (postFormsContactResp.meta.status !== 201) {
                    throw new Error(`An error was encountered when attempting to create the ${contactRecordTemplateID} record. 
    (${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message})`)
                }
                if (!postFormsContactData) {
                    throw new Error(`Data was not returned when calling postForms.`)
                }

            }
        }


        // STEP 4 - Call getForms to see if a contact record already exists for the billing contact.
        if (!BillingContactID) {
            let BillingEmailSearch = BillingEmail.replace(/'/g, "\\'")

            let queryParams = {
                q: `[Type Business Information] eq 'False' AND [Business ID] eq '${BusinessID}' AND [Email Address] eq '${BillingEmailSearch}'`,
                fields: 'revisionId, instanceName, Profile ID'
            }

            let getFormsResp = await vvClient.forms.getForms(queryParams, contactRecordTemplateID)
            getFormsResp = JSON.parse(getFormsResp)
            let getFormsData = (getFormsResp.hasOwnProperty('data') ? getFormsResp.data : null);
            let getFormsLength = (Array.isArray(getFormsData) ? getFormsData.length : 0)

            if (getFormsResp.meta.status !== 200) {
                throw new Error(`Error encountered when calling getForms. ${getFormsResp.meta.statusMsg}.`)
            }
            if (!getFormsData || !Array.isArray(getFormsData)) {
                throw new Error(`Data was not returned when calling getForms.`)
            }


            if (getFormsLength > 0) {

                BillingContactID = getFormsData[0]['instanceName']


                // STEP 5 - Update billing contact record if it exists.
                let formUpdateObj = {
                    'Type Billing': 'true',
                    'Business Name': BillingBusinessName,
                    'First Name': BillingFirstName,
                    'Last Name': BillingLastName,
                    'MI': BillingMI,
                    'Work Phone': BillingWorkPhone,
                    'Cell Phone': BillingCellPhone,
                    'Street Address': BillingStreetAddress,
                    'Room Suite': BillingRoomSuite,
                    'Zip Code': BillingZipCode,
                    'City': BillingCity,
                    'ddState': BillingState,
                    'ddCounty': BillingCounty,
                }

                let postFormResp = await vvClient.forms.postFormRevision(null, formUpdateObj, contactRecordTemplateID, getFormsData[0]['revisionId'])
                if (postFormResp.meta.status !== 201) {
                    throw new Error(`An error was encountered when attempting to update the ${contactRecordTemplateID} form. ${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message} ${errorMessageGuidance}`)
                }
            }

        }


        let billingProfileID = ''

        if (!BillingContactID) {
            // STEP 6 - Call LibOpPermGetOrCreateUser to setup Billing Contact account.
            let updateUserObject = [
                { name: 'Business Name', value: BillingBusinessName },
                { name: 'Business ID', value: BusinessID },
                { name: 'First Name', value: BillingFirstName },
                { name: 'Last Name', value: BillingLastName },
                { name: 'MI', value: BillingMI },
                { name: 'Email', value: BillingEmail },
                { name: 'Contact Type', value: 'Billing' },
                { name: 'BaseURL', value: baseURL },

            ]

            let userUpdateResp = await vvClient.scripts.runWebService('LibOpPermGetOrCreateUser', updateUserObject);
            let userUpdateData = (userUpdateResp.hasOwnProperty('data') ? userUpdateResp.data : null);

            if (userUpdateResp.meta.status != 200) {
                throw new Error(`An error was returned when updating the user account.`)
            }
            if (!userUpdateData || !Array.isArray(userUpdateData)) {
                throw new Error(`Data was not returned when calling LibOpPermGetOrCreateUser.`)
            }
            if (userUpdateData[0] === 'Error') {
                throw new Error(`The call to LibOpPermGetOrCreateUser returned with an error. ${userUpdateData[1]}.`)
            }
            if (userUpdateData[0] !== 'Success') {
                throw new Error(`The call to LibOpPermGetOrCreateUser returned with an unhandled error.`)
            }

            billingProfileID = userUpdateData[2]


            // STEP 7 - Create contact record for Billing Contact.
            let postFormsContactObj = {
                'Type Billing': 'true',
                'Business Name': BillingBusinessName,
                'First Name': BillingFirstName,
                'Last Name': BillingLastName,
                'MI': BillingMI,
                'Email Address': BillingEmail,
                'Work Phone': BillingWorkPhone,
                'Cell Phone': BillingCellPhone,
                'Street Address': BillingStreetAddress,
                'Room Suite': BillingRoomSuite,
                'Zip Code': BillingZipCode,
                'City': BillingCity,
                'ddState': BillingState,
                'ddCounty': BillingCounty,
                'Status': 'Active',
                'chkbxFormSave': 'True',
                'Profile ID': billingProfileID,
                'Business ID': BusinessID
            }

            let postFormsContactResp = await vvClient.forms.postForms(null, postFormsContactObj, contactRecordTemplateID)
            let postFormsContactData = (postFormsContactResp.hasOwnProperty('data') ? postFormsContactResp.data : null)

            if (postFormsContactResp.meta.status !== 201) {
                throw new Error(`An error was encountered when attempting to create the ${contactRecordTemplateID} record. 
      (${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message})`)
            }
            if (!postFormsContactData) {
                throw new Error(`Data was not returned when calling postForms.`)
            }

            BillingContactID = postFormsContactData['instanceName']
        }


        // STEP 8 - Check for Designee record for billing contact.
        if (BillingContactID) {
            let queryParams = {
                q: `[Contact ID] eq '${BillingContactID}' AND [Operational Permit ID] eq '${OperationalPermitID}'`,
                fields: 'revisionId, instanceName'
            }

            let getFormsResp = await vvClient.forms.getForms(queryParams, designeeTemplateID)
            getFormsResp = JSON.parse(getFormsResp)
            let getFormsData = (getFormsResp.hasOwnProperty('data') ? getFormsResp.data : null);
            let getFormsLength = (Array.isArray(getFormsData) ? getFormsData.length : 0)

            if (getFormsResp.meta.status !== 200) {
                throw new Error(`Error encountered when calling getForms. ${getFormsResp.meta.statusMsg}.`)
            }
            if (!getFormsData || !Array.isArray(getFormsData)) {
                throw new Error(`Data was not returned when calling getForms.`)
            }


            if (getFormsLength > 0) {
                // STEP 9 - Update designee record to be the assigned billing contact.
                let formUpdateObj = {
                    'Type Billing': 'True'
                }

                let postFormResp = await vvClient.forms.postFormRevision(null, formUpdateObj, designeeTemplateID, getFormsData[0]['revisionId'])
                if (postFormResp.meta.status !== 201) {
                    throw new Error(`An error was encountered when attempting to update the ${designeeTemplateID} form. ${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message}`)
                }

            }


            // STEP 10 - Create Designee Record for billing contact if one didn't exist.
            if (getFormsLength === 0) {
                let postFormsBillingDesigneeObj = {
                    'Type Billing': 'True',
                    'Contact ID': BillingContactID,
                    'Business ID': BusinessID,
                    'Profile ID': billingProfileID,
                    'Operational Permit ID': OperationalPermitID,
                    'Status': 'Active',
                    'Form Saved': 'True',
                }

                let postFormsBillingDesigneeResp = await vvClient.forms.postForms(null, postFormsBillingDesigneeObj, designeeTemplateID)
                let postFormsBillingDesigneeData = (postFormsBillingDesigneeResp.hasOwnProperty('data') ? postFormsBillingDesigneeResp.data : null)

                if (postFormsBillingDesigneeResp.meta.status !== 201) {
                    throw new Error(`An error was encountered when attempting to create the ${designeeTemplateID} record. 
      (${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message})`)
                }
                if (!postFormsBillingDesigneeData) {
                    throw new Error(`Data was not returned when calling postForms.`)
                }
            }
        }


        // STEP 11 - Call getForms to check if a Contact Record already exists for the onsite contact.
        if (!OnSiteContactID) {
            let OnSiteEmailSearch = OnSiteEmail.replace(/'/g, "\\'")
            let OnSiteFirstNameSearch = OnSiteFirstName.replace(/'/g, "\\'")
            let OnSiteLastNameSearch = OnSiteLastName.replace(/'/g, "\\'")

            let queryParams = {
                q: `[Type Business Information] eq 'False' AND [Business ID] eq '${BusinessID}' AND [Email Address] eq '${OnSiteEmailSearch}' AND [First Name] eq '${OnSiteFirstNameSearch}' AND [Last Name] eq '${OnSiteLastNameSearch}'`,
                fields: 'revisionId, instanceName'
            }

            let getFormsResp = await vvClient.forms.getForms(queryParams, contactRecordTemplateID)
            getFormsResp = JSON.parse(getFormsResp)
            let getFormsData = (getFormsResp.hasOwnProperty('data') ? getFormsResp.data : null);
            let getFormsLength = (Array.isArray(getFormsData) ? getFormsData.length : 0)

            if (getFormsResp.meta.status !== 200) {
                throw new Error(`Error encountered when calling getForms. ${getFormsResp.meta.statusMsg}.`)
            }
            if (!getFormsData || !Array.isArray(getFormsData)) {
                throw new Error(`Data was not returned when calling getForms.`)
            }


            // STEP 12 - If onsite contact record found update it.
            if (getFormsLength > 0) {

                onsiteRevisionID = getFormsData[0]['revisionId']
                OnSiteContactID = getFormsData[0]['instanceName']

                let formUpdateObj = {
                    'Type On Site': 'true',
                    'Work Phone': OnSiteWorkPhone,
                    'Cell Phone': OnSiteCellPhone,
                    'Status': 'Active',
                    'Business ID': BusinessID
                }

                let postFormResp = await vvClient.forms.postFormRevision(null, formUpdateObj, contactRecordTemplateID, onsiteRevisionID)
                if (postFormResp.meta.status !== 201) {
                    throw new Error(`An error was encountered when attempting to update the ${contactRecordTemplateID} form. ${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message} ${errorMessageGuidance}`)
                }
            }
        }


        // STEP 13 - If onsite contact exists check if a designee record already exists.
        if (OnSiteContactID) {
            let queryParams = {
                q: `[Contact ID] eq '${OnSiteContactID}' AND [Operational Permit ID] eq '${OperationalPermitID}'`,
                fields: 'revisionId, instanceName'
            }

            let getFormsResp = await vvClient.forms.getForms(queryParams, designeeTemplateID)
            getFormsResp = JSON.parse(getFormsResp)
            let getFormsData = (getFormsResp.hasOwnProperty('data') ? getFormsResp.data : null);
            let getFormsLength = (Array.isArray(getFormsData) ? getFormsData.length : 0)

            if (getFormsResp.meta.status !== 200) {
                throw new Error(`Error encountered when calling getForms. ${getFormsResp.meta.statusMsg}.`)
            }
            if (!getFormsData || !Array.isArray(getFormsData)) {
                throw new Error(`Data was not returned when calling getForms.`)
            }


            // STEP 14 - If Designee Record exists update it to be the assigned On Site Contact.
            if (getFormsLength > 0) {
                let formUpdateObj = {
                    'Type On Site': 'True'
                }

                let postFormResp = await vvClient.forms.postFormRevision(null, formUpdateObj, designeeTemplateID, getFormsData[0]['revisionId'])
                if (postFormResp.meta.status !== 201) {
                    throw new Error(`An error was encountered when attempting to update the ${designeeTemplateID} form. ${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message}`)
                }

            }
        }


        // STEP 15 - If On Site Contact record doesn't exist call postForms to create it.
        if (!OnSiteContactID) {
            let postFormsContactObj = {
                'Type On Site': 'true',
                'First Name': OnSiteFirstName,
                'Last Name': OnSiteLastName,
                'MI': OnSiteMI,
                'Email Address': OnSiteEmail,
                'Work Phone': OnSiteWorkPhone,
                'Cell Phone': OnSiteCellPhone,
                'Status': 'Active',
                'chkbxFormSave': 'True',
                'Business ID': BusinessID
            }

            let postFormsContactResp = await vvClient.forms.postForms(null, postFormsContactObj, contactRecordTemplateID)
            let postFormsContactData = (postFormsContactResp.hasOwnProperty('data') ? postFormsContactResp.data : null)

            if (postFormsContactResp.meta.status !== 201) {
                throw new Error(`An error was encountered when attempting to create the ${contactRecordTemplateID} record. 
              (${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message})`)
            }
            if (!postFormsContactData) {
                throw new Error(`Data was not returned when calling postForms.`)
            }

            OnSiteContactID = postFormsContactData['instanceName']


            // STEP 16 - Call postForms to create Designee record for the assigned On Site Contact.
            let postFormsOnSiteDesigneeObj = {
                'Type On Site': 'True',
                'Contact ID': OnSiteContactID,
                'Business ID': BusinessID,
                'Operational Permit ID': OperationalPermitID,
                'Status': 'Active',
                'Form Saved': 'True',
            }

            let postFormsOnSiteDesigneeResp = await vvClient.forms.postForms(null, postFormsOnSiteDesigneeObj, designeeTemplateID)
            let postFormsOnSiteDesigneeData = (postFormsOnSiteDesigneeResp.hasOwnProperty('data') ? postFormsOnSiteDesigneeResp.data : null)

            if (postFormsOnSiteDesigneeResp.meta.status !== 201) {
                throw new Error(`An error was encountered when attempting to create the ${designeeTemplateID} record. 
      (${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message})`)
            }
            if (!postFormsOnSiteDesigneeData) {
                throw new Error(`Data was not returned when calling postForms.`)
            }
        }


        // STEP 17 - Call LibGenerateInvoiceLineItem to generate an Invoice Line Item for the initial permit fee.
        let lineItemSubCategory = 'Initial Permit Fee'
        let lineItemDescription = `${OperationalPermitType} - ${FacilityStreetAddress} ${FacilityRoomSuite}`
        let certificateYear = moment().format('YYYY')

        if (migrationRenewal.toLowerCase() === 'true') {
            certificateYear = '2022'
            lineItemSubCategory = 'Renewal Fee'
            lineItemDescription = `${OperationalPermitType} - ${FacilityStreetAddress} ${FacilityRoomSuite}`

            if (PermitClassification && PermitClassification.trim() && PermitClassification !== 'Select Item') {
                lineItemDescription = `${OperationalPermitType} ( ${PermitClassification} ) - ${FacilityStreetAddress} ${FacilityRoomSuite}`
            }
        }

        // Some migration renewals won't owe any fees, check if anything is owed.
        if (parseInt(PermitFee, 10) > 0) {
            let invoiceLineItemRequestArr = [
                { name: 'Category', value: 'Operational Permits' },
                { name: 'Sub Category', value: lineItemSubCategory },
                { name: 'Permit Type', value: OperationalPermitType },
                { name: 'Description', value: lineItemDescription },
                { name: 'Amount', value: PermitFee },
                { name: 'Operational Permit ID', value: OperationalPermitID },
                { name: 'Business ID', value: BusinessID },
                { name: 'OpPerm Certificate Year', value: certificateYear },
            ];

            let genInvoiceLineItemResp = await vvClient.scripts.runWebService('LibGenerateInvoiceLineItem', invoiceLineItemRequestArr)
            let genInvoiceLineItemData = (genInvoiceLineItemResp.hasOwnProperty('data') ? genInvoiceLineItemResp.data : null)

            if (genInvoiceLineItemResp.meta.status !== 200) {
                throw new Error(`There was an error when calling LibGenerateInvoiceLineItem.`)
            }
            if (!genInvoiceLineItemData || !Array.isArray(genInvoiceLineItemData)) {
                throw new Error(`Data was not returned when calling LibGenerateInvoiceLineItem.`)
            }
            if (genInvoiceLineItemData[0] === 'Error') {
                errorLog.push(...genInvoiceLineItemData[2])
                throw new Error(`The call to LibGenerateInvoiceLineItem returned with an error. ${genInvoiceLineItemData[1]}.`)
            }
            if (genInvoiceLineItemData[0] !== 'Success') {
                throw new Error(`The call to LibGenerateInvoiceLineItem returned with an unhandled error.`)
            }
        }


        // STEP 18 - Charge late fee on migration renewals if after June 30 2022.
        if (migrationRenewal && migrationRenewal.toLowerCase() === 'true' && moment(moment().tz(timeZone)).isAfter('2022-06-30', 'day') && OperationalPermitType !== 'Storage and Use Liquefied Petroleum Gas' && OperationalPermitType !== 'Childcare Facilities') {

            let invoiceLineItemRequestArr = [
                { name: 'Category', value: 'Operational Permits' },
                { name: 'Sub Category', value: 'Late Fee' },
                { name: 'Permit Type', value: OperationalPermitType },
                { name: 'Description', value: lineItemDescription },
                { name: 'Amount', value: '75' },
                { name: 'Operational Permit ID', value: OperationalPermitID },
                { name: 'Business ID', value: BusinessID },
                { name: 'OpPerm Certificate Year', value: '2022' },
            ];

            let genInvoiceLineItemResp = await vvClient.scripts.runWebService('LibGenerateInvoiceLineItem', invoiceLineItemRequestArr)
            let genInvoiceLineItemData = (genInvoiceLineItemResp.hasOwnProperty('data') ? genInvoiceLineItemResp.data : null)

            if (genInvoiceLineItemResp.meta.status !== 200) {
                throw new Error(`There was an error when calling LibGenerateInvoiceLineItem.`)
            }
            if (!genInvoiceLineItemData || !Array.isArray(genInvoiceLineItemData)) {
                throw new Error(`Data was not returned when calling LibGenerateInvoiceLineItem.`)
            }
            if (genInvoiceLineItemData[0] === 'Error') {
                errorLog.push(...genInvoiceLineItemData[2])
                throw new Error(`The call to LibGenerateInvoiceLineItem returned with an error. ${genInvoiceLineItemData[1]}.`)
            }
            if (genInvoiceLineItemData[0] !== 'Success') {
                throw new Error(`The call to LibGenerateInvoiceLineItem returned with an unhandled error.`)
            }

        }


        // STEP 19 - Call getForms to check if there are outstanding fees from the inspection record.
        if (migrationRenewal && migrationRenewal.toLowerCase() === 'true') {
            let queryInspectionParams = {
                q: `[Inspection Type] eq 'Renewal' AND [Operational Permit ID] eq '${OperationalPermitID}'`,
                fields: 'instanceName, revisionId, Reinspection Fee, Reinspection Fee Description, Chief Inspector Waive Fee'
            };

            let getInspectionFormsResp = await vvClient.forms.getForms(queryInspectionParams, inspectionTemplateID)
            getInspectionFormsResp = JSON.parse(getInspectionFormsResp)
            let getInspectionFormsData = (getInspectionFormsResp.hasOwnProperty('data') ? getInspectionFormsResp.data : null);
            let getInspectionFormsLength = (Array.isArray(getInspectionFormsData) ? getInspectionFormsData.length : 0)

            if (getInspectionFormsResp.meta.status !== 200) {
                throw new Error(`Error encountered when calling getForms. ${getInspectionFormsResp.meta.statusMsg}.`)
            }
            if (!getInspectionFormsData || !Array.isArray(getInspectionFormsData)) {
                throw new Error(`Data was not returned when calling getForms.`)
            }


            // STEP 19A - Call LibGenerateInvoiceLineItem to bill outstanding fees from inspection.
            let reinspectionInvoiced = false

            if (getInspectionFormsLength > 0 && getInspectionFormsData[0]['chief Inspector Waive Fee'].toLowerCase() === 'false' && parseInt(getInspectionFormsData[0]['reinspection Fee'], 10) > 0) {

                let invoiceLineItemRequestArr = [
                    { name: 'Category', value: 'Operational Permits' },
                    { name: 'Sub Category', value: 'Re-Inspection Fee' },
                    { name: 'Permit Type', value: OperationalPermitType },
                    { name: 'Description', value: `Re-Inspection Fee for ${getInspectionFormsData[0]['instanceName']}. ${getInspectionFormsData[0]['reinspection Fee Description']}` },
                    { name: 'Amount', value: getInspectionFormsData[0]['reinspection Fee'] },
                    { name: 'Operational Permit ID', value: OperationalPermitID },
                    { name: 'Business ID', value: BusinessID },
                    { name: 'Waived', value: 'No' }
                ];

                let genInvoiceLineItemResp = await vvClient.scripts.runWebService('LibGenerateInvoiceLineItem', invoiceLineItemRequestArr)
                let genInvoiceLineItemData = (genInvoiceLineItemResp.hasOwnProperty('data') ? genInvoiceLineItemResp.data : null)

                if (genInvoiceLineItemResp.meta.status !== 200) {
                    throw new Error(`There was an error when calling LibGenerateInvoiceLineItem.`)
                }
                if (!genInvoiceLineItemData || !Array.isArray(genInvoiceLineItemData)) {
                    throw new Error(`Data was not returned when calling LibGenerateInvoiceLineItem.`)
                }
                if (genInvoiceLineItemData[0] === 'Error') {
                    errorLog.push(...genInvoiceLineItemData[2])
                    throw new Error(`The call to LibGenerateInvoiceLineItem returned with an error. ${genInvoiceLineItemData[1]}.`)
                }
                if (genInvoiceLineItemData[0] !== 'Success') {
                    throw new Error(`The call to LibGenerateInvoiceLineItem returned with an unhandled error.`)
                }

                reinspectionInvoiced = true
            }


            // STEP 19B - Call postFormRevision to update inspection record after invoice line items have been generated.
            let formUpdateObj = {
                'Business ID': BusinessID
            }

            if (reinspectionInvoiced) {
                formUpdateObj['Reinspection Fee'] = '0'
                formUpdateObj['Waive Reinspection Fee'] = 'Select Item'
                formUpdateObj['Reinspection Required'] = 'Select Item'
            }

            let postFormResp = await vvClient.forms.postFormRevision(null, formUpdateObj, inspectionTemplateID, getInspectionFormsData[0]['revisionId'])
            if (postFormResp.meta.status !== 201) {
                throw new Error(`An error was encountered when attempting to update the ${inspectionTemplateID} form. ${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message}`)
            }

        }


        // if (migrationRenewal && migrationRenewal.toLowerCase() === 'true' && (OperationalPermitType === 'Storage and Use Liquefied Petroleum Gas' || OperationalPermitType === 'Childcare Facilities')) {

        //   let genCertArr = [
        //     { name: 'Renewal Certificates', value: [{ 'Permit ID': OperationalPermitID, 'Certificate Year': '2022' }] },
        //   ];

        //   let opPermGenCertResp = await vvClient.scripts.runWebService('LibGenerateOpPermCertificate', genCertArr)
        //   let opPermGenCertData = (opPermGenCertResp.hasOwnProperty('data') ? opPermGenCertResp.data : null)

        //   if (opPermGenCertResp.meta.status !== 200) {
        //     throw new Error(`There was an error when calling LibGenerateOpPermCertificate.`)
        //   }
        //   if (!opPermGenCertData || !Array.isArray(opPermGenCertData)) {
        //     throw new Error(`Data was not returned when calling LibGenerateOpPermCertificate.`)
        //   }
        //   if (opPermGenCertData[0] === 'Error') {
        //     throw new Error(`The call to LibGenerateOpPermCertificate returned with an error. ${opPermGenCertData[1]}.`)
        //   }
        //   if (opPermGenCertData[0] !== 'Success') {
        //     throw new Error(`The call to LibGenerateOpPermCertificate returned with an unhandled error.`)
        //   }
        // }


        // STEP 20 - Object to send to client. 
        let opPermObj = {
            'Facility ID': FacilityID,
            'Billing Contact ID': BillingContactID,
            'On Site Contact ID': OnSiteContactID
        }


        // STEP 21 - Send response with return array.
        outputCollection[0] = 'Success'
        outputCollection[1] = 'Operational Permit Submitted.'
        outputCollection[2] = opPermObj
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