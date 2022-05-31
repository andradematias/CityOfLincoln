/**
 * Form:    Operational Permit
 * Script:  FormValidation.js
 * ===============
 */

/* FIELD NAME, VALIDATION TYPE, & EVENT

fieldName | validationType | event
Applicant Email | Email | Blur
Applicant First Name | Blank | Blur
Applicant Last Name | Blank | Blur
Applicant Phone | Phone | Blur
Applicant Signature | Signature | Blur
Billing Cell Phone | Phone Required | Blur
Billing City | Blank | Blur
Billing Email | Email | Blur
Billing First Name | Blank | Blur
Billing Last Name | Blank | Blur
Billing State | DropDown | Blur
Billing Street Address | Blank | Blur
Billing Work Phone | Phone Required | Blur
Billing Zip Code | Zip | Blur
Business Cell Number | Phone Required | Blur
Business City | Blank | Blur
Business Email | Email | Blur
Business First Name | Blank | Blur
Business Last Name | Blank | Blur
Business Name | Blank | Blur
Business State | DropDown | Blur
Business Street Address | Blank | Blur
Business Work Number | Phone Required | Blur
Business Zip Code | Zip | Blur
Closure Type | DropDown | Blur
Facility City | Blank | Blur
Facility County | DropDown | Blur
Facility Name | Blank | Blur
Facility Open Date | Today or after | Blur
Facility Reopen Date | Today or after | Blur
Facility State | DropDown | Blur
Facility Street Address | Blank | Blur
Facility Zip Code | Zip | Blur
On Site Cell Phone | Phone Required | Blur
On Site Email | Email | Blur
On Site First Name | Blank | Blur
On Site Last Name | Blank | Blur
On Site Work Phone | Phone Required | Blur
Operational Permit Type | DropDown | Blur

*/

// Pass in ControlName to validate a single item or nothing to validate everything.
var ErrorReporting = true;

var RunAll = false;
if (ControlName == null) {
    RunAll = true;
}


/*************************************
    BEGIN GENERATED VALIDATION CODE
**************************************/

//Applicant Email - Email Address is required by city staff, but when entered, it must be in a valid email format.
var filledInByStaff = VV.Form.GetFieldValue('Entered By City Staff').toLowerCase()
if (filledInByStaff === 'true') {
    if (ControlName == 'Applicant Email' || RunAll) {
        if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Applicant Email').trim(), 'Blank') == true) {
            if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Applicant Email'), 'Email') == false) {
                VV.Form.SetValidationErrorMessageOnField('Applicant Email', 'When an email address is entered, it must be in the form of a valid email address.');
                ErrorReporting = false;
            } else {
                VV.Form.ClearValidationErrorOnField('Applicant Email');
            }
        } else {
            VV.Form.SetValidationErrorMessageOnField('Applicant Email', 'When an email address is entered, it must be in the form of a valid email address.');
            ErrorReporting = false;
        }
    }
}
//Applicant First Name - Field that must be completed.
if (ControlName == 'Applicant First Name' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Applicant First Name'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Applicant First Name', 'Please complete the Applicant First Name field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Applicant First Name');
    }
}
//Applicant Last Name - Field that must be completed.
if (ControlName == 'Applicant Last Name' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Applicant Last Name'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Applicant Last Name', 'Please complete the Applicant Last Name field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Applicant Last Name');
    }
}
//Applicant Phone - Phone Number is required, and must be entered in a valid phone number format. With auto-formatting.
var enteredValue = VV.Form.GetFieldValue('Applicant Phone');
var formattedVal = VV.Form.Global.FormatPhone(enteredValue);

if (formattedVal != enteredValue) {
    VV.Form.SetFieldValue('Applicant Phone', formattedVal);
} else {
    if (ControlName == 'Applicant Phone' || RunAll) {
        if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Applicant Phone'), 'Phone') == false) {
            VV.Form.SetValidationErrorMessageOnField('Applicant Phone', 'A phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField('Applicant Phone');
        }
    }
}
//Applicant Signature - Signature is required.
var filledInByStaff = VV.Form.GetFieldValue('Entered By City Staff').toLowerCase()
if (filledInByStaff !== 'true') {
    if (ControlName == 'Applicant Signature' || RunAll) {
        if (VV.Form.GetFieldValue('Applicant Signature') != 'true') {
            VV.Form.SetValidationErrorMessageOnField('Applicant Signature', 'A valid signature is required.');
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField('Applicant Signature');
        }
    }
}
//Billing Cell Phone - Phone Number is required, and must be entered in a valid phone number format. With auto-formatting.
var enteredValue = VV.Form.GetFieldValue('Billing Cell Phone');
var formattedVal = VV.Form.Global.FormatPhone(enteredValue);

