//chkbxBusinessforOnSite
if (VV.Form.GetFieldValue('chkbxBusinessforOnSite').toLowerCase() === 'true') {
    VV.Form.SetFieldValue('On Site Business Name', VV.Form.GetFieldValue('Business Name'));
    VV.Form.SetFieldValue('On Site First Name', VV.Form.GetFieldValue('Business First Name'));
    VV.Form.SetFieldValue('On Site Last Name', VV.Form.GetFieldValue('Business Last Name'));
    VV.Form.SetFieldValue('On Site MI', VV.Form.GetFieldValue('Business MI'));
    VV.Form.SetFieldValue('On Site Work Phone', VV.Form.GetFieldValue('Business Work Number'));
    VV.Form.SetFieldValue('On Site Cell Phone', VV.Form.GetFieldValue('Business Cell Number'));
    VV.Form.SetFieldValue('On Site Email', VV.Form.GetFieldValue('Business Email'));
    VV.Form.SetFieldValue('On Site Street Address', VV.Form.GetFieldValue('Business Street Address'));
    VV.Form.SetFieldValue('On Site Room Suite', VV.Form.GetFieldValue('Business Room Suite'));
    VV.Form.SetFieldValue('On Site Zip Code', VV.Form.GetFieldValue('Business Zip Code'));
    VV.Form.SetFieldValue('On Site City', VV.Form.GetFieldValue('Business City'));
    VV.Form.SetFieldValue('On Site State', VV.Form.getDropDownListText('Business State'));
    VV.Form.SetFieldValue('On Site County', VV.Form.getDropDownListText('Business County'));
    VV.Form.SetFieldValue('OnSiteDD', 'Select Item');
    VV.Form.SetFieldValue('chkbxBillingforOnSite', 'false');
} else if (VV.Form.GetFieldValue('chkbxBusinessforOnSite').toLowerCase() === 'false') {
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