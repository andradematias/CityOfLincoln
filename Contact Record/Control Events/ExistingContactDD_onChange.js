//ExistingContactDD_onChange : Contact Record
if (VV.Form.getDropDownListText('ExistingContactDD') === 'Select Item' && VV.Form.GetFieldValue('Existing Contact First Load').toLowerCase() === 'true') {

  VV.Form.SetFieldValue('Business Name', '');
  VV.Form.SetFieldValue('First Name', '');
  VV.Form.SetFieldValue('Last Name', '');
  VV.Form.SetFieldValue('MI', '');
  VV.Form.SetFieldValue('Email Address', '');
  VV.Form.SetFieldValue('Work Phone', '');
  VV.Form.SetFieldValue('Cell Phone', '');
  VV.Form.SetFieldValue('Street Address', '');
  VV.Form.SetFieldValue('Room Suite', '');
  VV.Form.SetFieldValue('Zip Code', '');
  VV.Form.SetFieldValue('City', '');
  VV.Form.SetFieldValue('ddState', 'NE');
  VV.Form.SetFieldValue('ddCounty', 'Lincoln');
  VV.Form.SetFieldValue('GuidFromDD', '');
}

VV.Form.SetFieldValue('Existing Contact First Load', 'true')

if (VV.Form.getDropDownListText('ExistingContactDD') !== 'Select Item') {
  VV.Form.Template.SetProfileID();
}
