// btnAssignBillingContact_onClick for OpPerm Operational Permit

var guidList = VV.Form.Global.datagridFindSelectedRows('DataGrid Billing Contact')

if (guidList.length) {

    VV.Form.Template.AssignBilling()

} else {
    //Assign Onsite Contact for OpPerm Operational Permit.

    //Template GUID goes here
    var templateId = '420248e1-5174-eb11-a9c4-8460add3f78c';

    //Field mappings
    var fieldMappings = [
        {
            sourceFieldName: '',
            sourceFieldValue: 'True',
            targetFieldName: 'Type Billing'
        },
        {
            sourceFieldName: '',
            sourceFieldValue: 'True',
            targetFieldName: 'Fill in and Relate'
        },
        {
            sourceFieldName: 'Business ID',
            sourceFieldValue: VV.Form.GetFieldValue('Business ID'),
            targetFieldName: 'Business ID'
        },
        {
            sourceFieldName: 'OperationalPermitID',
            sourceFieldValue: VV.Form.GetFieldValue('OperationalPermitID'),
            targetFieldName: 'Fillin Operational Permit ID'
        },
        {
            sourceFieldName: '',
            sourceFieldValue: 'Type Billing',
            targetFieldName: 'Fillin Type'
        }
    ];

    //Call the fill in global script
    VV.Form.Global.FillinAndRelateForm(templateId, fieldMappings);
}