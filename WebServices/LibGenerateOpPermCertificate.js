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
    /*Script Name:  LibGenerateOpPermCertificate
     Customer:      City of Lincoln
     Purpose:       The purpose of this process is to create generate an Operational Permit Certificate.
    
     Parameters:    newCertificatesToGen (Array of Objects, Permit ID & Certificate Year that are New, Required)
                    renewalCertificatesToGen (Array of Objects, Permit ID & Certificate Year that are a Renewal, Required)            
           
     Return Array:  [0] Status: 'Success', 'Error'
                    [1] Message
                    [2] certificatesGenerated (array of object. Each object has a REVISIONID and instanceName) or null
                    [3] error array or null
                    
     Pseudo code:   1. Call generateCertificate to generate a New certificate.
                    2. Call generateCertificate to generate a Renewal certificate.
                    3. If this is a renewal get the most recent certificate.
                    4. Call getCustomQueryResultsByName to get information needed to generate certificate based on passed in Operational Permit ID.
                    5. Call getForms to get the Inspector and Chief Inspector for the Certificate.
                    6. Call postForms to create a new Operational Permit Certificate.
                      6A. Call postFormRevision to get the permit number using the Record ID from the previous step.
                    7. Call getForms to get all Occupancy Details for the most recent certificate.
                    7A. Call postForms to generate Occupancy Details and associate it to the newly generated certificate if this is a renewal.
                    8. Call LibOpPermStartInspection to generate an Inspection.
                    9. Send response with return array.
   
     Date of Dev: 02/15/2021
     Last Rev Date: 02/15/2021
     Revision Notes:
     02/15/2021  - Rocky Borg: Script created.
   
     */

    logger.info('Start of the process LibGenerateOpPermCertificate at ' + Date())

    /**********************
     Configurable Variables
    ***********************/
    // Form Template ID.
    let certificateTemplateID = 'OpPerm Certificate'
    let occupancyDetailTemplateID = 'OpPerm Occupancy Detail'
    let inspectorTemplateID = 'OpPerm Inspector Signature Table'

    let operationalPermitDetails = 'zWebSvc Operational Permit Details'

    let newCertificatesGenerated = []
    let renewalCertificatesGenerated = []

    // Response array populated in try or catch block, used in response sent in finally block.
    let outputCollection = []
    // Array for capturing error messages that may occur within helper functions.
    let errorLog = []

    let timeZone = 'America/Chicago'
    let dateFormat = 'L'

    try {
        /*********************
         Form Record Variables
        **********************/
        // Create variables for the values on the form record
        let newCertificatesToGen = getFieldValueByName('New Certificates', 'isOptional')
        let renewalCertificatesToGen = getFieldValueByName('Renewal Certificates', 'isOptional')

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


        /*******************
         RECURSIVE FUNCTIONS
        ********************/
        async function generateCertificate(certificateToGen, newOrRenewal) {
            return new Promise(async function (resolve) {
                try {
                    let sortedCertificates = ''

                    // STEP 3 - If this is a renewal get the most recent certificate.
                    if (newOrRenewal === 'Renewal') {

                        let queryCertificateParams = {
                            q: `[Operational Permit ID] eq '${operationalPermitID}'`,
                            fields: 'instanceName, revisionId, Date Expires'
                        };

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

                        sortedCertificates = getEnrollmentFormsData.sort((a, b) => moment(b[findKey(b, 'Date Expires')]) - moment(a[findKey(a, 'Date Expires')]))

                    }


                    // STEP 4 - Call getCustomQueryResultsByName to get information needed to generate certificate based on passed in Operational Permit ID.
                    let queryPermitParams = { filter: `[OperationalPermitID] = '${certificateToGen['Permit ID']}'` }

                    let customQueryResp = await vvClient.customQuery.getCustomQueryResultsByName(operationalPermitDetails, queryPermitParams)
                    customQueryResp = JSON.parse(customQueryResp)
                    let customQueryData = (customQueryResp.hasOwnProperty('data') ? customQueryResp.data : null)
                    let customQueryLength = (Array.isArray(customQueryData) ? customQueryData.length : 0)

                    if (customQueryResp.meta.status !== 200) {
                        throw new Error(`Error encountered when calling getCustomQueryResultsByName. ${customQueryResp.meta.statusMsg}.`)
                    }
                    if (!customQueryData || !Array.isArray(customQueryData)) {
                        throw new Error(`Data was not returned when calling getCustomQueryResultsByName.`)
                    }

                    let operationalPermitType = customQueryData[0]['operational Permit Type']
                    let feeClassification = customQueryData[0]['classificationDD']

                    let facilityName = customQueryData[0]['facility Name']
                    let facilityAddress = customQueryData[0]['facility Address']

                    let businessID = customQueryData[0]['business ID']
                    let operationalPermitID = customQueryData[0]['operationalPermitID']
                    let originalPermitID = customQueryData[0]['original Permit ID']

                    let maximumOccupancy = customQueryData[0]['maximum Occupancy']
                    let numberOfRooms = customQueryData[0]['number of Rooms']
                    let numberOfBeds = customQueryData[0]['number of Beds']
                    let numberOfSpaces = customQueryData[0]['number of Spaces']
                    let healthCareType = customQueryData[0]['health Care Type']
                    let healthCareGroup = customQueryData[0]['health Care Group']

                    let liquorLicenseNumber = customQueryData[0]['liquor License Number']
                    let liquorLicenseType = customQueryData[0]['liquor License Type']
                    let liquorLicenseClass = customQueryData[0]['liquor License Class']

                    let numberOfBooths = customQueryData[0]['number of Booths']
                    let approvedBooth = customQueryData[0]['approved Booth']
                    let approvedStorage = customQueryData[0]['approved Storage']
                    let flammableLiquids = customQueryData[0]['flammable Liquids']
                    let approvedMixing = customQueryData[0]['approved Mixing']
                    let extinguishingSystem = customQueryData[0]['extinguishing System']
                    let mixing = customQueryData[0]['mixing']
                    let childCareCategory = customQueryData[0]['child Care Category']
                    let childCareType = customQueryData[0]['child Care Type']
                    let fromHours = customQueryData[0]['from Hours']
                    let fromMinutes = customQueryData[0]['from Minutes']
                    let fromAmPm = customQueryData[0]['from AM PM']
                    let toHours = customQueryData[0]['to Hours']
                    let toMinutes = customQueryData[0]['to Minutes']
                    let toAmPm = customQueryData[0]['to AM PM']
                    let childCareRestrictions = customQueryData[0]['child Care Restrictions']

                    // STEP 5 - Call getForms to get the Inspector and Chief Inspector for the Certificate.

                    // SIGNATURE ID LOOKUP
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


                    let queryParams = {
                        q: `[Signature Category] eq 'Operational Permits' AND [Status] eq 'Active'`,
                        fields: 'revisionId, instanceName, Status, Role, Childcare Facilities, Explosives and Blasting Agents, Fraternities and Sororities, Hazardous Materials, Health Care Facilities, High Rise Buildings, Hospitals, Storage and Use of Liquified, Storage of Scrap Tires, Hotels and Motels, Spraying and Dipping, Mobile Food Preparation Vehicles, Schools, Nursing Care Facilities, Mobile Home Courts, Places of Assembly'
                    };

                    let getFormsResp = await vvClient.forms.getForms(queryParams, inspectorTemplateID)
                    getFormsResp = JSON.parse(getFormsResp)
                    let getFormsData = (getFormsResp.hasOwnProperty('data') ? getFormsResp.data : null);
                    let getFormsLength = (Array.isArray(getFormsData) ? getFormsData.length : 0)

                    if (getFormsResp.meta.status !== 200) {
                        throw new Error(`Error encountered when calling getForms. ${getFormsResp.meta.statusMsg}.`)
                    }
                    if (!getFormsData || !Array.isArray(getFormsData)) {
                        throw new Error(`Data was not returned when calling getForms.`)
                    }


                    // Find Inspector Assigned to each Operational Permit Type.
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


                    // Find Chief Inspector.
                    let chiefInspector = getFormsData.filter(inspector => inspector[findKey(inspector, 'Role')] && inspector[findKey(inspector, 'Role')] === 'Chief Fire Inspector')

                    let chiefInspectorSignatureID = chiefInspector[0]['instanceName']
                    let inspectorSignatureID = ''

                    switch (operationalPermitType) {
                        case 'Childcare Facilities':
                            inspectorSignatureID = childcareInspector[0]['instanceName']
                            break;
                        case 'Explosives and Blasting Agents':
                            inspectorSignatureID = explosivesBlastingAgentsInspector[0]['instanceName']
                            break;
                        case 'Fraternities and Sororities':
                            inspectorSignatureID = fraternitiesSororitiesInspector[0]['instanceName']
                            break;
                        case 'Hazardous Materials':
                            inspectorSignatureID = hazardousMaterialsInspector[0]['instanceName']
                            break;
                        case 'Health Care Facilities (Residential & Non-Residential)':
                            inspectorSignatureID = healthCareInspector[0]['instanceName']
                            break;
                        case 'High Rise Buildings':
                            inspectorSignatureID = highRiseInspector[0]['instanceName']
                            break;
                        case 'Hospitals':
                            inspectorSignatureID = hospitalInspector[0]['instanceName']
                            break;
                        case 'Storage and Use Liquefied Petroleum Gas':
                            inspectorSignatureID = storageUseLiquifiedInspector[0]['instanceName']
                            break;
                        case 'Storage of Scrap Tires and Tire Byproducts':
                            inspectorSignatureID = scrapTiresInspector[0]['instanceName']
                            break;
                        case 'Hotels and Motels':
                            inspectorSignatureID = hotelsMotelsInspector[0]['instanceName']
                            break;
                        case 'Spraying or Dipping':
                            inspectorSignatureID = sprayingDippingInspector[0]['instanceName']
                            break;
                        case 'Mobile Food Preparation Vehicles':
                            inspectorSignatureID = mobileFoodVehiclesInspector[0]['instanceName']
                            break;
                        case 'Schools':
                            inspectorSignatureID = schoolsInspector[0]['instanceName']
                            break;
                        case 'Nursing Care Facilities':
                            inspectorSignatureID = nursingCareInspector[0]['instanceName']
                            break;
                        case 'Mobile Home Court':
                            inspectorSignatureID = mobileHomeCourtInspector[0]['instanceName']
                            break;
                        case 'Places of Assembly':
                            inspectorSignatureID = placesOfAssemblyInspector[0]['instanceName']
                            break;
                        default:
                            inspectorSignatureID = chiefInspectorSignatureID
                    }


                    // STEP 6 - Call postForms to create a new Operational Permit Certificate.
                    let expireDate = `12/31/${certificateToGen['Certificate Year']}`
                    let certificateStatus = 'Pending Inspection'
                    let certificateType = 'New'

                    if (newOrRenewal === 'Renewal') {
                        certificateStatus = 'Open'
                        certificateType = 'Renewal'
                    }

                    if (operationalPermitType === 'Storage and Use Liquefied Petroleum Gas' || operationalPermitType === 'Childcare Facilities') {
                        expireDate = ''
                    }

                    let postFormsObj = {
                        'Permit Number': '',
                        'Permit Type': operationalPermitType,
                        'Permit Classification': feeClassification,

                        'Facility Name': facilityName,
                        'Address': facilityAddress,

                        'Total Maximum Occupancy': maximumOccupancy,

                        'Liquor License Number': liquorLicenseNumber,
                        'Liquor License Type': liquorLicenseType,
                        'Liquor License Class': liquorLicenseClass,

                        'Health Number of Beds': numberOfBeds,
                        'Health Type': healthCareType,
                        'Health Care Group': healthCareGroup,

                        'Number of Rooms': numberOfRooms,
                        'Number of Spaces': numberOfSpaces,

                        'Number of Booths': numberOfBooths,
                        'Approved Booth': approvedBooth,
                        'Approved Storage': approvedStorage,
                        'Flammable Liquids': flammableLiquids,
                        'Approved Mixing': approvedMixing,
                        'Extinguishing System': extinguishingSystem,
                        'Mixing': mixing,

                        'Child Care Category': childCareCategory,
                        'Child Care Type': childCareType,
                        'From Hours': fromHours,
                        'From Minutes': fromMinutes,
                        'From AM PM': fromAmPm,
                        'To Hours': toHours,
                        'To Minutes': toMinutes,
                        'To AM PM': toAmPm,
                        'Child Care Restrictions': childCareRestrictions,

                        'Issue Date': moment().tz(timeZone).format(dateFormat),
                        'Date Expires': expireDate,

                        'Status': certificateStatus,
                        'Business ID': businessID,
                        'Certificate Type': certificateType,
                        'Operational Permit ID': operationalPermitID,
                        'Inspector Signature ID': inspectorSignatureID,
                        'Chief Signature ID': chiefInspectorSignatureID,
                        'Certificate Year': certificateToGen['Certificate Year'],
                    }

                    let postFormsResp = await vvClient.forms.postForms(null, postFormsObj, certificateTemplateID)
                    let postFormsData = (postFormsResp.hasOwnProperty('data') ? postFormsResp.data : null)

                    if (postFormsResp.meta.status !== 201) {
                        throw new Error(`An error was encountered when attempting to create the ${certificateTemplateID} record. 
  (${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message})`)
                    }
                    if (!postFormsData) {
                        throw new Error(`Data was not returned when calling postForms.`)
                    }

                    let generatedCertificateGUID = postFormsData['revisionId']
                    let generatedCertificateRecordID = postFormsData['instanceName']


                    if (newOrRenewal === 'New') {
                        newCertificatesGenerated.push({
                            'REVISIONID': generatedCertificateGUID,
                            'instanceName': generatedCertificateRecordID
                        })
                    }


                    if (newOrRenewal === 'Renewal') {
                        renewalCertificatesGenerated.push({
                            'REVISIONID': generatedCertificateGUID,
                            'instanceName': generatedCertificateRecordID
                        })
                    }


                    // STEP 6A - Call postFormRevision to get the permit number using the Record ID from the previous step.

                    /*        CC	Childcare Facilities
                              EX	Explosives and Blasting Agents 
                              SF	Fraternities and Sororities
                              HZ	Hazardous Materials
                              L	Health Care Facilities
                              HRB	High Rise Buildings 
                              H	Hospitals
                              RCL	Hotels and Motels
                              SP	Spraying and Dipping
                              MFP	Mobile Food Preparation Vehicles 
                              SCH	Schools
                              NCF	Nursing Care Facilities
                              K	Mobile Home Courts
                              ST	Storage and Use of Liquefied Petroleum Gas
                              SY	Storage of Scrap Tires and Tire Byproducts 
                              POA	Places of Assembly
                    */

                    let permitNumberPrefix = ''

                    switch (operationalPermitType) {
                        case 'Childcare Facilities':
                            permitNumberPrefix = 'CC'
                            break;
                        case 'Explosives and Blasting Agents':
                            permitNumberPrefix = 'EX'
                            break;
                        case 'Fraternities and Sororities':
                            permitNumberPrefix = 'SF'
                            break;
                        case 'Hazardous Materials':
                            permitNumberPrefix = 'HZ'
                            break;
                        case 'Health Care Facilities (Residential & Non-Residential)':
                            permitNumberPrefix = 'L'
                            break;
                        case 'High Rise Buildings':
                            permitNumberPrefix = 'HRB'
                            break;
                        case 'Hospitals':
                            permitNumberPrefix = 'H'
                            break;
                        case 'Storage and Use Liquefied Petroleum Gas':
                            permitNumberPrefix = 'ST'
                            break;
                        case 'Storage of Scrap Tires and Tire Byproducts':
                            permitNumberPrefix = 'SY'
                            break;
                        case 'Hotels and Motels':
                            permitNumberPrefix = 'RCL'
                            break;
                        case 'Spraying or Dipping':
                            permitNumberPrefix = 'SP'
                            break;
                        case 'Mobile Food Preparation Vehicles':
                            permitNumberPrefix = 'MFP'
                            break;
                        case 'Schools':
                            permitNumberPrefix = 'SCH'
                            break;
                        case 'Nursing Care Facilities':
                            permitNumberPrefix = 'NCF'
                            break;
                        case 'Mobile Home Court':
                            permitNumberPrefix = 'K'
                            break;
                        case 'Places of Assembly':
                            permitNumberPrefix = 'POA'
                            break;
                    }

                    let permitNumber = `${permitNumberPrefix}-${generatedCertificateRecordID.replace('OPPERM-CERTIFICATE-', '')}-${certificateToGen['Certificate Year']}`

                    let formUpdateObj = {
                        'Permit Number': permitNumber
                    }

                    let postFormResp = await vvClient.forms.postFormRevision(null, formUpdateObj, certificateTemplateID, generatedCertificateGUID)
                    if (postFormResp.meta.status !== 201) {
                        throw new Error(`An error was encountered when attempting to update the ${generatedCertificateRecordID} form. ${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message}`)
                    }


                    // STEP 7 - Call getForms to get all Occupancy Details for the most recent certificate.
                    if (newOrRenewal === 'Renewal') {
                        let queryParams = {
                            q: `[OpPerm Certificate ID] eq '${sortedCertificates[0]['instanceName']}' AND [Status] eq 'Active'`,
                            // q: `[Original Permit ID] eq '${originalPermitID}' AND [Status] eq 'Active'`,
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

                        // STEP 7A - Call postForms to generate Occupancy Details and associate it to the newly generated certificate if this is a renewal.
                        for (const occupancyDetail of occupancyDetails) {
                            let postFormsObj = {
                                'Room Name': occupancyDetail['room Name'],
                                'Max Occupancy': occupancyDetail['max Occupancy'],
                                'Permit Number': permitNumber,
                                'Status': 'Active',
                                'OpPerm Certificate ID': generatedCertificateRecordID,
                            }

                            let postFormsResp = await vvClient.forms.postForms(null, postFormsObj, occupancyDetailTemplateID)
                            let postFormsData = (postFormsResp.hasOwnProperty('data') ? postFormsResp.data : null)

                            if (postFormsResp.meta.status !== 201) {
                                throw new Error(`An error was encountered when attempting to create the ${occupancyDetailTemplateID} record. 
                (${postFormResp.hasOwnProperty('meta') ? postFormResp.meta.statusMsg : postFormResp.message})`)
                            }
                            if (!postFormsData) {
                                throw new Error(`Data was not returned when calling postForms.`)
                            }
                        }
                    }


                    // STEP 8 - Call LibOpPermStartInspection to generate an Inspection.
                    let generateInspectionArr = [
                        { name: 'Certificate ID', value: generatedCertificateRecordID },
                        { name: 'New or Renewal', value: newOrRenewal }
                    ];

                    let genInspectionResp = await vvClient.scripts.runWebService('LibOpPermStartInspection', generateInspectionArr)
                    let genInspectionData = (genInspectionResp.hasOwnProperty('data') ? genInspectionResp.data : null)

                    if (genInspectionResp.meta.status !== 200) {
                        throw new Error(`There was an error when calling LibOpPermStartInspection.`)
                    }
                    if (!genInspectionData || !Array.isArray(genInspectionData)) {
                        throw new Error(`Data was not returned when calling LibOpPermStartInspection.`)
                    }
                    if (genInspectionData[0] === 'Error') {
                        errorLog.push(...genInspectionData[2])
                        throw new Error(`The call to LibOpPermStartInspection returned with an error. ${genInspectionData[1]}.`)
                    }
                    if (genInspectionData[0] !== 'Success') {
                        throw new Error(`The call to LibOpPermStartInspection returned with an unhandled error.`)
                    }


                    resolve()
                } catch (error) {
                    errorLog.push(error)
                    resolve()
                }
            })
        }



        /****************
         BEGIN ASYNC CODE
        *****************/
        // STEP 1 - Call generateCertificate to generate a New certificate.
        if (Array.isArray(newCertificatesToGen)) {
            for (const operationalPermitID of newCertificatesToGen) {
                await generateCertificate(operationalPermitID, 'New')
            }
        }


        // STEP 2 - Call generateCertificate to generate a Renewal certificate.
        if (Array.isArray(renewalCertificatesToGen)) {
            for (const operationalPermitID of renewalCertificatesToGen) {
                await generateCertificate(operationalPermitID, 'Renewal')
            }
        }


        // STEP 9 - Send response with return array.
        outputCollection[0] = 'Success'
        outputCollection[1] = 'Certificate(s) Generated.'
        outputCollection[2] = renewalCertificatesGenerated
        outputCollection[3] = newCertificatesGenerated
        outputCollection[4] = null

    } catch (error) {
        // Log errors captured.
        logger.info(JSON.stringify(`${error} ${errorLog}`))
        outputCollection[0] = 'Error'
        outputCollection[1] = `${error.message}`
        outputCollection[2] = null
        outputCollection[3] = null
        outputCollection[4] = errorLog
    } finally {
        response.json(200, outputCollection)
    }
}