if (formattedVal != enteredValue) {
    VV.Form.SetFieldValue('Billing Cell Phone', formattedVal);
} else {
    if (ControlName == 'Billing Cell Phone' || RunAll) {
        if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Billing Work Phone'), 'Phone') == true) {
            if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Billing Cell Phone'), 'Blank') == false) {
                VV.Form.ClearValidationErrorOnField('Billing Cell Phone');
            } else {
                if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Billing Cell Phone'), 'Phone') == false) {
                    VV.Form.SetValidationErrorMessageOnField('Billing Cell Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                    VV.Form.SetValidationErrorMessageOnField('Billing Work Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                    ErrorReporting = false;
                } else {
                    VV.Form.ClearValidationErrorOnField('Billing Work Phone');
                    VV.Form.ClearValidationErrorOnField('Billing Cell Phone');
                }
            }
        } else {
            if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Billing Cell Phone'), 'Phone') == false) {
                VV.Form.SetValidationErrorMessageOnField('Billing Work Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                VV.Form.SetValidationErrorMessageOnField('Billing Cell Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                ErrorReporting = false;
            } else {
                VV.Form.ClearValidationErrorOnField('Billing Work Phone');
                VV.Form.ClearValidationErrorOnField('Billing Cell Phone');
            }
        }
    }
}
//Billing Work Phone - Phone Number is required, and must be entered in a valid phone number format. With auto-formatting.
var enteredValue = VV.Form.GetFieldValue('Billing Work Phone');
var formattedVal = VV.Form.Global.FormatPhone(enteredValue);

if (formattedVal != enteredValue) {
    VV.Form.SetFieldValue('Billing Work Phone', formattedVal);
} else {
    if (ControlName == 'Billing Work Phone' || RunAll) {
        if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Billing Cell Phone'), 'Phone') == true) {
            if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Billing Work Phone'), 'Blank') == false) {
                VV.Form.ClearValidationErrorOnField('Billing Work Phone');
            } else {
                if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Billing Work Phone'), 'Phone') == false) {
                    VV.Form.SetValidationErrorMessageOnField('Billing Work Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                    VV.Form.SetValidationErrorMessageOnField('Billing Cell Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                    ErrorReporting = false;
                } else {
                    VV.Form.ClearValidationErrorOnField('Billing Work Phone');
                    VV.Form.ClearValidationErrorOnField('Billing Cell Phone');
                }
            }
        } else {
            if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Billing Work Phone'), 'Phone') == false) {
                VV.Form.SetValidationErrorMessageOnField('Billing Work Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                VV.Form.SetValidationErrorMessageOnField('Billing Cell Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                ErrorReporting = false;
            } else {
                VV.Form.ClearValidationErrorOnField('Billing Work Phone');
                VV.Form.ClearValidationErrorOnField('Billing Cell Phone');
            }
        }
    }
}
//Billing City - Field that must be completed.
if (ControlName == 'Billing City' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Billing City'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Billing City', 'Please complete the Billing City field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Billing City');
    }
}
//Billing Email - Email Address is required, but when entered, it must be in a valid email format.
if (ControlName == 'Billing Email' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Billing Email'), 'Blank') == true) {
        if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Billing Email'), 'Email') == false) {
            VV.Form.SetValidationErrorMessageOnField('Billing Email', 'When an email address is entered, it must be in the form of a valid email address.');
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField('Billing Email');
        }
    } else {
        VV.Form.SetValidationErrorMessageOnField('Billing Email', 'When an email address is entered, it must be in the form of a valid email address.');
        ErrorReporting = false;
    }
}
//Billing First Name - Field that must be completed.
if (ControlName == 'Billing First Name' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Billing First Name'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Billing First Name', 'Please complete the Billing First Name field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Billing First Name');
    }
}
//Billing Last Name - Field that must be completed.
if (ControlName == 'Billing Last Name' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Billing Last Name'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Billing Last Name', 'Please complete the Billing Last Name field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Billing Last Name');
    }
}
//Billing State - DropDown must be selected.
if (ControlName == 'Billing State' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.getDropDownListText('Billing State'), 'DDSelect') == false) {
        VV.Form.SetValidationErrorMessageOnField('Billing State', 'Please make a selection from the Billing State Dropdown.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Billing State');
    }
}
//Billing Street Address - Field that must be completed.
if (ControlName == 'Billing Street Address' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Billing Street Address'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Billing Street Address', 'Please complete the Billing Street Address field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Billing Street Address');
    }
}
//Billing Zip Code - Billing Zip Code is required, and must be entered in a valid Billing Zip Code format. With auto-formatting.
var enteredValue = VV.Form.GetFieldValue('Billing Zip Code');
var formattedVal = VV.Form.Global.FormatZipCode(enteredValue);

