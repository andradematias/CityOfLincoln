//chkbxBusinessforBilling
if (VV.Form.GetFieldValue('chkbxBusinessforBilling').toLowerCase() === 'true') {
    VV.Form.SetFieldValue('Billing Business Name', VV.Form.GetFieldValue('Business Name'));
    VV.Form.SetFieldValue('Billing First Name', VV.Form.GetFieldValue('Business First Name'));
    VV.Form.SetFieldValue('Billing Last Name', VV.Form.GetFieldValue('Business Last Name'));
    VV.Form.SetFieldValue('Billing MI', VV.Form.GetFieldValue('Business MI'));
    VV.Form.SetFieldValue('Billing Work Phone', VV.Form.GetFieldValue('Business Work Number'));
    VV.Form.SetFieldValue('Billing Cell Phone', VV.Form.GetFieldValue('Business Cell Number'));
    VV.Form.SetFieldValue('Billing Email', VV.Form.GetFieldValue('Business Email'));
    VV.Form.SetFieldValue('Billing Street Address', VV.Form.GetFieldValue('Business Street Address'));
    VV.Form.SetFieldValue('Billing Room Suite', VV.Form.GetFieldValue('Business Room Suite'));
    VV.Form.SetFieldValue('Billing Zip Code', VV.Form.GetFieldValue('Business Zip Code'));
    VV.Form.SetFieldValue('Billing City', VV.Form.GetFieldValue('Business City'));
    VV.Form.SetFieldValue('Billing State', VV.Form.getDropDownListText('Business State'));
    VV.Form.SetFieldValue('Billing County', VV.Form.getDropDownListText('Business County'));
    VV.Form.SetFieldValue('BillingDD', 'Select Item');
} else if (VV.Form.GetFieldValue('chkbxBusinessforBilling').toLowerCase() === 'false') {
    VV.Form.SetFieldValue('Billing Business Name', '');
    VV.Form.SetFieldValue('Billing First Name', '');
    VV.Form.SetFieldValue('Billing Last Name', '');
    VV.Form.SetFieldValue('Billing MI', '');
    VV.Form.SetFieldValue('Billing Work Phone', '');
    VV.Form.SetFieldValue('Billing Cell Phone', '');
    VV.Form.SetFieldValue('Billing Email', '');
    VV.Form.SetFieldValue('Billing Street Address', '');
    VV.Form.SetFieldValue('Billing Room Suite', '');
    VV.Form.SetFieldValue('Billing Zip Code', '');
    VV.Form.SetFieldValue('Billing City', '');
    VV.Form.SetFieldValue('Billing State', 'NE');
    VV.Form.SetFieldValue('Billing County', 'Lancaster');
    VV.Form.SetFieldValue('Billing Contact ID', '');
}