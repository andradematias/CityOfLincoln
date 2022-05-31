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
    /*Script Name:  InvoiceCheckUnpaidInvoice
     Customer:      City of Lincoln
     Purpose:       The purpose of this process is to check if there is an unpaid invoice already in the system associated with a business. If there is it returns the GUID so they can be redirected there.
   
     Parameters:    Business ID (String, Required)
                    REVISIONID (GUID, Required)
                    Called From Invoice (String, Required) - true, false
                    
     Return Array:  [0] Status: 'Success', 'Error'
                    [1] Message
                    [2] unpaidInvoiceRevisionID or null
                    [3] error array or null
                    
     Pseudo code:   1. Call getForms to check if an unpaid invoice exists for a business already.
                    2. Send response with return array.
   
     Date of Dev: 02/09/2021
     Last Rev Date: 02/09/2021
     Revision Notes:
     02/09/2021  - Rocky Borg: Script created.
   
     */

    logger.info('Start of the process InvoiceCheckUnpaidInvoice at ' + Date())

    /**********************
     Configurable Variables
    ***********************/
    // Form Template ID.
    let invoiceTemplateID = 'Invoice'

    // Response array populated in try or catch block, used in response sent in finally block.
    let outputCollection = []
    // Array for capturing error messages that may occur within helper functions.
    let errorLog = []

    try {
        /*********************
         Form Record Variables
        **********************/
        // Create variables for the values on the form record
        let BusinessID = getFieldValueByName('Business ID')
        let RevisionID = getFieldValueByName('REVISIONID')
        let CalledFromInvoice = getFieldValueByName('Called From Invoice')

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
        // STEP 1 - Call getForms to check if an unpaid invoice exists for a business already.
        let queryParams = {
            q: `[Primary ID] eq '${BusinessID}' AND [Status] eq 'Not Paid' AND [revisionId] ne '${RevisionID}'`,
            expand: true
        };

        if (CalledFromInvoice === 'false') {
            queryParams.q = `[Primary ID] eq '${BusinessID}' AND [Status] eq 'Not Paid'`
        }

        let getInvoiceFormsResp = await vvClient.forms.getForms(queryParams, invoiceTemplateID)
        getInvoiceFormsResp = JSON.parse(getInvoiceFormsResp)
        let getInvoiceFormsData = (getInvoiceFormsResp.hasOwnProperty('data') ? getInvoiceFormsResp.data : null);
        let getInvoiceFormsLength = (Array.isArray(getInvoiceFormsData) ? getInvoiceFormsData.length : 0)

        if (getInvoiceFormsResp.meta.status !== 200) {
            throw new Error(`Error encountered when calling getForms. ${getInvoiceFormsResp.meta.statusMsg}.`)
        }
        if (!getInvoiceFormsData || !Array.isArray(getInvoiceFormsData)) {
            throw new Error(`Data was not returned when calling getForms.`)
        }

        let unpaidInvoiceRevisionID = ''

        if (getInvoiceFormsLength > 0) {
            unpaidInvoiceRevisionID = getInvoiceFormsData[0]['revisionId']
        }


        // STEP 2 - Send response with return array.
        if (unpaidInvoiceRevisionID) {

            outputCollection[0] = 'Success'
            outputCollection[1] = 'Unpaid Invoice Found.'
            outputCollection[2] = unpaidInvoiceRevisionID
            outputCollection[3] = null
        } else {

            outputCollection[0] = 'Success'
            outputCollection[1] = 'Unpaid Invoice Not Found.'
            outputCollection[2] = null
            outputCollection[3] = null
        }


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