if (formattedVal != enteredValue) {
    VV.Form.SetFieldValue('Billing Zip Code', formattedVal);
} else {
    if (ControlName == 'Billing Zip Code' || RunAll) {
        if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Billing Zip Code'), 'Zip') == false) {
            VV.Form.SetValidationErrorMessageOnField('Billing Zip Code', 'A Billing Zip Code must be entered, and it must be in the format of XXXXX or XXXXX-XXXX.');
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField('Billing Zip Code');
        }
    }
}
//Business Cell Number - Phone Number is required, and must be entered in a valid phone number format. With auto-formatting.
var enteredValue = VV.Form.GetFieldValue('Business Cell Number');
var formattedVal = VV.Form.Global.FormatPhone(enteredValue);

if (formattedVal != enteredValue) {
    VV.Form.SetFieldValue('Business Cell Number', formattedVal);
} else {
    if (ControlName == 'Business Cell Number' || RunAll || ControlName == 'next') {
        if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business Work Number'), 'Phone') == true) {
            if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business Cell Number'), 'Blank') == false) {
                VV.Form.ClearValidationErrorOnField('Business Cell Number');
            } else {
                if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business Cell Number'), 'Phone') == false) {
                    VV.Form.SetValidationErrorMessageOnField('Business Cell Number', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                    VV.Form.SetValidationErrorMessageOnField('Business Work Number', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                    ErrorReporting = false;
                } else {
                    VV.Form.ClearValidationErrorOnField('Business Work Number');
                    VV.Form.ClearValidationErrorOnField('Business Cell Number');
                }
            }
        } else {
            if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business Cell Number'), 'Phone') == false) {
                VV.Form.SetValidationErrorMessageOnField('Business Work Number', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                VV.Form.SetValidationErrorMessageOnField('Business Cell Number', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                ErrorReporting = false;
            } else {
                VV.Form.ClearValidationErrorOnField('Business Work Number');
                VV.Form.ClearValidationErrorOnField('Business Cell Number');
            }
        }
    }
}
//Business Work Number - Phone Number is required, and must be entered in a valid phone number format. With auto-formatting.
var enteredValue = VV.Form.GetFieldValue('Business Work Number');
var formattedVal = VV.Form.Global.FormatPhone(enteredValue);

