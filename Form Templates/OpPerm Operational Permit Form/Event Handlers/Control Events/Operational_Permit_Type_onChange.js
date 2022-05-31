//  Operational_Permit_Type_onChange  for Operational Permit
if (VV.Form.getDropDownListText('Operational Permit Type') === 'Places of Assembly') {
    VV.Form.SetFieldValue('Permit Category', 'Place of Assembly')
} else if (VV.Form.getDropDownListText('Operational Permit Type') === 'Hospitals' || VV.Form.getDropDownListText('Operational Permit Type') === 'Nursing Care Facilities' || VV.Form.getDropDownListText('Operational Permit Type') === 'Health Care Facilities (Residential & Non-Residential)') {

    VV.Form.SetFieldValue('Permit Category', 'Health')

} else {
    VV.Form.SetFieldValue('Permit Category', 'Other')

}

if (VV.Form.getDropDownListText('Operational Permit Type') === 'Select Item') {
    VV.Form.SetFieldValue('Fee Schedule', '')
}