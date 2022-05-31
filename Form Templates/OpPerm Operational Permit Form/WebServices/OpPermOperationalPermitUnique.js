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
    /*Script Name:  OpPermOperationalPermitUnique
     Customer:      City of Lincoln
     Purpose:       The purpose of this process is to check that the business name associated with an operational permit is unique.
    
     Parameters:    Business ID (String, Optional)
                    Business Name (String, Required)
                    
     Return Array:  [0] Status: 'Success', 'Error'
                    [1] Message
                    [2] error array or null
                    
     Pseudo code:   1. Call getForms to check that Business Name is unique.
                    2. Send response with return array.
   
     Date of Dev: 03/10/2021
     Last Rev Date: 03/10/2021
     Revision Notes:
     03/10/2021  - Rocky Borg: Script created.
   
     */

    logger.info('Start of the process OpPermOperationalPermitUnique at ' + Date())

    /**********************
     Configurable Variables
    ***********************/
    // Form Template Names
    let contactRecordTemplateID = 'Contact Record'


    // Response array populated in try or catch block, used in response sent in finally block.
    let outputCollection = []
    // Array for capturing error messages that may occur within helper functions.
    let errorLog = []

    try {
        /*********************
         Form Record Variables
        **********************/
        // Create variables for the values on the form record
        let BusinessName = getFieldValueByName('Business Name Submit')
        let BusinessID = getFieldValueByName('Business ID', 'isOptional')


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
        // STEP 1 - Call getForms to check that Business Name is unique.
        if (!BusinessID) {
            let BusinessNameSearch = BusinessName.replace(/'/g, "\\'")

            let queryParams = {
                q: `[Type Business Information] eq 'True' AND [Business Name] eq '${BusinessNameSearch}'`,
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
            if (getFormsLength > 0 && getFormsData[0]['instanceName'] !== BusinessID) {
                throw new Error(`A Business with the name ${BusinessName} already exists. Please select it from the dropdown. If you don't have a dropdown available to select you must contact the business to be added as a manager.`)
            }
        }


        // STEP 2 - Send response with return array.
        outputCollection[0] = 'Success'
        outputCollection[1] = 'Business Name Unique.'

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