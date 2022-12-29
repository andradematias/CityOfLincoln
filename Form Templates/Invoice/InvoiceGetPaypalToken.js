//Test PayPal
//user: visualvault1\vvpaypalapi
//pw: 5Id@h8ijjNUX
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
    /*Script Name:  InvoiceGetPaypalToken
     Customer:      City of Lincoln
     Purpose:       The purpose of this process is to get a paypal token to return to the client so a modal can be displayed to pay.
    
     Parameters:    REVISIONID (GUID, Required)
                    Total Owed (String, Required)
                    Payment Method (String, Required)
                    Base URL (String, Required)
                    
     Return Array:  [0] Status: 'Success', 'Error'
                    [1] Message
                    [2] Paypal token or null
                    [3] errorLog or null
                    
     Pseudo code:   1. Call PayNowGetToken to get Paypal token.
                    2. Send response with return array.
   
     Date of Dev: 02/13/2021
     Last Rev Date: 02/13/2021
     Revision Notes:
     02/13/2021  - Rocky Borg: Script created.
   
     */

    logger.info('Start of the process InvoiceGetPaypalToken at ' + Date())

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
        let RevisionID = getFieldValueByName('REVISIONID')
        let TotalOwed = getFieldValueByName('Total Owed')
        let PaymentMethod = getFieldValueByName('Payment Method')
        let BaseURL = getFieldValueByName('Base URL')


        // Specific fields are detailed in the errorLog sent in the response to the client.
        if (errorLog.length > 0) {
            throw new Error(`Please provide a value for the required fields.`)
        }

        if (PaymentMethod !== 'Credit Card') {
            throw new Error(`The Payment Method must be set to Credit Card.`)
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
        // STEP 1 - Call PayNowGetToken to get Paypal token.

        let payNowObject = [
            { name: 'REVISIONID', value: RevisionID },
            { name: 'Amount', value: TotalOwed },
            { name: 'Payment Method', value: PaymentMethod },
            { name: 'RedirectURL', value: BaseURL + 'FormDetails?hidemenu=true&DataID=' + RevisionID },
        ]

        let payNowResp = await vvClient.scripts.runWebService('PayNowGetToken', payNowObject);
        let payNowData = (payNowResp.hasOwnProperty('data') ? payNowResp.data : null);

        if (payNowResp.meta.status != 200) {
            throw new Error(`An error was returned when updating the user account.`)
        }
        if (!payNowData || !Array.isArray(payNowData)) {
            throw new Error(`Data was not returned when calling PayNowGetToken.`)
        }
        if (payNowData[0] === 'Error') {
            throw new Error(`The call to PayNowGetToken returned with an error. ${payNowData[1]}.`)
        }
        if (payNowData[0] !== 'Success') {
            throw new Error(`The call to PayNowGetToken returned with an unhandled error.`)
        }

        // STEP 2 - Send response with return array.
        outputCollection[0] = 'Success'
        outputCollection[1] = 'Paypal Token Found.'
        outputCollection[2] = payNowData[1]
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