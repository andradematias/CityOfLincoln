// PayAllFees for Invoice

var CallServerSide = function () {
    VV.Form.ShowLoadingPanel();
    //This gets all of the form fields.
    var formData = VV.Form.getFormDataCollection();

    var FormInfo = {};
    FormInfo.name = 'REVISIONID';
    FormInfo.value = VV.Form.DataID;
    formData.push(FormInfo);

    var FormInfo2 = {};
    FormInfo2.name = 'Called From Invoice';
    FormInfo2.value = 'false';
    formData.push(FormInfo2);

    var FormInfo3 = {};
    FormInfo3.name = 'Business ID';
    FormInfo3.value = VV.Form.GetFieldValue('Business ID');
    formData.push(FormInfo3);


    //Following will prepare the collection and send with call to server side script.
    var data = JSON.stringify(formData);
    var requestObject = $.ajax({
        type: "POST",
        url: VV.BaseAppUrl + 'api/v1/' + VV.CustomerAlias + '/' + VV.CustomerDatabaseAlias + '/scripts?name=InvoiceCheckUnpaidInvoice',
        contentType: "application/json; charset=utf-8",
        data: data,
        success: '',
        error: ''
    });

    return requestObject;
};

$.when(
    CallServerSide()
).always(function (resp) {
    var messageData = '';
    if (typeof (resp.status) != 'undefined') {
        messageData = "A status code of " + resp.status + " returned from the server.  There is a communication problem with the web servers.  If this continues, please contact the administrator and communicate to them this message and where it occurred.";
        VV.Form.HideLoadingPanel();
        VV.Form.Global.DisplayMessaging(messageData);
    }
    else if (typeof (resp.statusCode) != 'undefined') {
        messageData = "A status code of " + resp.statusCode + " with a message of '" + resp.errorMessages[0].message + "' returned from the server.  This may mean that the servers to run the business logic are not available.";
        VV.Form.HideLoadingPanel();
        VV.Form.Global.DisplayMessaging(messageData);
    }
    else if (resp.meta.status == '200') {
        if (resp.data[0] != undefined) {
            if (resp.data[0] == 'Success') {

                if (!resp.data[2]) {

                    var messageData = '<b>This Operational Permit is not fully submitted until all fees are paid.</b> Select OK to launch the Invoice form to pay all fees associated with this Operational Permit or cancel to stop without taking any action.';
                    var title = 'Pay Fee';

                    //Confirmation function
                    function okFunction() {

                        //Template GUID goes here
                        var templateId = '9db825d2-196c-eb11-a9c4-8460add3f78c';

                        //Field mappings
                        var fieldMappings = [
                            {
                                sourceFieldName: 'Business ID',
                                sourceFieldValue: VV.Form.GetFieldValue('Business ID'),
                                targetFieldName: 'Primary ID'
                            },
                            {
                                sourceFieldName: '',
                                sourceFieldValue: 'Operational Permits',
                                targetFieldName: 'Invoice Category'
                            }
                        ];

                        //Call the fill in global script
                        VV.Form.HideLoadingPanel()
                        VV.Form.DoPostbackSave()
                        VV.Form.Global.FillinAndRelateForm(templateId, fieldMappings);
                    }

                    function cancelFunction() {
                        return;
                    }

                    VV.Form.Global.DisplayConfirmMessaging(messageData, title, okFunction, cancelFunction);

                } else {

                    var messageData = '<b>This Operational Permit is not fully submitted until all fees are paid.</b> Select OK to launch the Invoice form to pay all fees associated with this Operational Permit or cancel to stop without taking any action.';
                    var title = 'Pay Fee';

                    //Confirmation function
                    function okFunction() {
                        var URL = VV.BaseURL + "FormDetails?DataID=" + resp.data[2] + "&hidemenu=true";
                        URL = URL.replace('+', '%2B');

                        VV.Form.HideLoadingPanel()
                        VV.Form.DoPostbackSave()

                        window.open(URL)
                    }

                    function cancelFunction() {
                        return;
                    }

                    VV.Form.Global.DisplayConfirmMessaging(messageData, title, okFunction, cancelFunction);

                }

            }
            else if (resp.data[0] == 'Error') {
                var errorsReturned = ''
                if (Array.isArray(resp.data[3]) && resp.data[3].length > 0) {
                    errorsReturned += '<br><br>'
                    errorsReturned += resp.data[3].join('<br><br>')
                }

                messageData = 'An error was encountered. ' + resp.data[1] + errorsReturned + '<br><br>' + 'Please try again or contact a system administrator if this problem continues.';

                VV.Form.HideLoadingPanel();
                VV.Form.Global.DisplayMessaging(messageData);
            }
            else {
                messageData = 'An unhandled response occurred when calling PayAllFees. The form will not save at this time.  Please try again or communicate this issue to support.';
                VV.Form.HideLoadingPanel();
                VV.Form.Global.DisplayMessaging(messageData);
            }
        }
        else {
            messageData = 'The status of the response returned as undefined.';
            VV.Form.HideLoadingPanel();
            VV.Form.Global.DisplayMessaging(messageData);
        }
    }
    else {
        messageData = "The following unhandled response occurred while attempting to retrieve data on the the server side get data logic." + resp.data.error + '<br>';
        VV.Form.HideLoadingPanel();
        VV.Form.Global.DisplayMessaging(messageData);
    }
});