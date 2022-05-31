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
    /*Script Name:  OpPermOperationalPermitSubmit
     Customer:      City of Lincoln
     Purpose:       The purpose of this process is to remove Invoice Line Items associated with an Invoice that have been selected client side.
    
     Parameters:    Operational Permit Type (String, Required)
                    Permit Fee (String, Required)
                    OperationalPermitID (String, Required)
                    Business ID (String, Required)
                    
     Return Array:  [0] Status: 'Success', 'Error'
                    [1] Message
                    [2] error array or null
                    
     Pseudo code:   1. Call LibGenerateInvoiceLineItem to generate an Invoice Line Item for the initial permit fee.
                    2. Send response with return array.
   
     Date of Dev: 02/15/2021
     Last Rev Date: 02/15/2021
     Revision Notes:
     02/15/2021  - Rocky Borg: Script created.
   
     */

    logger.info('Start of the process OpPermOperationalPermitSubmit at ' + Date())

    /**********************
     Configurable Variables
    ***********************/
    // Response array populated in try or catch block, used in response sent in finally block.
    let outputCollection = []
    // Array for capturing error messages that may occur within helper functions.
    let errorLog = []

    try {
        /*********************
         Form Record Variables
        **********************/
        // Create variables for the values on the form record
        let OperationalPermitType = getFieldValueByName('Operational Permit Type')
        let PermitFee = getFieldValueByName('Permit Fee')
        let OperationalPermitID = getFieldValueByName('OperationalPermitID')
        let BusinessID = getFieldValueByName('Business ID')


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
        // STEP 1 - Call LibGenerateInvoiceLineItem to generate an Invoice Line Item for the initial permit fee.
        let invoiceLineItemRequestArr = [
            { name: 'Category', value: 'Operational Permits' },
            { name: 'Sub Category', value: 'Initial Permit Fee' },
            { name: 'Permit Type', value: OperationalPermitType },
            { name: 'Description', value: `Initial Permit Fee for the permit type ${OperationalPermitType}.` },
            { name: 'Amount', value: PermitFee },
            { name: 'Operational Permit ID', value: OperationalPermitID },
            { name: 'Business ID', value: BusinessID },

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

        // STEP 2 - Send response with return array.
        outputCollection[0] = 'Success'
        outputCollection[1] = 'Operational Permit Submitted.'
        outputCollection[2] = null

    } catch (error) {
        // Log errors captured.
        logger.info(JSON.stringify(`${error} ${errorLog}`))
        outputCollection[0] = 'Error'
        outputCollection[1] = `${error.message}`
        outputCollection[2] = errorLog
    } finally {
        response.json(200, outputCollection)
    }
}