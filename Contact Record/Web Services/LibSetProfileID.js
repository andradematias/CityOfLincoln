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
    /*
    Script Name:    LibSetProfileID
     Customer:      City of Lincoln
    Purpose:        Returns the "Individual ID" of the Individual Record form, filtering by the Email Address of the user.
    Parameters:     
    Return Object:
                    outputCollection[0]: Status
                    outputCollection[1]: Short description message
                    outputCollection[2]: Data
    Pseudo code: 
                    1. GET THE VALUES OF THE FIELDS
                    2. CHECKS IF THE REQUIRED PARAMETERS ARE PRESENT
                    3. The Individual Id of the individual record is returned.
                    4. BUILD THE SUCCESS RESPONSE ARRAY
 
    Date of Dev:    06/14/2022
    Last Rev Date:  
 
    Revision Notes:
                    07/30/2021 - Matías Andrade:  First Setup of the script
    */

    logger.info("Start of the process LibSetProfileID at " + Date());

    /* -------------------------------------------------------------------------- */
    /*                    Response and error handling variables                   */
    /* -------------------------------------------------------------------------- */

    // Response array
    let outputCollection = [];
    // Array for capturing error messages that may occur during the process
    let errorLog = [];

    /* -------------------------------------------------------------------------- */
    /*                           Configurable Variables                           */
    /* -------------------------------------------------------------------------- */

    const templateName = "Individual Record";
    let ProfileID = "";

    /* -------------------------------------------------------------------------- */
    /*                              Script Variables                              */
    /* -------------------------------------------------------------------------- */

    // Description used to better identify API methods errors
    let shortDescription = "";

    /* -------------------------------------------------------------------------- */
    /*                              Helper Functions                              */
    /* -------------------------------------------------------------------------- */

    function getFieldValueByName(fieldName, isRequired = true) {
        /*
        Check if a field was passed in the request and get its value
        Parameters:
            fieldName: The name of the field to be checked
            isRequired: If the field is required or not
        */

        let resp = null;

        try {
            // Tries to get the field from the passed in arguments
            const field = ffCollection.getFormFieldByName(fieldName);

            if (!field && isRequired) {
                throw new Error(`The field '${fieldName}' was not found.`);
            } else if (field) {
                // If the field was found, get its value
                let fieldValue = field.value ? field.value : null;

                if (typeof fieldValue === "string") {
                    // Remove any leading or trailing spaces
                    fieldValue.trim();
                }

                if (fieldValue) {
                    // Sets the field value to the response
                    resp = fieldValue;
                } else if (isRequired) {
                    // If the field is required and has no value, throw an error
                    throw new Error(`The value property for the field '${fieldName}' was not found or is empty.`);
                }
            }
        } catch (error) {
            // If an error was thrown, add it to the error log
            errorLog.push(error);
        }
        return resp;
    }

    function parseRes(vvClientRes) {
        /*
        Generic JSON parsing function
        Parameters:
            vvClientRes: JSON response from a vvClient API method
        */
        try {
            // Parses the response in case it's a JSON string
            const jsObject = JSON.parse(vvClientRes);
            // Handle non-exception-throwing cases:
            if (jsObject && typeof jsObject === "object") {
                vvClientRes = jsObject;
            }
        } catch (e) {
            // If an error occurs, it's because the resp is already a JS object and doesn't need to be parsed
        }
        return vvClientRes;
    }

    function checkMetaAndStatus(vvClientRes, shortDescription, ignoreStatusCode = 999) {
        /*
        Checks that the meta property of a vvClient API response object has the expected status code
        Parameters:
            vvClientRes: Parsed response object from a vvClient API method
            shortDescription: A string with a short description of the process
            ignoreStatusCode: An integer status code for which no error should be thrown. If you're using checkData(), make sure to pass the same param as well.
        */

        if (!vvClientRes.meta) {
            throw new Error(`${shortDescription} error. No meta object found in response. Check method call parameters and credentials.`);
        }

        const status = vvClientRes.meta.status;

        // If the status is not the expected one, throw an error
        if (status != 200 && status != 201 && status != ignoreStatusCode) {
            const errorReason = vvClientRes.meta.errors && vvClientRes.meta.errors[0] ? vvClientRes.meta.errors[0].reason : "unspecified";
            throw new Error(`${shortDescription} error. Status: ${vvClientRes.meta.status}. Reason: ${errorReason}`);
        }
        return vvClientRes;
    }

    function checkDataPropertyExists(vvClientRes, shortDescription, ignoreStatusCode = 999) {
        /*
        Checks that the data property of a vvClient API response object exists 
        Parameters:
            res: Parsed response object from the API call
            shortDescription: A string with a short description of the process
            ignoreStatusCode: An integer status code for which no error should be thrown. If you're using checkMeta(), make sure to pass the same param as well.
        */
        const status = vvClientRes.meta.status;

        if (status != ignoreStatusCode) {
            // If the data property doesn't exist, throw an error
            if (!vvClientRes.data) {
                throw new Error(`${shortDescription} data property was not present. Please, check parameters and syntax. Status: ${status}.`);
            }
        }

        return vvClientRes;
    }

    /* -------------------------------------------------------------------------- */
    /*                                  MAIN CODE                                 */
    /* -------------------------------------------------------------------------- */

    try {
        // 1. GET THE VALUES OF THE FIELDS

        const emailAddress = getFieldValueByName("Email Address");

        // 2. CHECKS IF THE REQUIRED PARAMETERS ARE PRESENT

        if (!emailAddress) {
            // Throw every error getting field values as one
            throw new Error(errorLog.join("; "));
        }

        // 3. The Individual Id of the individual record is returned.

        shortDescription = `Get form ${emailAddress}`;

        const getFormsParams = {
            q: `[Email Address] eq '${emailAddress}'`,
            expand: true
        };

        const getFormsRes = await vvClient.forms
            .getForms(getFormsParams, templateName)
            .then((res) => parseRes(res))
            .then((res) => checkMetaAndStatus(res, shortDescription))
            .then((res) => checkDataPropertyExists(res, shortDescription));

        if (getFormsRes.data.length == 0) {
            outputCollection[0] = "Not found";
            outputCollection[1] = "There is no record in the system corresponding to the selected user."
        } else {
            ProfileID = getFormsRes.data[0].dhdocid1;
        }

        // 4. BUILD THE SUCCESS RESPONSE ARRAY
        outputCollection[0] = "Success";
        outputCollection[1] = "The profile ID was found.";
        outputCollection[2] = ProfileID;

    } catch (error) {
        logger.info("Error encountered" + error);

        // BUILD THE ERROR RESPONSE ARRAY

        outputCollection[0] = "Error";

        if (errorLog.length > 0) {
            outputCollection[1] = "Some errors ocurred";
            outputCollection[2] = `Error/s: ${errorLog.join("; ")}`;
        } else {
            outputCollection[1] = error.message ? error.message : `Unhandled error occurred: ${error}`;
        }
    } finally {
        // SEND THE RESPONSE

        response.json(200, outputCollection);
    }
};
