//chkbxBillingforOnSite
if (VV.Form.GetFieldValue('chkbxBillingforOnSite').toLowerCase() === 'true') {
    VV.Form.SetFieldValue('On Site Business Name', VV.Form.GetFieldValue('Billing Business Name'));
    VV.Form.SetFieldValue('On Site First Name', VV.Form.GetFieldValue('Billing First Name'));
    VV.Form.SetFieldValue('On Site Last Name', VV.Form.GetFieldValue('Billing Last Name'));
    VV.Form.SetFieldValue('On Site MI', VV.Form.GetFieldValue('Billing MI'));
    VV.Form.SetFieldValue('On Site Work Phone', VV.Form.GetFieldValue('Billing Work Phone'));
    VV.Form.SetFieldValue('On Site Cell Phone', VV.Form.GetFieldValue('Billing Cell Phone'));
    VV.Form.SetFieldValue('On Site Email', VV.Form.GetFieldValue('Billing Email'));
    VV.Form.SetFieldValue('On Site Street Address', VV.Form.GetFieldValue('Billing Street Address'));
    VV.Form.SetFieldValue('On Site Room Suite', VV.Form.GetFieldValue('Billing Room Suite'));
    VV.Form.SetFieldValue('On Site Zip Code', VV.Form.GetFieldValue('Billing Zip Code'));
    VV.Form.SetFieldValue('On Site City', VV.Form.GetFieldValue('Billing City'));
    VV.Form.SetFieldValue('On Site State', VV.Form.getDropDownListText('Billing State'));
    VV.Form.SetFieldValue('On Site County', VV.Form.getDropDownListText('Billing County'));
    VV.Form.SetFieldValue('On Site Contact ID', VV.Form.GetFieldValue('Billing Contact ID'));
    VV.Form.SetFieldValue('OnSiteDD', 'Select Item');

    VV.Form.SetFieldValue('chkbxBusinessforOnSite', 'false');
} else if (VV.Form.GetFieldValue('chkbxBillingforOnSite').toLowerCase() === 'false') {
    VV.Form.SetFieldValue('On Site Business Name', '');
    VV.Form.SetFieldValue('On Site First Name', '');
    VV.Form.SetFieldValue('On Site Last Name', '');
    VV.Form.SetFieldValue('On Site MI', '');
    VV.Form.SetFieldValue('On Site Work Phone', '');
    VV.Form.SetFieldValue('On Site Cell Phone', '');
    VV.Form.SetFieldValue('On Site Email', '');
    VV.Form.SetFieldValue('On Site Street Address', '');
    VV.Form.SetFieldValue('On Site Room Suite', '');
    VV.Form.SetFieldValue('On Site Zip Code', '');
    VV.Form.SetFieldValue('On Site City', '');
    VV.Form.SetFieldValue('On Site State', 'NE');
    VV.Form.SetFieldValue('On Site County', 'Lancaster');
    VV.Form.SetFieldValue('On Site Contact ID', '');
}