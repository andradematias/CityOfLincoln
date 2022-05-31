//btnSubmit_onClick for OpPerm Operational Permit
if (VV.Form.Template.FormValidation() === true) {
    var messageData = '<b>Please verify all information is correct.</b> Select OK to Submit this Operational Permit or cancel to stop without taking any action.';
    var title = 'Submit Operational Permit';

    function okFunction() {
        VV.Form.DoAjaxFormSave().then(function (resp) {
            VV.Form.Template.NextStep2()
        });
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