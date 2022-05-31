// NextStep2 for OpPerm Operational Permit

var CallServerSide = function () {
    VV.Form.ShowLoadingPanel();
    //This gets all of the form fields.
    var formData = VV.Form.getFormDataCollection();

    var FormInfo = {};
    FormInfo.name = 'REVISIONID';
    FormInfo.value = VV.Form.DataID;
    formData.push(FormInfo);

    var baseURL = {};
    baseURL.name = 'Base URL';
    baseURL.value = VV.BaseAppUrl;
    formData.push(baseURL);

    //Following will prepare the collection and send with call to server side script.
    var data = JSON.stringify(formData);
    var requestObject = $.ajax({
        type: "POST",
        url: VV.BaseAppUrl + 'api/v1/' + VV.CustomerAlias + '/' + VV.CustomerDatabaseAlias + '/scripts?name=OpPermOperationalPermitNextStep2',
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

                VV.Form.Global.SetFieldUpdate('chkbxSaved', 'True')
                VV.Form.Global.SetFieldUpdate('Tab Control', 'Details');
                VV.Form.Global.SetTabFocus('Details');
                VV.Form.Global.SetFieldUpdate('Status', 'Open');

                VV.Form.Global.SetFieldValuesFromObj(resp.data[2])

                VV.Form.DoAjaxFormSave().then(function (resp) {

                    if (VV.Form.GetFieldValue('Migration Renewal').toLowerCase() === 'true' && (VV.Form.GetFieldValue('Operational Permit Type') === 'Storage and Use Liquefied Petroleum Gas' || VV.Form.GetFieldValue('Operational Permit Type') === 'Childcare Facilities')) {
                        VV.Form.DoPostbackSave()

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
                    } else {
                        VV.Form.Template.PayAllFees()
                    }
                });

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
                messageData = 'An unhandled response occurred when calling OpPermOperationalPermitNextStep2. The form will not save at this time.  Please try again or communicate this issue to support.';
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