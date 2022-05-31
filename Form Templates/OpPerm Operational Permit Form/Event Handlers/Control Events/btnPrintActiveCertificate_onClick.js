// btnPrintActiveCertificate_onClick for OpPerm Operational Permit
//Confirmation message variables
var messageData = 'Select OK to continue launch the Certificate associated with this Operational Permit or cancel to stop without taking any action.';
var title = 'Print Certificate';

//Confirmation function
function okFunction() {
    VV.Form.Template.PrintCertificate()
}

function cancelFunction() {
    return;
}

VV.Form.Global.DisplayConfirmMessaging(messageData, title, okFunction, cancelFunction);