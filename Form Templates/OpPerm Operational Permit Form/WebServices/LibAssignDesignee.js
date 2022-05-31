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
    /*Script Name:  LibAssignDesignee
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

    logger.info('Start of the process LibAssignDesignee at ' + Date())

    /**********************
     Configurable Variables
    ***********************/
    // Form Template Names
    let contactRecordTemplateID = 'Contact Record'
    let designeeTemplateID = 'Designee'

    // Response array populated in try or catch block, used in response sent in finally block.
    let outputCollection = []
    // Array for capturing error messages that may occur within helper functions.
    let errorLog = []

    try {
        /*********************
         Form Record Variables
        **********************/
        // Create variables for the values on the form record
        let ContactRevisionID = getFieldValueByName('Contact Revision ID')
        let OperationalPermitID = getFieldValueByName('OperationalPermitID')
        let DesigneeType = getFieldValueByName('Designee Type')


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
        // STEP 1 - Call getForms to get the Contact ID from the Revision ID.
        let queryParams = {
            q: `[revisionId] eq '${ContactRevisionID}'`,
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

        let contactID = getFormsData[0]['instanceName']


        //STEP 2 - Call getForms to find the Designee Record associated with the Contact ID and Operational Permit.
        let queryDesigneeParams = {
            q: `[Contact ID] eq '${contactID}' AND [Operational Permit ID] eq '${OperationalPermitID}'`,
            fields: 'revisionId, instanceName'
        }

        let getFormsDesigneeResp = await vvClient.forms.getForms(queryDesigneeParams, designeeTemplateID)
        getFormsDesigneeResp = JSON.parse(getFormsDesigneeResp)
        let getFormsDesigneeData = (getFormsDesigneeResp.hasOwnProperty('data') ? getFormsDesigneeResp.data : null);
        let getFormsDesigneeLength = (Array.isArray(getFormsDesigneeData) ? getFormsDesigneeData.length : 0)

        if (getFormsDesigneeResp.meta.status !== 200) {
            throw new Error(`Error encountered when calling getForms. ${getFormsDesigneeResp.meta.statusMsg}.`)
        }
        if (!getFormsDesigneeData || !Array.isArray(getFormsDesigneeData)) {
            throw new Error(`Data was not returned when calling getForms.`)
        }

        let designeeGUID = getFormsDesigneeData[0]['revisionId']


        // STEP 3 - Call getForms to find any other Designee Records with the passed in type checked.
        let queryDesigneeTypeParams = {
            q: `[${DesigneeType}] eq 'True' AND [Operational Permit ID] eq '${OperationalPermitID}'`,
            fields: 'revisionId, instanceName'
        }

        let getFormsDesigneeTypeResp = await vvClient.forms.getForms(queryDesigneeTypeParams, designeeTemplateID)
        getFormsDesigneeTypeResp = JSON.parse(getFormsDesigneeTypeResp)
        let getFormsDesigneeTypeData = (getFormsDesigneeTypeResp.hasOwnProperty('data') ? getFormsDesigneeTypeResp.data : null);
        let getFormsDesigneeTypeLength = (Array.isArray(getFormsDesigneeData) ? getFormsDesigneeData.length : 0)

        if (getFormsDesigneeTypeResp.meta.status !== 200) {
            throw new Error(`Error encountered when calling getForms. ${getFormsDesigneeTypeResp.meta.statusMsg}.`)
        }
        if (!getFormsDesigneeTypeData || !Array.isArray(getFormsDesigneeTypeData)) {
            throw new Error(`Data was not returned when calling getForms.`)
        }


        // STEP 4 - Marks all Designee Records with the passed in type as unchecked.
        if (getFormsDesigneeTypeLength) {

            for (const designee of getFormsDesigneeTypeData) {
                let formUpdateObj = {}

                formUpdateObj[DesigneeType] = 'false'

                let postFormResp = await vvClient.forms.postFormRevision(null, formUpdateObj, designeeTemplateID, designee['revisionId'])
                if (postFormResp.meta.status !== 201) {
                    throw new Error(`An error was encountered when attempting to update the ${designeeTemplateID} form. ${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message}`)
                }
            }

        }

        // STEP 5 - Mark Designee Record as the assigned type.
        let formUpdateObj = {}

        formUpdateObj[DesigneeType] = 'true'

        let postFormResp = await vvClient.forms.postFormRevision(null, formUpdateObj, designeeTemplateID, designeeGUID)
        if (postFormResp.meta.status !== 201) {
            throw new Error(`An error was encountered when attempting to update the ${designeeTemplateID} form. ${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message}`)
        }

        // STEP 5 - Send response with return array.
        outputCollection[0] = 'Success'
        outputCollection[1] = 'Designee Assigned.'
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