if (formattedVal != enteredValue) {
    VV.Form.SetFieldValue('Business Work Number', formattedVal);
} else {
    if (ControlName == 'Business Work Number' || RunAll || ControlName == 'next') {
        if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business Cell Number'), 'Phone') == true) {
            if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business Work Number'), 'Blank') == false) {
                VV.Form.ClearValidationErrorOnField('Business Work Number');
            } else {
                if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business Work Number'), 'Phone') == false) {
                    VV.Form.SetValidationErrorMessageOnField('Business Work Number', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                    VV.Form.SetValidationErrorMessageOnField('Business Cell Number', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                    ErrorReporting = false;
                } else {
                    VV.Form.ClearValidationErrorOnField('Business Work Number');
                    VV.Form.ClearValidationErrorOnField('Business Cell Number');
                }
            }
        } else {
            if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business Work Number'), 'Phone') == false) {
                VV.Form.SetValidationErrorMessageOnField('Business Work Number', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                VV.Form.SetValidationErrorMessageOnField('Business Cell Number', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                ErrorReporting = false;
            } else {
                VV.Form.ClearValidationErrorOnField('Business Work Number');
                VV.Form.ClearValidationErrorOnField('Business Cell Number');
            }
        }
    }
}
//Business City - Field that must be completed.
if (ControlName == 'Business City' || RunAll || ControlName == 'next') {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business City'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Business City', 'Please complete the Business City field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Business City');
    }
}
//Business Email - Email Address is required, but when entered, it must be in a valid email format.
if (ControlName == 'Business Email' || RunAll || ControlName == 'next') {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business Email').trim(), 'Blank') == true) {
        if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business Email'), 'Email') == false) {
            VV.Form.SetValidationErrorMessageOnField('Business Email', 'When an email address is entered, it must be in the form of a valid email address.');
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField('Business Email');
        }
    } else {
        VV.Form.SetValidationErrorMessageOnField('Business Email', 'When an email address is entered, it must be in the form of a valid email address.');
        ErrorReporting = false;
    }
}
//Business First Name - Field that must be completed.
if (ControlName == 'Business First Name' || RunAll || ControlName == 'next') {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business First Name'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Business First Name', 'Please complete the Business First Name field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Business First Name');
    }
}
//Business Last Name - Field that must be completed.
if (ControlName == 'Business Last Name' || RunAll || ControlName == 'next') {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business Last Name'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Business Last Name', 'Please complete the Business Last Name field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Business Last Name');
    }
}
//Business Name Submit - Field that must be completed.
if (ControlName == 'Business Name Submit' || RunAll || ControlName == 'next') {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business Name Submit'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Business Name Submit', 'Please complete the Business Name Submit field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Business Name Submit');
    }
}
//Business State - DropDown must be selected.
if (ControlName == 'Business State' || RunAll || ControlName == 'next') {
    if (VV.Form.Global.CentralValidation(VV.Form.getDropDownListText('Business State'), 'DDSelect') == false) {
        VV.Form.SetValidationErrorMessageOnField('Business State', 'Please make a selection from the Business State Dropdown.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Business State');
    }
}
//Business Street Address - Field that must be completed.
if (ControlName == 'Business Street Address' || RunAll || ControlName == 'next') {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business Street Address'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Business Street Address', 'Please complete the Business Street Address field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Business Street Address');
    }
}
//Business Zip Code - Business Zip Code is required, and must be entered in a valid Business Zip Code format. With auto-formatting.
var enteredValue = VV.Form.GetFieldValue('Business Zip Code');
var formattedVal = VV.Form.Global.FormatZipCode(enteredValue);

