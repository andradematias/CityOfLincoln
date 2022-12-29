// onLoad for Invoice

// Set Status if form hasn't been saved.
if (VV.Form.GetFieldValue('Form Saved') == 'false') {
    VV.Form.Global.SetFieldUpdate('Status', 'Not Paid')
}

VV.Form.Global.SetFieldUpdate('Line Items Removed', 'false')

// Load Payment Modals
VV.Form.Global.CreatePaymentModal()
VV.Form.Global.CreateACHPaymentModal()

// Validation Modal
VV.Form.Global.ValidationCreateModal()

// PayPal Logic
if (VV.Form.IsReadOnly == 'False') {
    var currentURL = window.location.href;

    if (currentURL.indexOf('PNREF') != -1 || currentURL.indexOf('RESULT=') != -1) {
        //A response has been received from PayPal. Process the URL.
        var getURLDetails = currentURL.split('?')[1];
        var urlDetailsArray = getURLDetails.split('&');

        urlObject = {};
        urlDetailsArray.forEach(function (component) {
            var componentArray = component.split('=');
            urlObject[componentArray[0]] = componentArray[1];
        });

        //Now that we have an object of the URL components, we can measure it.
        if (urlObject.hasOwnProperty('RESULT')) {
            if (urlObject['RESULT'] == 0) {

                //Good response, set some field values.
                VV.Form.SetFieldValue('Total Paid', VV.Form.GetFieldValue('Total Owed'));
                VV.Form.Global.SetFieldUpdate('Status', 'Paid');
                VV.Form.SetFieldValue('Transaction ID', urlObject['PNREF']);
                VV.Form.SetFieldValue('PayPal Auth Code', urlObject['AUTHCODE']);

                var today = new Date();
                VV.Form.SetFieldValue('Date Paid', (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear());

                VV.Form.DoAjaxFormSave().then(function (resp) {
                    VV.Form.Template.SetLineItemsPaid()
                });

            } else if (urlObject['RESULT'] == 160) {
                //The user double-submitted the payment. Need to stop further payment actions by setting status to Unknown
                VV.Form.SetFieldValue('Status', 'Unknown');
                var messageData = 'An error occurred during payment processing. Please contact the City of Lincoln Building & Safety Department for assistance.';

                VV.Form.DoAjaxFormSave().then(function (resp) {
                    VV.Form.Global.DisplayMessaging(messageData, 'Payment Error');
                });

            }
            else {
                var errorMsg = decodeURIComponent(urlObject['RESPMSG']).replace(/\+/g, ' ');
                var messageData = 'PayPal returned an error message. ' + errorMsg;

                VV.Form.Global.DisplayMessaging(messageData, 'Payment Error')

            }
        }
        else {
            //Did not find an expected result value. 
            var messageData = 'An unexpected error occurred while trying to process your payment.';

            VV.Form.Global.DisplayMessaging(messageData, 'Payment Error')
        }
    } else {
        // Unless invoice has been paid it must be recalculated.
        if (VV.Form.GetFieldValue('Status') !== 'Paid' && VV.Form.GetFieldValue('Status') !== 'Unknown') {
            VV.Form.Global.SetFieldUpdate('Initially Calculated', 'false')

            VV.Form.Global.SetFieldUpdate('Payment Method', 'Select Item')

            // Data Grid Selected Rows
            VV.Form.Global.datagridSelectLoad('Data Grid Invoice Line Item')
            VV.Form.Global.datagridSelectObserve('Data Grid Invoice Line Item')
        }
    }
}