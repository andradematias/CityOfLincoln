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
    /*Script Name:  LibOpPermStartInspection
     Customer:      City of Lincoln
     Purpose:       The purpose of this process is to start an Operational Permit Inspection.
    
     Parameters:    Certificate ID (String, Required)
                    New or Renewal (String, Required)
  
     Return Array:  [0] Status: 'Success', 'Error'
                    [1] Message
                    [2] opPermObj or null
                    [3] error array or null
                    
     Pseudo code:   1. Call getForms to get the Certificate associated with this inspection.
                    2. Call getForms to get inspector information.
                      2A. Find Inspector associated with each permit type.
                      2B. Get the Chief Inspector.
                      2C. Assign Inspector based on Operational Permit type.
                    3. Call getForms to get last annual inspection started date on the Operational Permit.  
                    4. Calculate values to set on Inspection Form.
                      4A. Set inspection date.
                    5. Call postForms to create the Inspection Record.
                    6. Get Occupancy Details associated with Certificate.
                      6A. Relate Occupancy Details to Inspection so they display on RRC.
                    7. Send response with return array.
   
     Date of Dev: 02/15/2021
     Last Rev Date: 02/15/2021
     Revision Notes:
     02/15/2021  - Rocky Borg: Script created.
   
     */

    logger.info('Start of the process LibOpPermStartInspection at ' + Date())

    /**********************
     Configurable Variables
    ***********************/
    // Form Template Names
    let certificateTemplateID = 'OpPerm Certificate'
    let inspectionTemplateID = 'OpPerm Inspection'
    let inspectorProfileTemplateID = 'OpPerm Inspector Signature Table'
    let occupancyDetailTemplateID = 'OpPerm Occupancy Detail'
    let operationalPermitTemplateID = 'OpPerm Operational Permit'

    // Response array populated in try or catch block, used in response sent in finally block.
    let outputCollection = []
    // Array for capturing error messages that may occur within helper functions.
    let errorLog = []

    try {
        /*********************
         Form Record Variables
        **********************/
        // Create variables for the values on the form record
        let OpPermCertificateID = getFieldValueByName('Certificate ID')
        let newOrRenewal = getFieldValueByName('New or Renewal')

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

        // Return key if it exists in object. Otherwise do a case insensitive search of keys and return key with it's original case if found.
        function findKey(object, key) {
            let searchResult = ''
            try {
                if (object[key]) {
                    searchResult = key
                }
                if (!object[key]) {
                    searchResult = Object.keys(object).find(k => k.toLowerCase() === key.toLowerCase())
                }
                if (!searchResult) {
                    throw new Error(`The property ${key} was not found when searching an object.`)
                }
                return searchResult
            } catch (error) {
                errorLog.push(error.message)
            }
        }

        /****************
         BEGIN ASYNC CODE
        *****************/
        // STEP 1 - Call getForms to get the Certificate associated with this inspection.
        let queryCertificateParams = {
            q: `[OpPerm Certificate ID] eq '${OpPermCertificateID}'`,
            fields: 'revisionId, instanceName, date Expires, Status, Permit Number, Permit Type, Permit Classification, Total Maximum Occupancy, Liquor License Type, Liquor License Class, Health Number of Beds, Health Type, Health Care Group, Number of Rooms, Number of Spaces, Business ID, Operational Permit ID'
        }

        let getCertificateFormsResp = await vvClient.forms.getForms(queryCertificateParams, certificateTemplateID)
        getCertificateFormsResp = JSON.parse(getCertificateFormsResp)
        let getCertificateFormsData = (getCertificateFormsResp.hasOwnProperty('data') ? getCertificateFormsResp.data : null);
        let getCertificateFormsLength = (Array.isArray(getCertificateFormsData) ? getCertificateFormsData.length : 0)

        if (getCertificateFormsResp.meta.status !== 200) {
            throw new Error(`Error encountered when calling getForms. ${getCertificateFormsResp.meta.statusMsg}.`)
        }
        if (!getCertificateFormsData || !Array.isArray(getCertificateFormsData)) {
            throw new Error(`Data was not returned when calling getForms.`)
        }


        // STEP 2 - Call getForms to get inspector information.
        let queryParams = {
            q: `[Signature Category] eq 'Operational Permits' AND [Status] eq 'Active'`,
            fields: 'revisionId, First Name, MI, Last Name, Email, instanceName, Status, Role, Childcare Facilities, Explosives and Blasting Agents, Fraternities and Sororities, Hazardous Materials, Health Care Facilities, High Rise Buildings, Hospitals, Storage and Use of Liquified, Storage of Scrap Tires, Hotels and Motels, Spraying and Dipping, Mobile Food Preparation Vehicles, Schools, Nursing Care Facilities, Mobile Home Courts, Places of Assembly'
        };

        let getFormsResp = await vvClient.forms.getForms(queryParams, inspectorProfileTemplateID)
        getFormsResp = JSON.parse(getFormsResp)
        let getFormsData = (getFormsResp.hasOwnProperty('data') ? getFormsResp.data : null);
        let getFormsLength = (Array.isArray(getFormsData) ? getFormsData.length : 0)

        if (getFormsResp.meta.status !== 200) {
            throw new Error(`Error encountered when calling getForms. ${getFormsResp.meta.statusMsg}.`)
        }
        if (!getFormsData || !Array.isArray(getFormsData)) {
            throw new Error(`Data was not returned when calling getForms.`)
        }


        // STEP 2A - Find Inspector associated with each permit type.
        /*
          Childcare Facilities
          Explosives and Blasting Agents
          Fraternities and Sororities
          Hazardous Materials
          Health Care Facilities
          High Rise Buildings
          Hospitals
          Storage and Use of Liquified
          Storage of Scrap Tires
          Hotels and Motels
          Spraying and Dipping
          Mobile Food Preparation Vehicles
          Schools
          Nursing Care Facilities
          Mobile Home Courts
          Places of Assembly
        */

        let childcareInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Childcare Facilities')] && inspector[findKey(inspector, 'Childcare Facilities')].toLowerCase() === 'true')

        let explosivesBlastingAgentsInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Explosives and Blasting Agents')] && inspector[findKey(inspector, 'Explosives and Blasting Agents')].toLowerCase() === 'true')

        let fraternitiesSororitiesInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Fraternities and Sororities')] && inspector[findKey(inspector, 'Fraternities and Sororities')].toLowerCase() === 'true')

        let hazardousMaterialsInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Hazardous Materials')] && inspector[findKey(inspector, 'Hazardous Materials')].toLowerCase() === 'true')

        let healthCareInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Health Care Facilities')] && inspector[findKey(inspector, 'Health Care Facilities')].toLowerCase() === 'true')

        let highRiseInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'High Rise Buildings')] && inspector[findKey(inspector, 'High Rise Buildings')].toLowerCase() === 'true')

        let hospitalInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Hospitals')] && inspector[findKey(inspector, 'Hospitals')].toLowerCase() === 'true')

        let storageUseLiquifiedInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Storage and Use of Liquified')] && inspector[findKey(inspector, 'Storage and Use of Liquified')].toLowerCase() === 'true')

        let scrapTiresInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Storage of Scrap Tires')] && inspector[findKey(inspector, 'Storage of Scrap Tires')].toLowerCase() === 'true')

        let hotelsMotelsInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Hotels and Motels')] && inspector[findKey(inspector, 'Hotels and Motels')].toLowerCase() === 'true')

        let sprayingDippingInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Spraying and Dipping')] && inspector[findKey(inspector, 'Spraying and Dipping')].toLowerCase() === 'true')

        let mobileFoodVehiclesInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Mobile Food Preparation Vehicles')] && inspector[findKey(inspector, 'Mobile Food Preparation Vehicles')].toLowerCase() === 'true')

        let schoolsInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Schools')] && inspector[findKey(inspector, 'Schools')].toLowerCase() === 'true')

        let nursingCareInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Nursing Care Facilities')] && inspector[findKey(inspector, 'Nursing Care Facilities')].toLowerCase() === 'true')

        let mobileHomeCourtInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Mobile Home Courts')] && inspector[findKey(inspector, 'Mobile Home Courts')].toLowerCase() === 'true')

        let placesOfAssemblyInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Places of Assembly')] && inspector[findKey(inspector, 'Places of Assembly')].toLowerCase() === 'true')


        // STEP 2B - Get the Chief Inspector.
        let chiefInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Role')] && inspector[findKey(inspector, 'Role')] === 'Chief Fire Inspector')

        let assignedChiefInspector = chiefInspector[0]
        let assignedInspector = ''

        let operationalPermitType = getCertificateFormsData[0]['permit Type']


        // STEP 2C - Assign Inspector based on Operational Permit type.
        switch (operationalPermitType) {
            case 'Childcare Facilities':
                assignedInspector = childcareInspector[0]
                break;
            case 'Explosives and Blasting Agents':
                assignedInspector = explosivesBlastingAgentsInspector[0]
                break;
            case 'Fraternities and Sororities':
                assignedInspector = fraternitiesSororitiesInspector[0]
                break;
            case 'Hazardous Materials':
                assignedInspector = hazardousMaterialsInspector[0]
                break;
            case 'Health Care Facilities (Residential & Non-Residential)':
                assignedInspector = healthCareInspector[0]
                break;
            case 'High Rise Buildings':
                assignedInspector = highRiseInspector[0]
                break;
            case 'Hospitals':
                assignedInspector = hospitalInspector[0]
                break;
            case 'Storage and Use Liquefied Petroleum Gas':
                assignedInspector = storageUseLiquifiedInspector[0]
                break;
            case 'Storage of Scrap Tires and Tire Byproducts':
                assignedInspector = scrapTiresInspector[0]
                break;
            case 'Hotels and Motels':
                assignedInspector = hotelsMotelsInspector[0]
                break;
            case 'Spraying or Dipping':
                assignedInspector = sprayingDippingInspector[0]
                break;
            case 'Mobile Food Preparation Vehicles':
                assignedInspector = mobileFoodVehiclesInspector[0]
                break;
            case 'Schools':
                assignedInspector = schoolsInspector[0]
                break;
            case 'Nursing Care Facilities':
                assignedInspector = nursingCareInspector[0]
                break;
            case 'Mobile Home Court':
                assignedInspector = mobileHomeCourtInspector[0]
                break;
            case 'Places of Assembly':
                assignedInspector = placesOfAssemblyInspector[0]
                break;
            default:
                assignedInspector = assignedChiefInspector
        }


        // STEP 3 - Call getForms to get last annual inspection started date on the Operational Permit.
        let queryOpPermParams = {
            q: `[OperationalPermitID] eq '${getCertificateFormsData[0]['operational Permit ID']}'`,
            fields: 'revisionId, instanceName, Last Annual Inspection Started'
        }

        let getOpPermFormsResp = await vvClient.forms.getForms(queryOpPermParams, operationalPermitTemplateID)
        getOpPermFormsResp = JSON.parse(getOpPermFormsResp)
        let getOpPermFormsData = (getOpPermFormsResp.hasOwnProperty('data') ? getOpPermFormsResp.data : null);
        let getOpPermFormsLength = (Array.isArray(getOpPermFormsData) ? getOpPermFormsData.length : 0)

        if (getOpPermFormsResp.meta.status !== 200) {
            throw new Error(`Error encountered when calling getForms. ${getOpPermFormsResp.meta.statusMsg}.`)
        }
        if (!getOpPermFormsData || !Array.isArray(getOpPermFormsData)) {
            throw new Error(`Data was not returned when calling getForms.`)
        }


        // STEP 4 - Calculate values to set on Inspection Form.
        let inspectionType = 'Renewal'

        if (newOrRenewal === 'New') {
            inspectionType = 'New Permit'
        }

        let inspectionObj = {
            'Permit Number': getCertificateFormsData[0]['permit Number'],
            'Operational Permit Type': getCertificateFormsData[0]['permit Type'],
            'Operational Permit Classification': getCertificateFormsData[0]['permit Classification'],
            'Maximum Occupancy': getCertificateFormsData[0]['total Maximum Occupancy'],
            'Number of Rooms': getCertificateFormsData[0]['number of Rooms'],
            'Number of Beds': getCertificateFormsData[0]['health Number of Beds'],
            'Number of Spaces': getCertificateFormsData[0]['number of Spaces'],
            'Health Care Type': getCertificateFormsData[0]['health Type'],
            'Health Care Group': getCertificateFormsData[0]['health Care Group'],
            'Liquor License Type': getCertificateFormsData[0]['liquor License Type'],
            'Liquor License Class': getCertificateFormsData[0]['liquor License Class'],
            'Operational Permit ID': getCertificateFormsData[0]['operational Permit ID'],
            'OpPerm Certificate ID': getCertificateFormsData[0]['instanceName'],
            'Business ID': getCertificateFormsData[0]['business ID'],
            'Status': 'Initial Inspection Needed',
            'Form Saved': 'True',
            'Occupancy Status': 'Active',
            'Certificate Year': moment(getCertificateFormsData['date Expires']).format('YYYY'),

            'Inspection Type': inspectionType,
            'Inspector First Name': assignedInspector['first Name'],
            'Inspector MI': assignedInspector['mi'],
            'Inspector Last Name': assignedInspector['last Name'],
            'Assigned Inspector Email': assignedInspector['email'],
            'Inspector ID': assignedInspector['instanceName'],

            'Number of Booths': getCertificateFormsData[0]['number of Booths'],
            'Approved Booth': getCertificateFormsData[0]['approved Booth'],
            'Approved Mixing': getCertificateFormsData[0]['approved Mixing'],
            'Approved Storage': getCertificateFormsData[0]['approved Storage'],
            'Extinguishing System': getCertificateFormsData[0]['extinguishing System'],
            'Flammable Liquids': getCertificateFormsData[0]['flammable Liquids'],
            'Mixing': getCertificateFormsData[0]['mixing'],

            'Child Care Category': getCertificateFormsData[0]['child Care Category'],
            'Child Care Type': getCertificateFormsData[0]['child Care Type'],
            'From Hours': getCertificateFormsData[0]['from Hours'],
            'From Minutes': getCertificateFormsData[0]['from Minutes'],
            'From AM PM': getCertificateFormsData[0]['from AM PM'],
            'To Hours': getCertificateFormsData[0]['to Hours'],
            'To Minutes': getCertificateFormsData[0]['to Minutes'],
            'To AM PM': getCertificateFormsData[0]['to AM PM'],
            'Child Care Restrictions': getCertificateFormsData[0]['child Care Restrictions'],
        }


        // STEP 4A - Set inspection date.

        // If a Renewal set the inspection date based on the certificate year and last annual inspection date.
        if (inspectionType === 'Renewal') {
            let reinspectionDate = moment().set({ 'year': moment(getCertificateFormsData[0]['date Expires']).year(), 'month': 0, 'date': 1 })

            if (getOpPermFormsData[0]['last Annual Inspection Started']) {
                reinspectionDate = moment(getOpPermFormsData[0]['last Annual Inspection Started']).set('year', moment(getCertificateFormsData[0]['date Expires']).year())
            }

            inspectionObj['Scheduled ReInspection Date'] = reinspectionDate
        }

        // If a New Operational Permit set inspection date 7 days in the future.
        if (inspectionType === 'New') {
            let reinspectionDate = moment().tz(timeZone).add(7, 'days').format(dateFormat)

            inspectionObj['Scheduled ReInspection Date'] = reinspectionDate
        }


        // STEP 5 - Call postForms to create the Inspection Record.
        let postFormsResp = await vvClient.forms.postForms(null, inspectionObj, inspectionTemplateID)
        let postFormsData = (postFormsResp.hasOwnProperty('data') ? postFormsResp.data : null)

        if (postFormsResp.meta.status !== 201) {
            throw new Error(`An error was encountered when attempting to create the ${inspectionTemplateID} record. 
      (${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message})`)
        }
        if (!postFormsData) {
            throw new Error(`Data was not returned when calling postForms.`)
        }

        let inspectionGUID = postFormsData['revisionId']


        // STEP 6 - Get Occupancy Details associated with Certificate.
        if (inspectionGUID) {
            let queryParams = {
                q: `[OpPerm Certificate ID] eq '${OpPermCertificateID}' AND [Status] eq 'Active'`,
                fields: 'revisionId, instanceName, Room Name, Max Occupancy'
            };

            let getFormsResp = await vvClient.forms.getForms(queryParams, occupancyDetailTemplateID)
            getFormsResp = JSON.parse(getFormsResp)
            let getFormsData = (getFormsResp.hasOwnProperty('data') ? getFormsResp.data : null);
            let getFormsLength = (Array.isArray(getFormsData) ? getFormsData.length : 0)

            if (getFormsResp.meta.status !== 200) {
                throw new Error(`Error encountered when calling getForms. ${getFormsResp.meta.statusMsg}.`)
            }
            if (!getFormsData || !Array.isArray(getFormsData)) {
                throw new Error(`Data was not returned when calling getForms.`)
            }

            let occupancyDetails = getFormsData


            // STEP 6A - Relate Occupancy Details to Inspection so they display on RRC.
            for (const occupancyDetail of occupancyDetails) {
                let relateResp = await vvClient.forms.relateFormByDocId(inspectionGUID, occupancyDetail['instanceName'])
                relateResp = JSON.parse(relateResp)
                if (relateResp.meta.status !== 200 && relateResp.meta.status !== 404) {
                    throw new Error(`There was an error when attempting to relate the Occupancy Detail Record and the Inspection.`)
                }
            }

        }


        // STEP 7 - Send response with return array.
        outputCollection[0] = 'Success'
        outputCollection[1] = 'Inspection Created.'
        outputCollection[2] = inspectionGUID
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