if (formattedVal != enteredValue) {
    VV.Form.SetFieldValue('Business Zip Code', formattedVal);
} else {
    if (ControlName == 'Business Zip Code' || RunAll || ControlName == 'next') {
        if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Business Zip Code'), 'Zip') == false) {
            VV.Form.SetValidationErrorMessageOnField('Business Zip Code', 'A Business Zip Code must be entered, and it must be in the format of XXXXX or XXXXX-XXXX.');
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField('Business Zip Code');
        }
    }
}
//Closure Type - Field that must be completed.
if (ControlName == 'CloseReasonDD') {
    if (VV.Form.Global.CentralValidation(VV.Form.getDropDownListText('CloseReasonDD'), 'DDSelect') == false) {
        VV.Form.SetValidationErrorMessageOnField('CloseReasonDD', 'Please make a selection from the Closure Type Dropdown.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('CloseReasonDD');
    }
}
//Facility City - Field that must be completed.
if (ControlName == 'Facility City' || RunAll || ControlName == 'next') {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Facility City'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Facility City', 'Please complete the Facility City field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Facility City');
    }
}
//Facility County - DropDown must be selected.
if (ControlName == 'Facility County' || RunAll || ControlName == 'next') {
    if (VV.Form.Global.CentralValidation(VV.Form.getDropDownListText('Facility County'), 'DDSelect') == false) {
        VV.Form.SetValidationErrorMessageOnField('Facility County', 'Please make a selection from the Facility County Dropdown.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Facility County');
    }
}
//Facility Name - Field that must be completed.
if (ControlName == 'Facility Name' || RunAll || ControlName == 'next') {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Facility Name'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Facility Name', 'Please complete the Facility Name field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Facility Name');
    }
}
//Facility Open Date - Date must be today or after today.
if (ControlName == 'Facility Open Date' || RunAll || ControlName == 'next') {
    if (VV.Form.Global.CentralDateValidation(VV.Form.GetFieldValue('Facility Open Date'), 'TodayorAfter') == false && VV.Form.GetFieldValue('Migration Renewal').toLowerCase() === 'false') {
        VV.Form.SetValidationErrorMessageOnField('Facility Open Date', 'Facility Open Date must be today or after today.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Facility Open Date');
    }
}
//Facility Reopen Date - Date must be today or after today.
if (ControlName == 'Facility Reopen Date') {
    if (VV.Form.Global.CentralDateValidation(VV.Form.GetFieldValue('Facility Reopen Date'), 'TodayorAfter') == false) {
        VV.Form.SetValidationErrorMessageOnField('Facility Reopen Date', 'Facility Reopen Date must be today or after today.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Facility Reopen Date');
    }
}
//Facility State - DropDown must be selected.
if (ControlName == 'Facility State' || RunAll || ControlName == 'next') {
    if (VV.Form.Global.CentralValidation(VV.Form.getDropDownListText('Facility State'), 'DDSelect') == false) {
        VV.Form.SetValidationErrorMessageOnField('Facility State', 'Please make a selection from the Facility State Dropdown.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Facility State');
    }
}
//Facility Street Address - Field that must be completed.
if (ControlName == 'Facility Street Address' || RunAll || ControlName == 'next') {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Facility Street Address'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('Facility Street Address', 'Please complete the Facility Street Address field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Facility Street Address');
    }
}
//Facility Zip Code - Facility Zip Code is required, and must be entered in a valid Facility Zip Code format. With auto-formatting.
var enteredValue = VV.Form.GetFieldValue('Facility Zip Code');
var formattedVal = VV.Form.Global.FormatZipCode(enteredValue);

if (formattedVal != enteredValue) {
    VV.Form.SetFieldValue('Facility Zip Code', formattedVal);
} else {
    if (ControlName == 'Facility Zip Code' || RunAll || ControlName == 'next') {
        if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Facility Zip Code'), 'Zip') == false) {
            VV.Form.SetValidationErrorMessageOnField('Facility Zip Code', 'A Facility Zip Code must be entered, and it must be in the format of XXXXX or XXXXX-XXXX.');
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField('Facility Zip Code');
        }
    }
}
//On Site Cell Phone - Phone Number is required, and must be entered in a valid phone number format. With auto-formatting.
var enteredValue = VV.Form.GetFieldValue('On Site Cell Phone');
var formattedVal = VV.Form.Global.FormatPhone(enteredValue);

if (formattedVal != enteredValue) {
    VV.Form.SetFieldValue('On Site Cell Phone', formattedVal);
} else {
    if (ControlName == 'On Site Cell Phone' || RunAll) {
        if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('On Site Work Phone'), 'Phone') == true) {
            if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('On Site Cell Phone'), 'Blank') == false) {
                VV.Form.ClearValidationErrorOnField('On Site Cell Phone');
            } else {
                if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('On Site Cell Phone'), 'Phone') == false) {
                    VV.Form.SetValidationErrorMessageOnField('On Site Cell Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                    VV.Form.SetValidationErrorMessageOnField('On Site Work Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                    ErrorReporting = false;
                } else {
                    VV.Form.ClearValidationErrorOnField('On Site Work Phone');
                    VV.Form.ClearValidationErrorOnField('On Site Cell Phone');
                }
            }
        } else {
            if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('On Site Cell Phone'), 'Phone') == false) {
                VV.Form.SetValidationErrorMessageOnField('On Site Work Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                VV.Form.SetValidationErrorMessageOnField('On Site Cell Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                ErrorReporting = false;
            } else {
                VV.Form.ClearValidationErrorOnField('On Site Work Phone');
                VV.Form.ClearValidationErrorOnField('On Site Cell Phone');
            }
        }
    }
}
//On Site Work Phone - Phone Number is required, and must be entered in a valid phone number format. With auto-formatting.
var enteredValue = VV.Form.GetFieldValue('On Site Work Phone');
var formattedVal = VV.Form.Global.FormatPhone(enteredValue);

