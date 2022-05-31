// Submit for OpPerm Operational Permit

var CallServerSide = function () {
    //This gets all of the form fields.
    var formData = VV.Form.getFormDataCollection();

    var FormInfo = {};
    FormInfo.name = 'REVISIONID';
    FormInfo.value = VV.Form.DataID;
    formData.push(FormInfo);

    //Following will prepare the collection and send with call to server side script.
    var data = JSON.stringify(formData);
    var requestObject = $.ajax({
        type: "POST",
        url: VV.BaseAppUrl + 'api/v1/' + VV.CustomerAlias + '/' + VV.CustomerDatabaseAlias + '/scripts?name=OpPermOperationalPermitSubmit',
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

                // Calculate how many unpaid Invoice Line Items that are Not Paid.
                var ddl = $('[VVFieldName="ddOpPermID"]');

                // Empty contents of the DropDownList and then add a DropDownList select option and set it to be selected
                ddl.empty().append($('<option>').val(VV.Form.GetFieldValue('OperationalPermitID')).text(VV.Form.GetFieldValue('OperationalPermitID')).attr("selected", "selected"))

                // Trigger the onchange event that will go and update the Select Agency cascading dropdown
                ddl.trigger("change")

                VV.Form.DoAjaxFormSave().then(function (resp) {

                    var messageData = 'Select OK to launch the Invoice record to pay the fee associated with this new operational permit or cancel to stop without taking any action.';
                    var title = 'Payment Due';

                    //Confirmation function
                    function okFunction() {
                        VV.Form.Template.PayAllFees()
                    }

                    function cancelFunction() {
                        return;
                    }

                    VV.Form.Global.DisplayConfirmMessaging(messageData, title, okFunction, cancelFunction);

                });

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
                messageData = 'An unhandled response occurred when calling OpPermOperationalPermitSubmit. The form will not save at this time.  Please try again or communicate this issue to support.';
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