//Operational Permit :businessDD : On Change
if (VV.Form.GetFieldValue('businessDD') != null) {
    VV.Form.SetFieldValue('chkbxBusiness', 'true')
}
if (VV.Form.getDropDownListText('businessDD') === 'Select Item' && VV.Form.GetFieldValue('Business Dropdown First Load').toLowerCase() === 'true') {
    VV.Form.SetFieldValue('Business ID', '')
    VV.Form.SetFieldValue('Business Name Submit', '')
    VV.Form.SetFieldValue('Business First Name', '')
    VV.Form.SetFieldValue('Business Last Name', '')
    VV.Form.SetFieldValue('Business MI', '')
    VV.Form.SetFieldValue('Business Work Number', '')
    VV.Form.SetFieldValue('Business Cell Number', '')
    VV.Form.SetFieldValue('Business Email', '')
    VV.Form.SetFieldValue('Business Street Address', '')
    VV.Form.SetFieldValue('Business Room Suite', '')
    VV.Form.SetFieldValue('Business Zip Code', '')
    VV.Form.SetFieldValue('Business City', '')
    VV.Form.SetFieldValue('Business State', 'NE')
    VV.Form.SetFieldValue('Business County', 'Lancaster')
}

VV.Form.SetFieldValue('Business Dropdown First Load', 'true')


var ddl = $('[VVFieldName="Business ID Parent"]')

ddl.empty().append('<option selected="selected" value=' + VV.Form.GetFieldValue('Business ID') + '>' + VV.Form.GetFieldValue('Business ID') + '</option>')

ddl.trigger("change");