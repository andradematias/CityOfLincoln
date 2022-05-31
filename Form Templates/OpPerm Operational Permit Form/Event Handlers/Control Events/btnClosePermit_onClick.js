/**
 * Form:    Operational Permit
 * Script:  btnClosePermit_onClick.js
 * ===============
 */

if (VV.Form.Template.FormValidation('CloseReasonDD') === true) {
    var messageData = 'You have indicated that you want to close this operational permit.';
    var title = 'Close Permit';

    var okFunction = function () {
        VV.Form.Template.ClosePermit();
    }

    var cancelFunction = function () {
        return;
    }

    VV.Form.Global.DisplayConfirmMessaging(messageData, title, okFunction, cancelFunction)
}
else {
    VV.Form.HideLoadingPanel();
    VV.Form.Global.DisplayMessaging('All of the fields have not been filled in completely or there is an issue with the range of the data entered.  Highlight your mouse over the red icon to see how you can resolve the error stopping you from saving this form.')
}