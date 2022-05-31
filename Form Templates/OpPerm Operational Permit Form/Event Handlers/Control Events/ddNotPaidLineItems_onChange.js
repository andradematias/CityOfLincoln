if (VV.Form.getDropDownListText('ddNotPaidLineItems') === 'Select Item') {
    var ddl = $('[VVFieldName="ddNotPaidLineItems"]')
    ddl.prop('selectedIndex', 1)
    ddl.trigger("change")
}

if (VV.Form.FormUserGroups.includes('OpPerm Billing Contact') || VV.Form.FormUserGroups.includes('OpPerm Business Owner')) {
    if (VV.Form.getDropDownListText('ddNotPaidLineItems') > 0) {

        var messageData = 'This Operational Permit has unpaid fees. Select OK to launch the Invoice record or cancel to stop without taking any action.';
        var title = 'Unpaid Fees';

        //Confirmation function
        function okFunction() {
            VV.Form.Template.PayAllFees()
        }

        function cancelFunction() {
            return;
        }

        VV.Form.Global.DisplayConfirmMessaging(messageData, title, okFunction, cancelFunction);

    }

}