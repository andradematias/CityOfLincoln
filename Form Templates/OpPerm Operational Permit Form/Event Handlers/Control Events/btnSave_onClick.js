/**
 * Form:    Operational Permit
 * Script:  btnSave_onClick.js
 * ===============
 */

var messageData = 'You have indicated that you want to save your current progress for this operational permit, doing so will <strong>not</strong> submit the permit for review at this time.';
messageData += '<br><br>You may continue this operational permit later from your home screen.';
messageData += '<br><br>If you are finished and the operational permit is ready for review, please click the Submit button.';
var title = 'Save Progress';

var okFunction = function () {
    VV.Form.DoPostbackSave();
}

var cancelFunction = function () {
    return;
}

VV.Form.Global.DisplayConfirmMessaging(messageData, title, okFunction, cancelFunction)