// btnNext_onClick for OpPerm Operational Permit
if (VV.Form.Template.FormValidation('next') === true) {

    var messageData = 'Please verify all information is correct. <b>You will not be able to change the Owner of Record Business Name</b> once it has been set. Select OK to continue or cancel to stop without taking any action.';
    var title = 'Verify Information';

    //Confirmation function
    function okFunction() {
        VV.Form.Template.NextStepUnique()
    }

    function cancelFunction() {
        return;
    }

    VV.Form.Global.DisplayConfirmMessaging(messageData, title, okFunction, cancelFunction);
}
else {
    VV.Form.HideLoadingPanel();
    VV.Form.Global.ValidationLoadModal(control.value)
}