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
    /*Script Name:  OpPermOperationalPermitNextStep1
     Customer:      City of Lincoln
     Purpose:       The purpose of this process is to handle submission of an Operational Permit.
    
     Parameters:    
                    
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

    logger.info('Start of the process OpPermOperationalPermitNextStep1 at ' + Date())

    /**********************
     Configurable Variables
    ***********************/
    // Form Template Names
    let contactRecordTemplateID = 'Contact Record'
    let opPermBusinessRecordTemplateID = 'OpPerm Business'
    let designeeTemplateID = 'Designee'
    let operationalPermitTemplateID = 'OpPerm Operational Permit'
    let individualRecordTemplateID = 'Individual Record'


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
        let OperationalPermitID = getFieldValueByName('OperationalPermitID')


        let BusinessName = getFieldValueByName('Business Name Submit')
        let BusinessFirstName = getFieldValueByName('Business First Name', 'isOptional')
        let BusinessLastName = getFieldValueByName('Business Last Name', 'isOptional')
        let BusinessMI = getFieldValueByName('Business MI', 'isOptional')
        let BusinessWorkNumber = getFieldValueByName('Business Work Number', 'isOptional')
        let BusinessCellNumber = getFieldValueByName('Business Cell Number', 'isOptional')
        let BusinessEmail = getFieldValueByName('Business Email')
        let BusinessStreetAddress = getFieldValueByName('Business Street Address')
        let BusinessRoomSuite = getFieldValueByName('Business Room Suite', 'isOptional')
        let BusinessZipCode = getFieldValueByName('Business Zip Code')
        let BusinessCity = getFieldValueByName('Business City')
        let BusinessState = getFieldValueByName('Business State')
        let BusinessCounty = getFieldValueByName('Business County', 'isOptional')
        let ProfileID = getFieldValueByName('Profile ID', 'isOptional')
        let BusinessContactID = getFieldValueByName('Business Contact ID', 'isOptional')
        let BusinessID = getFieldValueByName('Business ID', 'isOptional')


        let FacilityName = getFieldValueByName('Facility Name')
        let FacilityStreetAddress = getFieldValueByName('Facility Street Address')
        let FacilityRoomSuite = getFieldValueByName('Facility Room Suite', 'isOptional')
        let FacilityZipCode = getFieldValueByName('Facility Zip Code', 'isOptional')
        let FacilityCity = getFieldValueByName('Facility City')
        let FacilityState = getFieldValueByName('Facility State')
        let FacilityCounty = getFieldValueByName('Facility County', 'isOptional')
        let FacilityID = getFieldValueByName('Facility ID', 'isOptional')


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
        // STEP 1 - Call getForms to find the Record ID of the Operational Permit Form (can't trust Record ID on Form).
        let queryParams = {
            q: `[revisionId] eq '${RevisionID}'`,
            fields: 'revisionId, instanceName'
        }

        let getFormsResp = await vvClient.forms.getForms(queryParams, operationalPermitTemplateID)
        getFormsResp = JSON.parse(getFormsResp)
        let getFormsData = (getFormsResp.hasOwnProperty('data') ? getFormsResp.data : null);
        let getFormsLength = (Array.isArray(getFormsData) ? getFormsData.length : 0)

        if (getFormsResp.meta.status !== 200) {
            throw new Error(`Error encountered when calling getForms. ${getFormsResp.meta.statusMsg}.`)
        }
        if (!getFormsData || !Array.isArray(getFormsData)) {
            throw new Error(`Data was not returned when calling getForms.`)
        }

        let operationalPermitID = getFormsData[0]['instanceName']


        if (!BusinessID) {
            // STEP 2 - Call postForms to create an Business Record.
            let postFormsBusinessObj = {
                'Business Name': BusinessName,
                'Status': 'Open',
                'Form Saved': 'True'
            }

            let postFormsBusinessResp = await vvClient.forms.postForms(null, postFormsBusinessObj, opPermBusinessRecordTemplateID)
            let postFormsBusinessData = (postFormsBusinessResp.hasOwnProperty('data') ? postFormsBusinessResp.data : null)

            if (postFormsBusinessResp.meta.status !== 201) {
                throw new Error(`An error was encountered when attempting to create the ${opPermBusinessRecordTemplateID} record. 
  (${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message})`)
            }
            if (!postFormsBusinessData) {
                throw new Error(`Data was not returned when calling postForms.`)
            }

            BusinessID = postFormsBusinessData['instanceName']
        }


        // STEP 3 - Call postForms to create a Contact Record associated with the Business Record.
        if (!BusinessContactID) {
            let postFormsContactObj = {
                'Type Business Information': 'true',
                'Business ID': BusinessID,
                'Business Name': BusinessName,
                'First Name': BusinessFirstName,
                'Last Name': BusinessLastName,
                'MI': BusinessMI,
                'Email Address': BusinessEmail,
                'Work Phone': BusinessWorkNumber,
                'Cell Phone': BusinessCellNumber,
                'Street Address': BusinessStreetAddress,
                'Room Suite': BusinessRoomSuite,
                'Zip Code': BusinessZipCode,
                'City': BusinessCity,
                'ddState': BusinessState,
                'ddCounty': BusinessCounty,
                'Status': 'Active',
                'chkbxFormSave': 'True',
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

            BusinessContactID = postFormsContactData['instanceName']

        }


        // STEP 4 - Call postForms to create a Designee Record linking the Contact Record and Business Record.
        let postFormsDesigneeObj = {
            'Type Business': 'True',
            'Contact ID': BusinessContactID,
            'Business ID': BusinessID,
            'Operational Permit ID': operationalPermitID,
            'Status': 'Active',
            'Form Saved': 'True',
        }

        let postFormsDesigneeResp = await vvClient.forms.postForms(null, postFormsDesigneeObj, designeeTemplateID)
        let postFormsDesigneeData = (postFormsDesigneeResp.hasOwnProperty('data') ? postFormsDesigneeResp.data : null)

        if (postFormsDesigneeResp.meta.status !== 201) {
            throw new Error(`An error was encountered when attempting to create the ${designeeTemplateID} record. 
  (${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message})`)
        }
        if (!postFormsDesigneeData) {
            throw new Error(`Data was not returned when calling postForms.`)
        }


        // STEP 5 - Get profile information of the applicant.
        let profileData = ''

        if (ProfileID) {
            let queryParams = {
                q: `[Individual ID] eq '${ProfileID}'`,
                fields: 'instanceName, revisionId, First Name, Last Name, Middle Initial, Email Address, Contact Phone'
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

            profileData = getFormsData[0]

        }


        // STEP 6 - Check if contact record already exists.
        let managerContactID = ''

        if (ProfileID) {
            let profileEmailSearch = profileData['email Address'].replace(/'/g, "\\'")

            let queryParams = {

                q: `[Business ID] eq '${BusinessID}' AND [Email Address] eq '${profileEmailSearch}' AND [Type Facility] eq 'False' AND [Type Business Information] eq 'False'`,
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
        }


        if (!managerContactID) {
            // STEP 7 - Create a contact for the business owner that is linked to the Individual Record.
            let postFormsContactObj = {
                'Type Manager': 'true',
                'Owner Contact': 'true',
                'Business ID': BusinessID,
                'First Name': profileData['first Name'],
                'Last Name': profileData['last Name'],
                'MI': profileData['middle Initial'],
                'Email Address': profileData['email Address'],
                'Status': 'Active',
                'Profile ID': ProfileID,
                'chkbxFormSave': 'True',
                'Manage or Owner': 'True'
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


        // STEP 8 - Call getForms to check facility contact record doesn't already exists.
        if (!FacilityID) {

            let FacilityNameSearch = FacilityName.replace(/'/g, "\\'")

            let queryParams = {
                q: `[Business ID] eq '${BusinessID}' AND [Type Facility] eq 'True' AND [Facility Name] eq '${FacilityNameSearch}' AND [Facility Street Address] eq '${FacilityStreetAddress}' AND [Facility Room Suite] eq '${FacilityRoomSuite}'`,
                fields: 'instanceName, revisionId'
            };

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
                FacilityID = getFormsData[0]['instanceName']
            }

            if (getFormsLength === 0) {


                // STEP 9 - Call postForms to create a Contact Record associated with the Facility.
                let postFormsContactObj = {
                    'Type Facility': 'true',
                    'Facility Name': FacilityName,
                    'Facility Street Address': FacilityStreetAddress,
                    'Facility Room Suite': FacilityRoomSuite,
                    'Facility Zip Code': FacilityZipCode,
                    'Facility City': FacilityCity,
                    'Facility State': FacilityState,
                    'Facility County': FacilityCounty,
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

                FacilityID = postFormsContactData['instanceName']
            }

        }


        // STEP 10 - Call postForms to create a Designee Record linking the Facility Contact to Operational permit.
        let postFormsFacilityDesigneeObj = {
            'Type Facility': 'True',
            'Contact ID': FacilityID,
            'Business ID': BusinessID,
            'Operational Permit ID': OperationalPermitID,
            'Status': 'Active',
            'Form Saved': 'True',
        }

        let postFormsFacilityDesigneeResp = await vvClient.forms.postForms(null, postFormsFacilityDesigneeObj, designeeTemplateID)
        let postFormsFacilityDesigneeData = (postFormsFacilityDesigneeResp.hasOwnProperty('data') ? postFormsFacilityDesigneeResp.data : null)

        if (postFormsFacilityDesigneeResp.meta.status !== 201) {
            throw new Error(`An error was encountered when attempting to create the ${designeeTemplateID} record. 
      (${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message})`)
        }
        if (!postFormsFacilityDesigneeData) {
            throw new Error(`Data was not returned when calling postForms.`)
        }


        // STEP 11 - Object to send to client. 
        let opPermObj = {
            'Business Contact ID': BusinessContactID,
            'Business ID': BusinessID,
            'Applicant First Name': profileData['first Name'],
            'Applicant Last Name': profileData['last Name'],
            'Applicant Phone': profileData['contact Phone'],
        }


        // STEP 12 - Send response with return array.
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