if (VV.Form.GetDropDownListItemValue('ddUserSearch') === 'Select Item') {
    var ddl = $('[VVFieldName="ddUserSearch"]');
    ddl.prop('selectedIndex', 1);
    ddl.trigger("change");
}

VV.Form.SetFieldValue('Profile ID', VV.Form.getDropDownListText('ddUserSearch'))