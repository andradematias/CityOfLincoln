function Form_onEventsEnd(e) {
    try {
        if (e && typeof e === 'string') {
            switch (e) {
                case 'GridSort':
                    //data grid sort
                    VV.Form.Global.SetTabFocus(VV.Form.GetFieldValue('Tab Control'));
                    break;
                case 'GridPageSize':
                    //data grid page size change
                    VV.Form.Global.SetTabFocus(VV.Form.GetFieldValue('Tab Control'));
                    break;
                case 'DoPostbackSave':
                    if (VV.Form.GetFieldValue('Tab Control') === 'Step 2') {
                        VV.Form.Global.ValidationGoToFieldFromModal('Label86')
                    }
                    break;
            }
        }
    } catch (ex) {
        console.log(ex);
    }
}

Form_onEventsEnd(event)