if (formattedVal != enteredValue) {
    VV.Form.SetFieldValue('On Site Work Phone', formattedVal);
} else {
    if (ControlName == 'On Site Work Phone' || RunAll) {
        if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('On Site Cell Phone'), 'Phone') == true) {
            if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('On Site Work Phone'), 'Blank') == false) {
                VV.Form.ClearValidationErrorOnField('On Site Work Phone');
            } else {
                if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('On Site Work Phone'), 'Phone') == false) {
                    VV.Form.SetValidationErrorMessageOnField('On Site Work Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                    VV.Form.SetValidationErrorMessageOnField('On Site Cell Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                    ErrorReporting = false;
                } else {
                    VV.Form.ClearValidationErrorOnField('On Site Work Phone');
                    VV.Form.ClearValidationErrorOnField('On Site Cell Phone');
                }
            }
        } else {
            if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('On Site Work Phone'), 'Phone') == false) {
                VV.Form.SetValidationErrorMessageOnField('On Site Work Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                VV.Form.SetValidationErrorMessageOnField('On Site Cell Phone', 'One phone number must be entered and must be in the format of (XXX) XXX-XXXX.');
                ErrorReporting = false;
            } else {
                VV.Form.ClearValidationErrorOnField('On Site Work Phone');
                VV.Form.ClearValidationErrorOnField('On Site Cell Phone');
            }
        }
    }
}
//On Site Email - Email Address is required, but when entered, it must be in a valid email format.
if (ControlName == 'On Site Email' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('On Site Email').trim(), 'Blank') == true) {
        if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('On Site Email'), 'Email') == false) {
            VV.Form.SetValidationErrorMessageOnField('On Site Email', 'When an email address is entered, it must be in the form of a valid email address.');
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField('On Site Email');
        }
    } else {
        VV.Form.SetValidationErrorMessageOnField('On Site Email', 'When an email address is entered, it must be in the form of a valid email address.');
        ErrorReporting = false;
    }
}
//On Site First Name - Field that must be completed.
if (ControlName == 'On Site First Name' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('On Site First Name'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('On Site First Name', 'Please complete the On Site First Name field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('On Site First Name');
    }
}
//On Site Last Name - Field that must be completed.
if (ControlName == 'On Site Last Name' || RunAll) {
    if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('On Site Last Name'), 'Blank') == false) {
        VV.Form.SetValidationErrorMessageOnField('On Site Last Name', 'Please complete the On Site Last Name field.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('On Site Last Name');
    }
}
//Operational Permit Type - DropDown must be selected.
if (ControlName == 'Operational Permit Type' || RunAll || ControlName == 'next') {
    if (VV.Form.Global.CentralValidation(VV.Form.getDropDownListText('Operational Permit Type'), 'DDSelect') == false) {
        VV.Form.SetValidationErrorMessageOnField('Operational Permit Type', 'Please make a selection from the Operational Permit Type Dropdown.');
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField('Operational Permit Type');
    }
}
if (VV.Form.GetFieldValue('Migration Set Health Care Type').toLowerCase() === 'true') {
    //Health Care Type - DropDown must be selected.
    if (ControlName == 'Health Care Type' || ControlName == 'next') {
        if (VV.Form.Global.CentralValidation(VV.Form.getDropDownListText('Health Care Type'), 'DDSelect') == false) {
            VV.Form.SetValidationErrorMessageOnField('Health Care Type', 'Please make a selection from the Health Care Type dropdown.');
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField('Health Care Type');
        }
    }
    //Health Care Group - DropDown must be selected.
    if (ControlName == 'Health Care Group' || RunAll) {
        if (VV.Form.Global.CentralValidation(VV.Form.getDropDownListText('Health Care Group'), 'DDSelect') == false) {
            VV.Form.SetValidationErrorMessageOnField('Health Care Group', 'Please make a selection from the Health Care Group dropdown.');
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField('Health Care Group');
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField('Health Care Type');
    VV.Form.ClearValidationErrorOnField('Health Care Group');
}


return ErrorReporting;