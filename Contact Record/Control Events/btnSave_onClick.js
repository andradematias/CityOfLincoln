//btnSave_onClick for Contact Record
let peopleType = 'People'

if (VV.Form.GetFieldValue('Type On Site').toLowerCase() === 'true' && VV.Form.GetFieldValue('Manage or Owner').toLowerCase() === 'false' && VV.Form.GetFieldValue('Type Billing').toLowerCase() === 'false') {
    peopleType = 'FacilityPeople'
}

if (VV.Form.GetFieldValue('Type Facility').toLowerCase() === 'true' && VV.Form.GetFieldValue('chkbxStaffFacilityOverride').toLowerCase() === 'true' && VV.Form.GetFieldValue('chkbxStaffFacilityOverride')) {
    VV.Form.Template.Save();
}

if (VV.Form.GetFieldValue('Type Facility').toLowerCase() === 'true' && VV.Form.Template.FormValidation('Facility')) {
    let messageData = 'The record has been saved.'
    let title = 'Save Form'

    VV.Form.ShowLoadingPanel()
    VV.Form.DoAjaxFormSave().then(function () {
        VV.Form.HideLoadingPanel()
        VV.Form.Global.DisplayMessaging(messageData, title)
    })
} else if (VV.Form.GetFieldValue('Type Business Information').toLowerCase() === 'true' && VV.Form.Template.FormValidation('People')) {
    let messageData = 'The record has been saved.'
    let title = 'Save Form'

    VV.Form.ShowLoadingPanel()
    VV.Form.DoAjaxFormSave().then(function () {
        VV.Form.HideLoadingPanel()
        VV.Form.Global.DisplayMessaging(messageData, title)
    })
} else if (VV.Form.GetFieldValue('Type Facility').toLowerCase() === 'false' && VV.Form.GetFieldValue('Type Business Information').toLowerCase() === 'false' && VV.Form.Template.FormValidation(peopleType)) {
    VV.Form.Template.Unique()
} else {
    VV.Form.HideLoadingPanel();
    VV.Form.Global.ValidationLoadModal(control.value)
}