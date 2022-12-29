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
    /*Script Name:  LibOpPermGetOrCreateUser
     Customer:      City of Lincoln
     Purpose:       The purpose of this process is to create generate an Operational Permit Certificate.
    
     Parameters:    newCertificatesToGen (Array of Operational Permit ID that are New, Required)
                    renewalCertificatesToGen (Array of Operational Permit ID that are a Renewal, Required)            
           
   
     Return Array:  [0] Status: 'Success', 'Error'
                    [1] Message
                    [2] certificatesGenerated (array of object. Each object has a REVISIONID and instanceName) or null
                    [3] error array or null
                    
     Pseudo code:   1. Calculate accounting code.
                    2. Call postForms to create a new Invoice Line Item record.
                    3. Send response with return array.
   
     Date of Dev: 02/27/2021
     Last Rev Date: 02/27/2021
     Revision Notes:
     02/15/2021  - Rocky Borg: Script created.
   
     */

    logger.info('Start of the process LibOpPermGetOrCreateUser at ' + Date())

    /**********************
     Configurable Variables
    ***********************/
    // Form Template ID.
    let individualRecordTemplateID = 'Individual Record'
    let emailNotificationLookupTemplateID = 'Email Notification Lookup'

    let TokenBusinessName = '[Business Name]'


    // Email List Names

    let opPermNewAccountWelcomeBillingEmail = 'OpPerm New Account Billing Contact Email'
    let opPermNewAccountWelcomeManagerEmail = 'OpPerm New Account Manager Contact Email'

    let opPermAssignExistingBillingContactEmail = 'OpPerm Assign Existing Billing Contact Email'
    let opPermAssignExistingManagerContactEmail = 'OpPerm Assign Existing Manager Contact Email'

    let profileID = ''

    // Response array populated in try or catch block, used in response sent in finally block.
    let outputCollection = []
    // Array for capturing error messages that may occur within helper functions.
    let errorLog = []

    try {
        /*********************
         Form Record Variables
        **********************/
        // Create variables for the values on the form record
        let businessName = getFieldValueByName('Business Name')
        let businessID = getFieldValueByName('Business ID')

        let firstName = getFieldValueByName('First Name')
        let lastName = getFieldValueByName('Last Name')
        let MI = getFieldValueByName('MI', 'isOptional')
        let email = getFieldValueByName('Email')
        let contactType = getFieldValueByName('Contact Type')
        let baseURL = getFieldValueByName('BaseURL')

        let allowedContactTypes = ['Billing', 'Manager']

        if (!allowedContactTypes.includes(contactType)) {
            throw new Error(`Contact Type must be ${allowedContactTypes.join(' or ')}.`)
        }

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

                if (!isOptional && fieldValue === null) {
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
        // STEP 1 - Calculate group security to set for user.
        let groupList = ''

        if (contactType === 'Manager') {
            groupList = 'OpPerm Business Owner, OpPerm Billing Contact'
        }


        if (contactType === 'Billing') {
            groupList = 'OpPerm Billing Contact'
        }


        // STEP 2 - Call getForms to see if a user exists in the system.
        let queryParams = {
            q: `[Email Address] eq '${email}'`,
            fields: 'instanceName, revisionId'
        };

        let getFormsResp = await vvClient.forms.getForms(queryParams, individualRecordTemplateID)
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
            profileID = getFormsData[0]['instanceName']

            // STEP 3 - Call LibUserUpdate to update user.
            let updateUserObject = [
                { name: 'Action', value: 'Update' },
                { name: 'User ID', value: email },
                { name: 'First Name', value: firstName },
                { name: 'Last Name', value: lastName },
                { name: 'Group List', value: groupList }
            ]

            let userUpdateResp = await vvClient.scripts.runWebService('LibUserUpdateV2', updateUserObject);
            let userUpdateData = (userUpdateResp.hasOwnProperty('data') ? userUpdateResp.data : null);

            if (userUpdateResp.meta.status != 200) {
                throw new Error(`An error was returned when updating the user account.`)
            }
            if (!userUpdateData || !Array.isArray(userUpdateData)) {
                throw new Error(`Data was not returned when calling LibUserUpdateV2.`)
            }
            if (userUpdateData[0] === 'Error') {
                throw new Error(`The call to LibUserUpdateV2 returned with an error. ${userUpdateData[1]}.`)
            }
            if (userUpdateData[0] !== 'Success') {
                throw new Error(`The call to LibUserUpdateV2 returned with an unhandled error.`)
            }

            // STEP 4 - Update Individual Record to set as an Operational Permit User.
            let formUpdateObj = {
                'Operational Permit Individual': 'true'
            }

            let postFormResp = await vvClient.forms.postFormRevision(null, formUpdateObj, individualRecordTemplateID, getFormsData[0]['revisionId'])
            if (postFormResp.meta.status !== 201) {
                throw new Error(`An error was encountered when attempting to update the ${individualRecordTemplateID} form. ${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message}`)
            }

            // STEP 5 - Email User if they have been assigned to an operational permit.
            if (contactType === 'Manager') {
                emailListName = opPermAssignExistingManagerContactEmail
            }


            if (contactType === 'Billing') {
                emailListName = opPermAssignExistingBillingContactEmail
            }

            let tokenArr = [
                { name: TokenBusinessName, value: businessName },
            ];
            let emailRequestArr = [
                { name: 'Email Name', value: emailListName },
                { name: 'Tokens', value: tokenArr },
                { name: 'Email Address', value: email },
                { name: 'Email AddressCC', value: '' },
                { name: 'SendDateTime', value: '' },
                { name: 'RELATETORECORD', value: [businessID, profileID] },
                {
                    name: 'OTHERFIELDSTOUPDATE', value: {
                        'Primary Record ID': businessID,
                        'Individual ID': profileID
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

        }


        if (!profileID) {
            // STEP 6 - Call getForms to get the email to send for a new user.
            let emailListName = ''

            if (contactType === 'Manager') {
                emailListName = opPermNewAccountWelcomeManagerEmail
            }


            if (contactType === 'Billing') {
                emailListName = opPermNewAccountWelcomeBillingEmail
            }

            let queryParams = {
                q: `[Email Name] eq '${emailListName}'`,
                fields: 'Subject Line, Body Text'
            };

            let getFormsResp = await vvClient.forms.getForms(queryParams, emailNotificationLookupTemplateID)
            getFormsResp = JSON.parse(getFormsResp)
            let getFormsData = (getFormsResp.hasOwnProperty('data') ? getFormsResp.data : null);
            let getFormsLength = (Array.isArray(getFormsData) ? getFormsData.length : 0)

            if (getFormsResp.meta.status !== 200) {
                throw new Error(`Error encountered when calling getForms. ${getFormsResp.meta.statusMsg}.`)
            }
            if (!getFormsData || !Array.isArray(getFormsData)) {
                throw new Error(`Data was not returned when calling getForms.`)
            }
            if (getFormsLength === 0) {
                throw new Error(`The email template ${emailListName} was not found.`)
            }

            let emailSubject = getFormsData[0]['subject Line']
            let emailBody = getFormsData[0]['body Text']

            emailBody = emailBody.split('[URL]').join(baseURL)
            emailBody = emailBody.split('[Business Name]').join(businessName)


            // STEP 7 - Call LibUserCreate to create a user in the system.

            let createUserObject = [
                { name: 'Group List', value: groupList },
                { name: 'User Id', value: email },
                { name: 'Email Address', value: email },
                { name: 'Site Name', value: 'Home' },
                { name: 'First Name', value: firstName },
                { name: 'Last Name', value: lastName },
                { name: 'Middle Initial', value: MI },
                { name: 'Send Email', value: 'Custom' },
                { name: 'Email Subject', value: emailSubject },
                { name: 'Email Body', value: emailBody },
            ]

            let userCreateResp = await vvClient.scripts.runWebService('LibUserCreateV2', createUserObject);
            let userCreateData = (userCreateResp.hasOwnProperty('data') ? userCreateResp.data : null);

            if (userCreateResp.meta.status != 200) {
                throw new Error(`An error was returned when updating the user account.`)
            }
            if (!userCreateData || !Array.isArray(userCreateData)) {
                throw new Error(`Data was not returned when calling LibUserCreate.`)
            }
            if (userCreateData[0] === 'Error') {
                throw new Error(`The call to LibUserCreate returned with an error. ${userCreateData[1]}.`)
            }
            if (userCreateData[0] !== 'Success' && userCreateData[0] !== 'Minor Error') {
                throw new Error(`The call to LibUserCreate returned with an unhandled error.`)
            }


            // STEP 8 - Call postForms to create an Individual Record if one doesn't exist.
            let postFormsObj = {
                'First Name': firstName,
                'Last Name': lastName,
                'Middle Initial': MI,
                'Personal Email': email,
                'Retype Email': email,
                'Email Address': email,
                'Status': 'Active',
                'Hide CTPRSS': 'true',
                'Operational Permit Individual': 'true'
            }

            let postFormsResp = await vvClient.forms.postForms(null, postFormsObj, individualRecordTemplateID)
            let postFormsData = (postFormsResp.hasOwnProperty('data') ? postFormsResp.data : null)

            if (postFormsResp.meta.status !== 201) {
                throw new Error(`An error was encountered when attempting to create the ${individualRecordTemplateID} record. 
        (${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message})`)
            }
            if (!postFormsData) {
                throw new Error(`Data was not returned when calling postForms.`)
            }

            profileID = postFormsData['instanceName']

        }


        // STEP 9 - Send response with return array.
        outputCollection[0] = 'Success'
        outputCollection[1] = 'User Found.'
        outputCollection[2] = profileID
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