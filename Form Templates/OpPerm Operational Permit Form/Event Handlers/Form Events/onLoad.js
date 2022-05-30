//Operational Permit : On Load : On Load Process

var saved = VV.Form.GetFieldValue('chkbxSaved').toLowerCase()

if (saved !== 'true' && VV.Form.GetFieldValue('Tab Control') !== 'Step 2') {
    VV.Form.SetFieldValue('Tab Control', 'Step 1')
}

if (saved !== 'true') {
    VV.Form.SetFieldValue('Business State', 'NE')
    VV.Form.SetFieldValue('Business County', 'Lancaster')
    VV.Form.SetFieldValue('Facility State', 'NE')
    VV.Form.SetFieldValue('Facility County', 'Lancaster')
    VV.Form.SetFieldValue('Billing State', 'NE')
    VV.Form.SetFieldValue('Billing County', 'Lancaster')
    VV.Form.SetFieldValue('On Site State', 'NE')
    VV.Form.SetFieldValue('On Site County', 'Lancaster')

    if (VV.Form.FormUserGroups.includes('OpPerm Business Owner')) {
        VV.Form.Global.populateUserSearch('User Email')
    } else {
        VV.Form.SetFieldValue('Entered By City Staff', 'true')
    }

    VV.Form.SetFieldValue('Business Dropdown First Load', 'false')
    VV.Form.SetFieldValue('Billing Dropdown First Load', 'false')
    VV.Form.SetFieldValue('Facility Dropdown First Load', 'false')
    VV.Form.SetFieldValue('Onsite Dropdown First Load', 'false')
} else {
    VV.Form.Global.SetTabFocus('Details')
    VV.Form.SetFieldValue('Tab Control', 'Details')
}

VV.Form.Global.datagridSelectLoad('DataGrid Billing Contact');
VV.Form.Global.datagridSelectObserve('DataGrid Billing Contact');

VV.Form.Global.datagridSelectLoad('DataGrid On Site Contact');
VV.Form.Global.datagridSelectObserve('DataGrid On Site Contact');

VV.Form.Global.datagridSelectLoad('Data Grid Inspections');
VV.Form.Global.datagridSelectObserve('Data Grid Inspections');

VV.Form.Global.datagridSelectLoad('Certificate Data Grid');
VV.Form.Global.datagridSelectObserve('Certificate Data Grid');

VV.Form.Global.ActivateTabs();

VV.Form.Global.ValidationCreateModal()


// Calculate how many unpaid Invoice Line Items that are Not Paid.
var ddl = $('[VVFieldName="ddOpPermID"]');

// Empty contents of the DropDownList and then add a DropDownList select option and set it to be selected
ddl.empty().append($('<option>').val(VV.Form.GetFieldValue('OperationalPermitID')).text(VV.Form.GetFieldValue('OperationalPermitID')).attr("selected", "selected"))

// Trigger the onchange event that will go and update the Select Agency cascading dropdown
ddl.trigger("change")

if (VV.Form.FormUserGroups.includes('OpPerm Inspector') || VV.Form.FormUserGroups.includes('OpPerm Chief Inspector')) {

    $("[vvfieldname='Reason for Closure']").removeAttr('disabled').removeAttr('readonly')
    $("[vvfieldname='CloseReasonDD']").removeAttr('disabled').removeAttr('readonly')
    $("[vvfieldname='btnClosePermit']").removeAttr('disabled').removeAttr('readonly')

    $("[vvfieldname='Facility Reopen Date']").removeAttr('disabled').removeAttr('readonly')
    $("[vvfieldname='btnOpenPermit']").removeAttr('disabled').removeAttr('readonly')
}