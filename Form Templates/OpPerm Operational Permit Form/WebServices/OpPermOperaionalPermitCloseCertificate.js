let logger = require('../log');
var path = require('path');
var scriptName = path.basename(__filename);

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
    /**
     * Script Name:     OpPermOperaionalPermitCloseCertificate
     * Customer:        City of Lincoln
     * Purpose:         The purpose of this process is to find and close any
     *                  operational permits certificates that are currently open or
     *                  pending inspection and associated with a given operational permit.
     *
     * Parameters:      Business ID (String, Required)
     *                  REVISIONID (GUID, Required)
     *
     * Return Array:    [0] Status: 'Success', 'Error'
     *                  [1] Message
     *                  [2] error array or null
     *
     * Pseudo code:     1. Call getForms to find all Operational Permits for a given business that are currently Open.
     *                  2. If at least one operational permit was found, find related operational permit certificates for the given operational permit.
     *                  3. If at least one operational permit certificate that is open or pending inspection was found for a given operational permit, close them.
     *                  4. Close the given operational permit.
     *                  5. Send response with return array.
     *
     * Date of Dev: 02/11/2021
     * Last Rev Date: 02/11/2021
     *
     * Revision Notes:
     *      03/04/2021  - Steven Roland: Script created.
     */

    logger.info('Start of the process ' + scriptName + ' at ' + Date());

    /**********************
     Configurable Variables
    ***********************/
    // Form Template ID
    let operationalPermitCertificateTemplateID = 'OpPerm Certificate';

    // Response array populated in try or catch block, used in response sent in finally block.
    let outputCollection = [];

    // Array for capturing error messages that may occur within helper functions.
    let errorLog = [];

    try {
        /*********************
         Form Record Variables
        **********************/

        // Create variables for the values on the form record
        let operationalPermitID = getFieldValueByName('OperationalPermitID');

        // Specific fields are detailed in the errorLog sent in the response to the client.
        if (errorLog.length > 0) {
            throw new Error(`Please provide a value for the required fields.`);
        }

        /****************
         Helper Functions
        *****************/

        // Check if field object has a value property and that value is truthy before returning value.
        function getFieldValueByName(fieldName, isOptional) {
            try {
                let fieldObj = ffCollection.getFormFieldByName(fieldName);
                let fieldValue = fieldObj && (fieldObj.hasOwnProperty('value') ? fieldObj.value : null);

                if (fieldValue === null) {
                    throw new Error(`A value property for ${fieldName} was not found.`);
                }

                if (!isOptional && !fieldValue) {
                    throw new Error(`A value for ${fieldName} was not provided.`);
                }

                return fieldValue;
            } catch (error) {
                errorLog.push(error.message);
            }
        }

        /****************
         BEGIN ASYNC CODE
        *****************/

        // STEP 1 - Find operational permit certificates that are open or pending inspection with a given operational permit ID.
        let getOperationalPermitCertificatesResponse = await vvClient.forms.getForms({
            q: `[Operational Permit ID] eq '${operationalPermitID}' AND ([Status] eq 'Open' OR [Status] eq 'Pending Inspection')`,
            expand: true
        }, operationalPermitCertificateTemplateID);

        getOperationalPermitCertificatesResponse = JSON.parse(getOperationalPermitCertificatesResponse);

        let operationalPermitCertificates = (getOperationalPermitCertificatesResponse.hasOwnProperty('data') ? getOperationalPermitCertificatesResponse.data : null);
        let operationalPermitCertificatesLength = (Array.isArray(operationalPermitCertificates) ? operationalPermitCertificates.length : 0);

        if (getOperationalPermitCertificatesResponse.meta.status !== 200) {
            throw new Error(`Error encountered when calling getForms. ${getOperationalPermitCertificatesResponse.meta.statusMsg}.`);
        }

        if (!operationalPermitCertificates || !Array.isArray(operationalPermitCertificates)) {
            throw new Error(`Data was not returned when calling getForms.`);
        }

        // STEP 2 - For each operational permit certificate found, update it's status to closed.
        if (operationalPermitCertificatesLength > 0) {
            for (let operationalPermitCertificate of operationalPermitCertificates) {
                let operationalPermitCertificateGUID = operationalPermitCertificate['revisionId'];

                let operationalPermitCertificateFields = {
                    'Status': 'Closed'
                };

                let closeOperationalPermitCertificateResponse = await vvClient.forms.postFormRevision(null, operationalPermitCertificateFields, operationalPermitCertificateTemplateID, operationalPermitCertificateGUID);

                if (closeOperationalPermitCertificateResponse.meta.status !== 201) {
                    throw new Error(`An error was encountered when attempting to update the ${operationalPermitCertificateTemplateID} - ${operationalPermitCertificateGUID} form. ${closeOperationalPermitCertificateResponse.hasOwnProperty('meta') ? closeOperationalPermitCertificateResponse.meta.statusMsg : closeOperationalPermitCertificateResponse.message} ${errorMessageGuidance}`);
                }
            }
        }

        // STEP 3 - Send response with return array.
        if (operationalPermitCertificates) {
            outputCollection[0] = 'Success';
            outputCollection[1] = 'This permit has been successfully closed.';
            outputCollection[2] = null;
        } else {
            outputCollection[0] = 'Success';
            outputCollection[1] = 'No certificates were found for this operational permit.';
            outputCollection[2] = null;
        }
    } catch (error) {
        // Log errors captured.
        logger.info(JSON.stringify(`${error} ${errorLog}`));
        outputCollection[0] = 'Error';
        outputCollection[1] = `${error.message}`;
        outputCollection[2] = errorLog;
    } finally {
        response.json(200, outputCollection);
    }
}