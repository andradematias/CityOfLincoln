/**
 * Form:    Operational Permit
 * Script:  btnOpenPermit_onClick.js
 * ===============
 */

if (VV.Form.Template.FormValidation('Facility Reopen Date') === true) {
    var messageData = 'You have indicated that you want to re-open this operational permit.';
    messageData += '<br><br>An inspector will be dispatched to re-inspect the facility, which may incur a reinspection fee.';
    var title = 'Open Permit';

    var okFunction = function () {
        VV.Form.Template.OpenPermit();
    }

    var cancelFunction = function () {
        return;
    }

    VV.Form.Global.DisplayConfirmMessaging(messageData, title, okFunction, cancelFunction);
}
else {
    VV.Form.HideLoadingPanel();
    VV.Form.Global.DisplayMessaging('All of the fields have not been filled in completely or there is an issue with the range of the data entered. Highlight your mouse over the red icon to see how you can resolve the error stopping you from saving this form.');
}