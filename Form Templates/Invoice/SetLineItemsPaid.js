// SetLineItemsPaid for Invoice

var CallServerSide = function () {
    //This gets all of the form fields.

    VV.Form.SetFieldValue('Paid By Email', VV.Form.FormUserID)

    var formData = VV.Form.getFormDataCollection();

    var baseURL = {};
    baseURL.name = 'Base URL';
    baseURL.value = VV.BaseURL;
    formData.push(baseURL);

    var FormInfo = {};
    FormInfo.name = 'REVISIONID';
    FormInfo.value = VV.Form.DataID;
    formData.push(FormInfo);

    //Following will prepare the collection and send with call to server side script.
    var data = JSON.stringify(formData);
    var requestObject = $.ajax({
        type: "POST",
        url: VV.BaseAppUrl + 'api/v1/' + VV.CustomerAlias + '/' + VV.CustomerDatabaseAlias + '/scripts?name=InvoiceSetLineItemsPaid',
        contentType: "application/json; charset=utf-8",
        data: data,
        success: '',
        error: ''
    });

    return requestObject;
};

VV.Form.ShowLoadingPanel();

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

                if (resp.data[2] != "") {
                    var certsGenerated = []

                    resp.data[2].forEach(function (elem) {
                        certsGenerated.push(elem['instanceName'])
                    })

                    VV.Form.Global.SetFieldUpdate('Certificates Generated', certsGenerated.join(','))

                    var certificateMessage = ''

                    if (certsGenerated.length === 1) {
                        certificateMessage = 'Your Certificate is available to print from your home screen under the Open Certificates tab and a link has been emailed to you.'
                    }

                    if (certsGenerated.length >= 1) {
                        certificateMessage = 'Your Certificates are available to print from the home screen under the Open Certificates tab and links have been emailed to you.'
                    }
                    messageData = 'The Invoice has been marked as Paid. You may click the Print Invoice button to print this invoice. ' + certificateMessage;
                }
                else {
                    messageData = 'The Invoice has been marked as Paid. You may click the Print Invoice button to print this invoice.';
                }
                var title = 'Invoice Paid';

                VV.Form.SetFieldValue('Form Saved', 'True')

                VV.Form.HideLoadingPanel();
                VV.Form.Global.DisplayMessaging(messageData, title)
                VV.Form.DoPostbackSave()

            }
            else if (resp.data[0] == 'Error') {
                var errorsReturned = ''
                if (Array.isArray(resp.data[2]) && resp.data[2].length > 0) {
                    errorsReturned += '<br><br>'
                    errorsReturned += resp.data[2].join('<br><br>')
                }

                messageData = 'An error was encountered. ' + resp.data[1] + errorsReturned + '<br><br>' + 'Please try again or contact a system administrator if this problem continues.';

                VV.Form.HideLoadingPanel();
                VV.Form.Global.DisplayMessaging(messageData);
            }
            else {
                messageData = 'An unhandled response occurred when calling SetLineItemsPaid. The form will not save at this time.  Please try again or communicate this issue to support.';
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
})