// Form Validation for OpPerm Inspection as part of Test

/* FIELD NAME, VALIDATION TYPE, & EVENT

fieldName | validationType | event
Address Compliant | DropDown | Blur
Address Violation Details | Blank | Blur
Approved Booth | DropDown | Blur
Approved Mixing | DropDown | Blur
Approved Storage | DropDown | Blur
Auxiliary Heating Devices Compliant | DropDown | Blur
Auxiliary Heating Devices Violation Details | Blank | Blur
CO2 Helium Secured Compliant | DropDown | Blur
CO2 Helium Secured Violation Details | Blank | Blur
Child Care Category | DropDown | Blur
Child Care Restrictions | Blank | Blur
Child Care Type | DropDown | Blur
City | Blank | Blur
Consultation Inspection | DropDown | Blur
Consultation Inspection Summary | Blank | Blur
Electrical Items Compliant | DropDown | Blur
Electrical Items Violation Details | Blank | Blur
Electrical System Compliant | DropDown | Blur
Electrical System Violation Details | Blank | Blur
Emergency Lights Compliant | DropDown | Blur
Emergency Lights Violation Details | Blank | Blur
Exit Doors Compliant | DropDown | Blur
Exit Doors Violation Details | Blank | Blur
Exit Lights Compliant | DropDown | Blur
Exit Lights Violation Details | Blank | Blur
Extinguishing System | DropDown | Blur
Extinguishing System Compliant | DropDown | Blur
Extinguishing System Violation Details | Blank | Blur
Facility Name | Blank | Blur
Fire Alarm System Compliant | DropDown | Blur
Fire Alarm System Violation Details | Blank | Blur
Fire Dept Sprinkler Connection Compliant | DropDown | Blur
Fire Dept Sprinkler Connection Violation Details | Blank | Blur
Fire Doors Compliant | DropDown | Blur
Fire Doors Violation Details | Blank | Blur
Fire Extinguisher Compliant | DropDown | Blur
Fire Extinguisher Violation Details | Blank | Blur
Fire Sprinkler System Compliant | DropDown | Blur
Fire Sprinkler System Violation Details | Blank | Blur
Flammable Liquids | DropDown | Blur
From AM PM | DropDown | Blur
From Hours | DropDown | Blur
From Minutes | DropDown | Blur
Health Care Type | DropDown | Blur
Inspection Summary | Blank | Blur
Inspector | DropDown | Blur
Kitchen Hood Exhaust System Compliant | DropDown | Blur
Kitchen Hood Exhaust System Violation Details | Blank | Blur
Liquor License Class | DropDown | Blur
Liquor License Number | Blank | Blur
Liquor License Type | DropDown | Blur
Maximum Occupancy | Blank | Blur
Mechanical Rooms Compliant | DropDown | Blur
Mechanical Rooms Violation Details | Blank | Blur
Mixing | DropDown | Blur
New Permit Fee Adjustment | Number Only | Blur
Number of Beds | Blank | Blur
Number of Booths | Blank | Blur
Number of Rooms | Blank | Blur
Number of Spaces | Blank | Blur
OpPermCert Search | Blank | Blur
Operational Permit Classification | DropDown | Blur
Operational Permit Posted Compliant | DropDown | Blur
Operational Permit Posted Violation Details | Blank | Blur
Operational Permit Type | DropDown | Blur
Other 1 Compliant | DropDown | Blur
Other 1 Violation Details | Blank | Blur
Other 2 Compliant | DropDown | Blur
Other 2 Violation Details | Blank | Blur
Other 3 Compliant | DropDown | Blur
Other 3 Violation Details | Blank | Blur
Other 4 Compliant | DropDown | Blur
Other 4 Violation Details | Blank | Blur
Other 5 Compliant | DropDown | Blur
Other 5 Violation Details | Blank | Blur
Other 6 Compliant | DropDown | Blur
Other 6 Violation Details | Blank | Blur
RecordFound | DropDown | Blur
Referral Fee Description | Blank | Blur
Referral Inspection Fee | Number Only | Blur
Reinspection Date | Blank | Blur
Reinspection Fee | Number Only | Blur
Reinspection Required | DropDown | Blur
Revocation Reason | Blank | Blur
Standpipe System Compliant | DropDown | Blur
Standpipe System Violation Details | Blank | Blur
State | DropDown | Blur
State Referred Inspection | DropDown | Blur
State Referred Inspection Invoiced | Checkbox | Change
Storage Conditions Acceptable Compliant | DropDown | Blur
Storage Conditions Acceptable Violation Details | Blank | Blur
Storage Maintained Below Sprinkler Compliant | DropDown | Blur
Storage Maintained Below Sprinkler Violation Details | Blank | Blur
Street Address | Blank | Blur
To AM PM | DropDown | Blur
To Hours | DropDown | Blur
To Minutes | DropDown | Blur
Waive Fee Reason | Blank | Blur
Waive Reinspection Fee | DropDown | Blur
Zip Code | Zip | Blur

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
// ABOVE TAB
if (
    VV.Form.Global.CentralValidation(
        VV.Form.GetFieldValue("Operational Permit ID"),
        "Blank"
    ) == false
) {
    //City - Field that must be completed.
    if (ControlName == "City" || ControlName == "Facility") {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("City"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "City",
                "Please complete the City field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("City");
        }
    }
    //Facility Name - Field that must be completed.
    if (ControlName == "Facility Name" || ControlName == "Facility") {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Facility Name"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Facility Name",
                "Please complete the Facility Name field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Facility Name");
        }
    }
    //State - DropDown must be selected.
    if (ControlName == "State" || ControlName == "Facility") {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("State"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "State",
                "Please make a selection from the State dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("State");
        }
    }
    //Street Address - Field that must be completed.
    if (ControlName == "Street Address" || ControlName == "Facility") {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Street Address"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Street Address",
                "Please complete the Street Address field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Street Address");
        }
    }
    //Zip Code - Zip Code is required, and must be entered in a valid Zip Code format. With auto-formatting.
    var enteredValue = VV.Form.GetFieldValue("Zip Code");
    var formattedVal = VV.Form.Global.FormatZipCode(enteredValue);

    if (formattedVal != enteredValue) {
        VV.Form.SetFieldValue("Zip Code", formattedVal);
    } else {
        if (ControlName == "Zip Code" || ControlName == "Facility") {
            if (
                VV.Form.Global.CentralValidation(
                    VV.Form.GetFieldValue("Zip Code"),
                    "Zip"
                ) == false
            ) {
                VV.Form.SetValidationErrorMessageOnField(
                    "Zip Code",
                    "A zip code must be entered, and it must be in the format of XXXXX or XXXXX-XXXX."
                );
                ErrorReporting = false;
            } else {
                VV.Form.ClearValidationErrorOnField("Zip Code");
            }
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("City");
    VV.Form.ClearValidationErrorOnField("Facility Name");
    VV.Form.ClearValidationErrorOnField("State");
    VV.Form.ClearValidationErrorOnField("Street Address");
    VV.Form.ClearValidationErrorOnField("Zip Code");
}

//Inspector - DropDown must be selected.
if (ControlName == "Inspector") {
    if (
        VV.Form.Global.CentralValidation(
            VV.Form.getDropDownListText("Inspector"),
            "DDSelect"
        ) == false
    ) {
        VV.Form.SetValidationErrorMessageOnField(
            "Inspector",
            "Please make a selection from the Inspector dropdown."
        );
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField("Inspector");
    }
}
//Inspector - DropDown must be selected.
if (ControlName == "Inspector Required") {
    if (
        VV.Form.Global.CentralValidation(
            VV.Form.getDropDownListText("Inspector"),
            "DDSelect"
        ) == false
    ) {
        VV.Form.SetValidationErrorMessageOnField(
            "Inspector",
            "Please make a selection from the Inspector dropdown and click the Assign button to Assign an Inspector."
        );
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField("Inspector");
    }
}
//OpPermCert Search - Field that must be completed.
if (ControlName == "OpPermCert Search") {
    if (
        VV.Form.Global.CentralValidation(
            VV.Form.GetFieldValue("OpPermCert Search"),
            "Blank"
        ) == false
    ) {
        VV.Form.SetValidationErrorMessageOnField(
            "OpPermCert Search",
            "Please complete the Certificate Search field."
        );
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField("OpPermCert Search");
    }
}
//RecordFound - DropDown must be selected.
if (ControlName == "RecordFound") {
    if (
        VV.Form.Global.CentralValidation(
            VV.Form.getDropDownListText("RecordFound"),
            "DDSelect"
        ) == false
    ) {
        VV.Form.SetValidationErrorMessageOnField(
            "RecordFound",
            "Please make a selection from the Record Found dropdown."
        );
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField("RecordFound");
    }
}

// PERMIT DETAILS
//Operational Permit Type - DropDown must be selected.
if (ControlName == "Operational Permit Type" || RunAll) {
    if (
        VV.Form.Global.CentralValidation(
            VV.Form.getDropDownListText("Operational Permit Type"),
            "DDSelect"
        ) == false
    ) {
        VV.Form.SetValidationErrorMessageOnField(
            "Operational Permit Type",
            "Please make a selection from the Operational Permit Type dropdown."
        );
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField("Operational Permit Type");
    }
}

if (
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Places of Assembly" ||
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Childcare Facilities" ||
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Fraternities and Sororities" ||
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Hazardous Materials" ||
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Health Care Facilities (Residential & Non-Residential)" ||
    VV.Form.getDropDownListText("Operational Permit Type") === "Hospitals" ||
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Hotels and Motels" ||
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Mobile Home Court" ||
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Nursing Care Facilities" ||
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Nursing Care Facilities"
) {
    //Operational Permit Classification - DropDown must be selected.
    if (ControlName == "Operational Permit Classification" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Operational Permit Classification"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Operational Permit Classification",
                "Please make a selection from the Operational Permit Classification dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Operational Permit Classification");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Operational Permit Classification");
}

if (
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Places of Assembly" ||
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Childcare Facilities"
) {
    //Maximum Occupancy - Field that must be completed.
    if (ControlName == "Maximum Occupancy" || RunAll) {
        //The value of the Drop Down 'Operational Permit Classification' and the "Maximum Occupancy" field are taken to validate your entered data
        let OpPermClassification = VV.Form.getDropDownListText("Operational Permit Classification")
        let numOccupancy = VV.Form.GetFieldValue("Maximum Occupancy");
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Maximum Occupancy"), "Blank") == false ||
            VV.Form.Template.CheckForDataRange(OpPermClassification, numOccupancy) == false) {
            VV.Form.SetValidationErrorMessageOnField(
                "Maximum Occupancy",
                "Please complete the Maximum Occupancy field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Maximum Occupancy");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Maximum Occupancy");
}

if (
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Fraternities and Sororities" ||
    VV.Form.getDropDownListText("Operational Permit Type") === "Hotels and Motels"
) {
    //Number of Rooms - Field that must be completed.
    if (ControlName == "Number of Rooms" || RunAll) {
        //The value of the Drop Down 'Operational Permit Classification' and the "Number of Rooms" field are taken to validate your entered data
        let OpPermClassification = VV.Form.getDropDownListText("Operational Permit Classification")
        let numRooms = VV.Form.GetFieldValue("Number of Rooms");
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Number of Rooms"), "Blank") == false ||
            VV.Form.Template.CheckForDataRange(OpPermClassification, numRooms) == false) {
            VV.Form.SetValidationErrorMessageOnField(
                "Number of Rooms",
                "Please complete the Number of Rooms field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Number of Rooms");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Number of Rooms");
}

if (
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Health Care Facilities (Residential & Non-Residential)" ||
    VV.Form.getDropDownListText("Operational Permit Type") === "Hospitals" ||
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Nursing Care Facilities"
) {
    //Number of Beds - Field that must be completed.
    if (ControlName == "Number of Beds" || RunAll) {
        //The value of the Drop Down 'Operational Permit Classification' and the "Number of Beds" field are taken to validate your entered data
        let OpPermClassification = VV.Form.getDropDownListText("Operational Permit Classification")
        let numBeds = VV.Form.GetFieldValue("Number of Beds");

        if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue("Number of Beds"), "Blank") == false || VV.Form.Template.CheckForDataRange(OpPermClassification, numBeds) == false) {
            VV.Form.SetValidationErrorMessageOnField(
                "Number of Beds",
                "Please complete the Number of Beds field with a value between the range selected."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Number of Beds");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Number of Beds");
}

if (
    VV.Form.getDropDownListText("Operational Permit Type") === "Mobile Home Court"
) {
    //Number of Spaces - Field that must be completed.
    if (ControlName == "Number of Spaces" || RunAll) {
        //The value of the Drop Down 'Operational Permit Classification' and the "Number of Spaces" field are taken to validate your entered data
        let OpPermClassification = VV.Form.getDropDownListText("Operational Permit Classification")
        let numSpaces = VV.Form.GetFieldValue("Number of Spaces");

        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Number of Spaces"), "Blank") == false || VV.Form.Template.CheckForDataRange(OpPermClassification, numSpaces) == false) {
            VV.Form.SetValidationErrorMessageOnField(
                "Number of Spaces",
                "Please complete the Number of Spaces field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Number of Spaces");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Number of Spaces");
}

if (
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Health Care Facilities (Residential & Non-Residential)"
) {
    //Health Care Type - DropDown must be selected.
    if (ControlName == "Health Care Type" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Health Care Type"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Health Care Type",
                "Please make a selection from the Health Care Type dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Health Care Type");
        }
    }
    //Health Care Group - DropDown must be selected.
    if (ControlName == "Health Care Group" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Health Care Group"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Health Care Group",
                "Please make a selection from the Health Care Group dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Health Care Group");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Health Care Type");
    VV.Form.ClearValidationErrorOnField("Health Care Group");
}

// COMPLIANT DROP-DOWNS
if (VV.Form.getDropDownListText("Consultation Inspection") !== "Yes") {
    //Address Compliant - DropDown must be selected.
    if (ControlName == "Address Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Address Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Address Compliant",
                "Please make a selection from the Address Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Address Compliant");
        }
    }
    //Auxiliary Heating Devices Compliant - DropDown must be selected.
    if (ControlName == "Auxiliary Heating Devices Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Auxiliary Heating Devices Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Auxiliary Heating Devices Compliant",
                "Please make a selection from the Auxiliary Heating Devices Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Auxiliary Heating Devices Compliant"
            );
        }
    }
    //CO2 Helium Secured Compliant - DropDown must be selected.
    if (ControlName == "CO2 Helium Secured Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("CO2 Helium Secured Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "CO2 Helium Secured Compliant",
                "Please make a selection from the CO2 Helium Secured Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("CO2 Helium Secured Compliant");
        }
    }
    //Electrical Items Compliant - DropDown must be selected.
    if (ControlName == "Electrical Items Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Electrical Items Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Electrical Items Compliant",
                "Please make a selection from the Electrical Items Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Electrical Items Compliant");
        }
    }
    //Electrical System Compliant - DropDown must be selected.
    if (ControlName == "Electrical System Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Electrical System Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Electrical System Compliant",
                "Please make a selection from the Electrical System Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Electrical System Compliant");
        }
    }
    //Emergency Lights Compliant - DropDown must be selected.
    if (ControlName == "Emergency Lights Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Emergency Lights Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Emergency Lights Compliant",
                "Please make a selection from the Emergency Lights Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Emergency Lights Compliant");
        }
    }
    //Exit Doors Compliant - DropDown must be selected.
    if (ControlName == "Exit Doors Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Exit Doors Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Exit Doors Compliant",
                "Please make a selection from the Exit Doors Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Exit Doors Compliant");
        }
    }
    //Exit Lights Compliant - DropDown must be selected.
    if (ControlName == "Exit Lights Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Exit Lights Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Exit Lights Compliant",
                "Please make a selection from the Exit Lights Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Exit Lights Compliant");
        }
    }
    //Extinguishing System Compliant - DropDown must be selected.
    if (ControlName == "Extinguishing System Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Extinguishing System Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Extinguishing System Compliant",
                "Please make a selection from the Extinguishing System Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Extinguishing System Compliant");
        }
    }
    //Fire Alarm System Compliant - DropDown must be selected.
    if (ControlName == "Fire Alarm System Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Fire Alarm System Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Fire Alarm System Compliant",
                "Please make a selection from the Fire Alarm System Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Fire Alarm System Compliant");
        }
    }
    //Fire Dept Sprinkler Connection Compliant - DropDown must be selected.
    if (ControlName == "Fire Dept Sprinkler Connection Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Fire Dept Sprinkler Connection Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Fire Dept Sprinkler Connection Compliant",
                "Please make a selection from the Fire Dept Sprinkler Connection Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Fire Dept Sprinkler Connection Compliant"
            );
        }
    }
    //Fire Doors Compliant - DropDown must be selected.
    if (ControlName == "Fire Doors Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Fire Doors Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Fire Doors Compliant",
                "Please make a selection from the Fire Doors Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Fire Doors Compliant");
        }
    }
    //Fire Extinguisher Compliant - DropDown must be selected.
    if (ControlName == "Fire Extinguisher Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Fire Extinguisher Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Fire Extinguisher Compliant",
                "Please make a selection from the Fire Extinguisher Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Fire Extinguisher Compliant");
        }
    }
    //Fire Sprinkler System Compliant - DropDown must be selected.
    if (ControlName == "Fire Sprinkler System Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Fire Sprinkler System Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Fire Sprinkler System Compliant",
                "Please make a selection from the Fire Sprinkler System Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Fire Sprinkler System Compliant");
        }
    }
    //Kitchen Hood Exhaust System Compliant - DropDown must be selected.
    if (ControlName == "Kitchen Hood Exhaust System Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Kitchen Hood Exhaust System Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Kitchen Hood Exhaust System Compliant",
                "Please make a selection from the Kitchen Hood Exhaust System Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Kitchen Hood Exhaust System Compliant"
            );
        }
    }
    //Mechanical Rooms Compliant - DropDown must be selected.
    if (ControlName == "Mechanical Rooms Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Mechanical Rooms Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Mechanical Rooms Compliant",
                "Please make a selection from the Mechanical Rooms Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Mechanical Rooms Compliant");
        }
    }
    //Operational Permit Posted Compliant - DropDown must be selected.
    if (ControlName == "Operational Permit Posted Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Operational Permit Posted Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Operational Permit Posted Compliant",
                "Please make a selection from the Operational Permit Posted Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Operational Permit Posted Compliant"
            );
        }
    }
    //Standpipe System Compliant - DropDown must be selected.
    if (ControlName == "Standpipe System Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Standpipe System Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Standpipe System Compliant",
                "Please make a selection from the Standpipe System Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Standpipe System Compliant");
        }
    }
    //Storage Conditions Acceptable Compliant - DropDown must be selected.
    if (ControlName == "Storage Conditions Acceptable Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Storage Conditions Acceptable Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Storage Conditions Acceptable Compliant",
                "Please make a selection from the Storage Conditions Acceptable Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Storage Conditions Acceptable Compliant"
            );
        }
    }
    //Storage Maintained Below Sprinkler Compliant - DropDown must be selected.
    if (ControlName == "Storage Maintained Below Sprinkler Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText(
                    "Storage Maintained Below Sprinkler Compliant"
                ),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Storage Maintained Below Sprinkler Compliant",
                "Please make a selection from the Storage Maintained Below Sprinkler Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Storage Maintained Below Sprinkler Compliant"
            );
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Address Compliant");
    VV.Form.ClearValidationErrorOnField("Auxiliary Heating Devices Compliant");
    VV.Form.ClearValidationErrorOnField("CO2 Helium Secured Compliant");
    VV.Form.ClearValidationErrorOnField("Electrical Items Compliant");
    VV.Form.ClearValidationErrorOnField("Electrical System Compliant");
    VV.Form.ClearValidationErrorOnField("Emergency Lights Compliant");
    VV.Form.ClearValidationErrorOnField("Exit Doors Compliant");
    VV.Form.ClearValidationErrorOnField("Exit Lights Compliant");
    VV.Form.ClearValidationErrorOnField("Extinguishing System Compliant");
    VV.Form.ClearValidationErrorOnField("Fire Alarm System Compliant");
    VV.Form.ClearValidationErrorOnField(
        "Fire Dept Sprinkler Connection Compliant"
    );
    VV.Form.ClearValidationErrorOnField("Fire Doors Compliant");
    VV.Form.ClearValidationErrorOnField("Fire Extinguisher Compliant");
    VV.Form.ClearValidationErrorOnField("Fire Sprinkler System Compliant");
    VV.Form.ClearValidationErrorOnField("Kitchen Hood Exhaust System Compliant");
    VV.Form.ClearValidationErrorOnField("Mechanical Rooms Compliant");
    VV.Form.ClearValidationErrorOnField("Operational Permit Posted Compliant");
    VV.Form.ClearValidationErrorOnField("Standpipe System Compliant");
    VV.Form.ClearValidationErrorOnField(
        "Storage Conditions Acceptable Compliant"
    );
    VV.Form.ClearValidationErrorOnField(
        "Storage Maintained Below Sprinkler Compliant"
    );
}

// OTHER COMPLIANT DROP- DOWNS
if (
    VV.Form.Global.CentralValidation(
        VV.Form.GetFieldValue("Other 1 Violation Details"),
        "Blank"
    ) == true
) {
    //Other 1 Compliant - DropDown must be selected.
    if (ControlName == "Other 1 Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Other 1 Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Other 1 Compliant",
                "Please make a selection from the Other 1 Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Other 1 Compliant");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Other 1 Compliant");
}

if (
    VV.Form.Global.CentralValidation(
        VV.Form.GetFieldValue("Other 2 Violation Details"),
        "Blank"
    ) == true
) {
    //Other 2 Compliant - DropDown must be selected.
    if (ControlName == "Other 2 Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Other 2 Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Other 2 Compliant",
                "Please make a selection from the Other 2 Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Other 2 Compliant");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Other 2 Compliant");
}

if (
    VV.Form.Global.CentralValidation(
        VV.Form.GetFieldValue("Other 3 Violation Details"),
        "Blank"
    ) == true
) {
    //Other 3 Compliant - DropDown must be selected.
    if (ControlName == "Other 3 Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Other 3 Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Other 3 Compliant",
                "Please make a selection from the Other 3 Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Other 3 Compliant");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Other 3 Compliant");
}

if (
    VV.Form.Global.CentralValidation(
        VV.Form.GetFieldValue("Other 4 Violation Details"),
        "Blank"
    ) == true
) {
    //Other 4 Compliant - DropDown must be selected.
    if (ControlName == "Other 4 Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Other 4 Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Other 4 Compliant",
                "Please make a selection from the Other 4 Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Other 4 Compliant");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Other 4 Compliant");
}

if (
    VV.Form.Global.CentralValidation(
        VV.Form.GetFieldValue("Other 5 Violation Details"),
        "Blank"
    ) == true
) {
    //Other 5 Compliant - DropDown must be selected.
    if (ControlName == "Other 5 Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Other 5 Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Other 5 Compliant",
                "Please make a selection from the Other 5 Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Other 5 Compliant");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Other 5 Compliant");
}

if (
    VV.Form.Global.CentralValidation(
        VV.Form.GetFieldValue("Other 6 Violation Details"),
        "Blank"
    ) == true
) {
    //Other 6 Compliant - DropDown must be selected.
    if (ControlName == "Other 6 Compliant" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Other 6 Compliant"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Other 6 Compliant",
                "Please make a selection from the Other 6 Compliant dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Other 6 Compliant");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Other 6 Compliant");
}

// VIOLATION DETAILS
if (VV.Form.getDropDownListText("Address Compliant") === "No") {
    //Address Violation Details - Field that must be completed.
    if (ControlName == "Address Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Address Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Address Violation Details",
                "Please complete the Address Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Address Violation Details");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Address Violation Details");
}

if (
    VV.Form.getDropDownListText("Auxiliary Heating Devices Compliant") === "No"
) {
    //Auxiliary Heating Devices Violation Details - Field that must be completed.
    if (ControlName == "Auxiliary Heating Devices Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Auxiliary Heating Devices Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Auxiliary Heating Devices Violation Details",
                "Please complete the Auxiliary Heating Devices Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Auxiliary Heating Devices Violation Details"
            );
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField(
        "Auxiliary Heating Devices Violation Details"
    );
}

if (VV.Form.getDropDownListText("CO2 Helium Secured Compliant") === "No") {
    //CO2 Helium Secured Violation Details - Field that must be completed.
    if (ControlName == "CO2 Helium Secured Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("CO2 Helium Secured Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "CO2 Helium Secured Violation Details",
                "Please complete the CO2 Helium Secured Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "CO2 Helium Secured Violation Details"
            );
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("CO2 Helium Secured Violation Details");
}

if (VV.Form.getDropDownListText("Electrical Items Compliant") === "No") {
    //Electrical Items Violation Details - Field that must be completed.
    if (ControlName == "Electrical Items Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Electrical Items Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Electrical Items Violation Details",
                "Please complete the Electrical Items Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Electrical Items Violation Details");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Electrical Items Violation Details");
}

if (VV.Form.getDropDownListText("Electrical System Compliant") === "No") {
    //Electrical System Violation Details - Field that must be completed.
    if (ControlName == "Electrical System Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Electrical System Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Electrical System Violation Details",
                "Please complete the Electrical System Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Electrical System Violation Details"
            );
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Electrical System Violation Details");
}

if (VV.Form.getDropDownListText("Emergency Lights Compliant") === "No") {
    //Emergency Lights Violation Details - Field that must be completed.
    if (ControlName == "Emergency Lights Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Emergency Lights Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Emergency Lights Violation Details",
                "Please complete the Emergency Lights Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Emergency Lights Violation Details");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Emergency Lights Violation Details");
}

if (VV.Form.getDropDownListText("Exit Doors Compliant") === "No") {
    //Exit Doors Violation Details - Field that must be completed.
    if (ControlName == "Exit Doors Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Exit Doors Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Exit Doors Violation Details",
                "Please complete the Exit Doors Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Exit Doors Violation Details");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Exit Doors Violation Details");
}

if (VV.Form.getDropDownListText("Exit Lights Compliant") === "No") {
    //Exit Lights Violation Details - Field that must be completed.
    if (ControlName == "Exit Lights Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Exit Lights Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Exit Lights Violation Details",
                "Please complete the Exit Lights Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Exit Lights Violation Details");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Exit Lights Violation Details");
}

if (VV.Form.getDropDownListText("Extinguishing System Compliant") === "No") {
    //Extinguishing System Violation Details - Field that must be completed.
    if (ControlName == "Extinguishing System Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Extinguishing System Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Extinguishing System Violation Details",
                "Please complete the Extinguishing System Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Extinguishing System Violation Details"
            );
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Extinguishing System Violation Details");
}

if (VV.Form.getDropDownListText("Fire Alarm System Compliant") === "No") {
    //Fire Alarm System Violation Details - Field that must be completed.
    if (ControlName == "Fire Alarm System Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Fire Alarm System Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Fire Alarm System Violation Details",
                "Please complete the Fire Alarm System Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Fire Alarm System Violation Details"
            );
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Fire Alarm System Violation Details");
}

if (
    VV.Form.getDropDownListText("Fire Dept Sprinkler Connection Compliant") ===
    "No"
) {
    //Fire Dept Sprinkler Connection Violation Details - Field that must be completed.
    if (
        ControlName == "Fire Dept Sprinkler Connection Violation Details" ||
        RunAll
    ) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue(
                    "Fire Dept Sprinkler Connection Violation Details"
                ),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Fire Dept Sprinkler Connection Violation Details",
                "Please complete the Fire Dept Sprinkler Connection Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Fire Dept Sprinkler Connection Violation Details"
            );
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField(
        "Fire Dept Sprinkler Connection Violation Details"
    );
}

if (VV.Form.getDropDownListText("Fire Doors Compliant") === "No") {
    //Fire Doors Violation Details - Field that must be completed.
    if (ControlName == "Fire Doors Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Fire Doors Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Fire Doors Violation Details",
                "Please complete the Fire Doors Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Fire Doors Violation Details");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Fire Doors Violation Details");
}

if (VV.Form.getDropDownListText("Fire Extinguisher Compliant") === "No") {
    //Fire Extinguisher Violation Details - Field that must be completed.
    if (ControlName == "Fire Extinguisher Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Fire Extinguisher Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Fire Extinguisher Violation Details",
                "Please complete the Fire Extinguisher Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Fire Extinguisher Violation Details"
            );
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Fire Extinguisher Violation Details");
}

if (VV.Form.getDropDownListText("Fire Sprinkler System Compliant") === "No") {
    //Fire Sprinkler System Violation Details - Field that must be completed.
    if (ControlName == "Fire Sprinkler System Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Fire Sprinkler System Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Fire Sprinkler System Violation Details",
                "Please complete the Fire Sprinkler System Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Fire Sprinkler System Violation Details"
            );
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField(
        "Fire Sprinkler System Violation Details"
    );
}

if (
    VV.Form.getDropDownListText("Kitchen Hood Exhaust System Compliant") === "No"
) {
    //Kitchen Hood Exhaust System Violation Details - Field that must be completed.
    if (
        ControlName == "Kitchen Hood Exhaust System Violation Details" ||
        RunAll
    ) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Kitchen Hood Exhaust System Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Kitchen Hood Exhaust System Violation Details",
                "Please complete the Kitchen Hood Exhaust System Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Kitchen Hood Exhaust System Violation Details"
            );
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField(
        "Kitchen Hood Exhaust System Violation Details"
    );
}

if (VV.Form.getDropDownListText("Mechanical Rooms Compliant") === "No") {
    //Mechanical Rooms Violation Details - Field that must be completed.
    if (ControlName == "Mechanical Rooms Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Mechanical Rooms Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Mechanical Rooms Violation Details",
                "Please complete the Mechanical Rooms Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Mechanical Rooms Violation Details");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Mechanical Rooms Violation Details");
}

if (
    VV.Form.getDropDownListText("Operational Permit Posted Compliant") === "No"
) {
    //Operational Permit Posted Violation Details - Field that must be completed.
    if (ControlName == "Operational Permit Posted Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Operational Permit Posted Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Operational Permit Posted Violation Details",
                "Please complete the Operational Permit Posted Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Operational Permit Posted Violation Details"
            );
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField(
        "Operational Permit Posted Violation Details"
    );
}

if (VV.Form.getDropDownListText("Standpipe System Compliant") === "No") {
    //Standpipe System Violation Details - Field that must be completed.
    if (ControlName == "Standpipe System Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Standpipe System Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Standpipe System Violation Details",
                "Please complete the Standpipe System Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Standpipe System Violation Details");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Standpipe System Violation Details");
}

if (
    VV.Form.getDropDownListText("Storage Conditions Acceptable Compliant") ===
    "No"
) {
    //Storage Conditions Acceptable Violation Details - Field that must be completed.
    if (
        ControlName == "Storage Conditions Acceptable Violation Details" ||
        RunAll
    ) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue(
                    "Storage Conditions Acceptable Violation Details"
                ),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Storage Conditions Acceptable Violation Details",
                "Please complete the Storage Conditions Acceptable Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Storage Conditions Acceptable Violation Details"
            );
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField(
        "Storage Conditions Acceptable Violation Details"
    );
}

if (
    VV.Form.getDropDownListText(
        "Storage Maintained Below Sprinkler Compliant"
    ) === "No"
) {
    //Storage Maintained Below Sprinkler Violation Details - Field that must be completed.
    if (
        ControlName == "Storage Maintained Below Sprinkler Violation Details" ||
        RunAll
    ) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue(
                    "Storage Maintained Below Sprinkler Violation Details"
                ),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Storage Maintained Below Sprinkler Violation Details",
                "Please complete the Storage Maintained Below Sprinkler Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField(
                "Storage Maintained Below Sprinkler Violation Details"
            );
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField(
        "Storage Maintained Below Sprinkler Violation Details"
    );
}

// OTHER VIOLATION DETAILS

if (VV.Form.getDropDownListText("Other 1 Compliant") === "No") {
    //Other 1 Violation Details - Field that must be completed.
    if (ControlName == "Other 1 Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Other 1 Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Other 1 Violation Details",
                "Please complete the Other 1 Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Other 1 Violation Details");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Other 1 Violation Details");
}

if (VV.Form.getDropDownListText("Other 2 Compliant") === "No") {
    //Other 2 Violation Details - Field that must be completed.
    if (ControlName == "Other 2 Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Other 2 Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Other 2 Violation Details",
                "Please complete the Other 2 Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Other 2 Violation Details");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Other 2 Violation Details");
}

if (VV.Form.getDropDownListText("Other 3 Compliant") === "No") {
    //Other 3 Violation Details - Field that must be completed.
    if (ControlName == "Other 3 Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Other 3 Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Other 3 Violation Details",
                "Please complete the Other 3 Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Other 3 Violation Details");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Other 3 Violation Details");
}

if (VV.Form.getDropDownListText("Other 4 Compliant") === "No") {
    //Other 4 Violation Details - Field that must be completed.
    if (ControlName == "Other 4 Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Other 4 Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Other 4 Violation Details",
                "Please complete the Other 4 Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Other 4 Violation Details");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Other 4 Violation Details");
}

if (VV.Form.getDropDownListText("Other 5 Compliant") === "No") {
    //Other 5 Violation Details - Field that must be completed.
    if (ControlName == "Other 5 Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Other 5 Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Other 5 Violation Details",
                "Please complete the Other 5 Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Other 5 Violation Details");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Other 5 Violation Details");
}

if (VV.Form.getDropDownListText("Other 6 Compliant") === "No") {
    //Other 6 Violation Details - Field that must be completed.
    if (ControlName == "Other 6 Violation Details" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Other 6 Violation Details"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Other 6 Violation Details",
                "Please complete the Other 6 Violation Details field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Other 6 Violation Details");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Other 6 Violation Details");
}

// LIQUOR INFORMATION
// //Liquor License Number - Field that must be completed.
// if (ControlName == 'Liquor License Number' || RunAll) {
//   if (VV.Form.Global.CentralValidation(VV.Form.GetFieldValue('Liquor License Number'), 'Blank') == false) {
//     VV.Form.SetValidationErrorMessageOnField('Liquor License Number', 'Please complete the Liquor License Number field.');
//     ErrorReporting = false;
//   } else {
//     VV.Form.ClearValidationErrorOnField('Liquor License Number');
//   }
// }
//Liquor License Class - DropDown must be selected.

if (
    VV.Form.Global.CentralValidation(
        VV.Form.GetFieldValue("Liquor License Number"),
        "Blank"
    ) == true
) {
    if (ControlName == "Liquor License Class" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Liquor License Class"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Liquor License Class",
                "Please make a selection from the Liquor License Class dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Liquor License Class");
        }
    }
    //Liquor License Type - DropDown must be selected.
    if (ControlName == "Liquor License Type" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Liquor License Type"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Liquor License Type",
                "Please make a selection from the Liquor License Type dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Liquor License Type");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Liquor License Class");
    VV.Form.ClearValidationErrorOnField("Liquor License Type");
}

// SPRAYING or DIPPING
if (
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Spraying or Dipping"
) {
    //Number of Booths - Field that must be completed.
    if (ControlName == "Number of Booths" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Number of Booths"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Number of Booths",
                "Please complete the Number of Booths field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Number of Booths");
        }
    }
    //Approved Booth - DropDown must be selected.
    if (ControlName == "Approved Booth" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Approved Booth"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Approved Booth",
                "Please make a selection from the Approved Booth dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Approved Booth");
        }
    }
    //Approved Mixing - DropDown must be selected.
    if (ControlName == "Approved Mixing" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Approved Mixing"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Approved Mixing",
                "Please make a selection from the Approved Mixing dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Approved Mixing");
        }
    }
    //Approved Storage - DropDown must be selected.
    if (ControlName == "Approved Storage" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Approved Storage"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Approved Storage",
                "Please make a selection from the Approved Storage dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Approved Storage");
        }
    }
    //Extinguishing System - DropDown must be selected.
    if (ControlName == "Extinguishing System" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Extinguishing System"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Extinguishing System",
                "Please make a selection from the Extinguishing System dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Extinguishing System");
        }
    }
    //Flammable Liquids - DropDown must be selected.
    if (ControlName == "Flammable Liquids" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Flammable Liquids"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Flammable Liquids",
                "Please make a selection from the Flammable Liquids dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Flammable Liquids");
        }
    }
    //Mixing - DropDown must be selected.
    if (ControlName == "Mixing" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Mixing"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Mixing",
                "Please make a selection from the Mixing dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Mixing");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Number of Booths");
    VV.Form.ClearValidationErrorOnField("Approved Booth");
    VV.Form.ClearValidationErrorOnField("Approved Mixing");
    VV.Form.ClearValidationErrorOnField("Approved Storage");
    VV.Form.ClearValidationErrorOnField("Extinguishing System");
    VV.Form.ClearValidationErrorOnField("Flammable Liquids");
    VV.Form.ClearValidationErrorOnField("Mixing");
}

// CHILD CARE

if (
    VV.Form.getDropDownListText("Operational Permit Type") ===
    "Childcare Facilities"
) {
    //Child Care Category - DropDown must be selected.
    if (ControlName == "Child Care Category" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Child Care Category"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Child Care Category",
                "Please make a selection from the Child Care Category dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Child Care Category");
        }
    }
    //Child Care Type - DropDown must be selected.
    if (ControlName == "Child Care Type" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Child Care Type"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Child Care Type",
                "Please make a selection from the Child Care Type dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Child Care Type");
        }
    }
    //Child Care Restrictions - Field that must be completed.
    if (ControlName == "Child Care Restrictions" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Child Care Restrictions"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Child Care Restrictions",
                "Please complete the Child Care Restrictions field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Child Care Restrictions");
        }
    }
    //From AM PM - DropDown must be selected.
    if (ControlName == "From AM PM" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("From AM PM"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "From AM PM",
                "Please make a selection from the From AM PM dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("From AM PM");
        }
    }
    //From Hours - DropDown must be selected.
    if (ControlName == "From Hours" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("From Hours"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "From Hours",
                "Please make a selection from the From Hours dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("From Hours");
        }
    }
    //From Minutes - DropDown must be selected.
    if (ControlName == "From Minutes" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("From Minutes"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "From Minutes",
                "Please make a selection from the From Minutes dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("From Minutes");
        }
    }
    //To AM PM - DropDown must be selected.
    if (ControlName == "To AM PM" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("To AM PM"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "To AM PM",
                "Please make a selection from the To AM PM dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("To AM PM");
        }
    }
    //To Hours - DropDown must be selected.
    if (ControlName == "To Hours" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("To Hours"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "To Hours",
                "Please make a selection from the To Hours dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("To Hours");
        }
    }
    //To Minutes - DropDown must be selected.
    if (ControlName == "To Minutes" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("To Minutes"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "To Minutes",
                "Please make a selection from the To Minutes dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("To Minutes");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Child Care Category");
    VV.Form.ClearValidationErrorOnField("Child Care Type");
    VV.Form.ClearValidationErrorOnField("Child Care Restrictions");
    VV.Form.ClearValidationErrorOnField("From AM PM");
    VV.Form.ClearValidationErrorOnField("From Hours");
    VV.Form.ClearValidationErrorOnField("From Minutes");
    VV.Form.ClearValidationErrorOnField("To AM PM");
    VV.Form.ClearValidationErrorOnField("To Hours");
    VV.Form.ClearValidationErrorOnField("To Minutes");
}

// INSPECTION SUMMARY
if (VV.Form.getDropDownListText("Consultation Inspection") !== "Yes") {
    //Inspection Summary - Field that must be completed.
    if (ControlName == "Inspection Summary" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Inspection Summary"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Inspection Summary",
                "Please complete the Inspection Summary field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Inspection Summary");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Inspection Summary");
}

// CONSULTATION
if (VV.Form.getDropDownListText("Inspection Type") === "Referral") {
    //Consultation Inspection - DropDown must be selected.
    if (ControlName == "Consultation Inspection" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Consultation Inspection"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Consultation Inspection",
                "Please make a selection from the Consultation Inspection dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Consultation Inspection");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Consultation Inspection");
}

if (VV.Form.getDropDownListText("Consultation Inspection") === "Yes") {
    //Consultation Inspection Summary - Field that must be completed.
    if (ControlName == "Consultation Inspection Summary" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Consultation Inspection Summary"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Consultation Inspection Summary",
                "Please complete the Consultation Inspection Summary field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Consultation Inspection Summary");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Consultation Inspection Summary");
}

// ADMIN TAB
//New Permit Fee Adjustment - Must be a whole number.
if (ControlName == "New Permit Fee Adjustment" || RunAll) {
    if (
        VV.Form.Global.CentralValidation(
            VV.Form.GetFieldValue("New Permit Fee Adjustment"),
            "NumberOnly"
        ) == false
    ) {
        VV.Form.SetValidationErrorMessageOnField(
            "New Permit Fee Adjustment",
            "A whole number must be entered for New Permit Fee Adjustment."
        );
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField("New Permit Fee Adjustment");
    }
}

if (
    VV.Form.Global.CentralValidation(
        VV.Form.GetFieldValue("Referral Inspection Fee"),
        "NumberOnly"
    ) == true &&
    parseInt(VV.Form.GetFieldValue("Referral Inspection Fee"), 10) > 0
) {
    //Referral Fee Description - Field that must be completed.
    if (ControlName == "Referral Fee Description" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Referral Fee Description"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Referral Fee Description",
                "Please complete the Referral Fee Description field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Referral Fee Description");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Referral Fee Description");
}

//Referral Inspection Fee - Must be a whole number.
if (ControlName == "Referral Inspection Fee" || RunAll) {
    if (
        VV.Form.Global.CentralValidation(
            VV.Form.GetFieldValue("Referral Inspection Fee"),
            "NumberOnly"
        ) == false
    ) {
        VV.Form.SetValidationErrorMessageOnField(
            "Referral Inspection Fee",
            "A whole number must be entered for Referral Inspection Fee."
        );
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField("Referral Inspection Fee");
    }
}

if (VV.Form.getDropDownListText("Reinspection Required") === "Yes") {
    //Reinspection Date - Date must be today or after today.
    if (ControlName == "Reinspection Date" || RunAll) {
        if (
            VV.Form.Global.CentralDateValidation(
                VV.Form.GetFieldValue("Reinspection Date"),
                "TodayorAfter"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Reinspection Date",
                "Reinspection Date must be today or after today."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Reinspection Date");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Reinspection Date");
}

if (
    VV.Form.getDropDownListText("Reinspection Required") === "Yes" &&
    parseInt(VV.Form.GetFieldValue("Visit Number"), 10) > 0
) {
    //Reinspection Fee - Must be a whole number greater than 0.
    if (ControlName == "Reinspection Fee" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Reinspection Fee"),
                "NumberOnly"
            ) == false ||
            VV.Form.Global.CentralNumericValidation(
                VV.Form.GetFieldValue("Reinspection Fee"),
                "0",
                "LessThanEqualTo"
            ) == true
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Reinspection Fee",
                "A whole number greater than 0 must be entered for Reinspection Fee."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Reinspection Fee");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Reinspection Fee");
}

if (parseInt(VV.Form.GetFieldValue("Reinspection Fee"), 10) > 0) {
    //Reinspection Fee Description - Field that must be completed.
    if (ControlName == "Reinspection Fee Description" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Reinspection Fee Description"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Reinspection Fee Description",
                "Please complete the Reinspection Fee Description field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Reinspection Fee Description");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Reinspection Fee Description");
}

//Reinspection Required - DropDown must be selected.
if (ControlName == "Reinspection Required" || RunAll) {
    if (
        VV.Form.Global.CentralValidation(
            VV.Form.getDropDownListText("Reinspection Required"),
            "DDSelect"
        ) == false
    ) {
        VV.Form.SetValidationErrorMessageOnField(
            "Reinspection Required",
            "Please make a selection from the Reinspection Required dropdown."
        );
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField("Reinspection Required");
    }
}
//Revocation Reason - Field that must be completed.
if (ControlName == "Revocation Reason") {
    if (
        VV.Form.Global.CentralValidation(
            VV.Form.GetFieldValue("Revocation Reason"),
            "Blank"
        ) == false
    ) {
        VV.Form.SetValidationErrorMessageOnField(
            "Revocation Reason",
            "Please complete the Revocation Reason field."
        );
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField("Revocation Reason");
    }
}
if (VV.Form.getDropDownListText("Inspection Type") === "Referral") {
    //State Referred Inspection - DropDown must be selected.
    if (ControlName == "State Referred Inspection" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("State Referred Inspection"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "State Referred Inspection",
                "Please make a selection from the State Referred Inspection dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("State Referred Inspection");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("State Referred Inspection");
}

if (VV.Form.getDropDownListText("Waive Reinspection Fee") === "Yes") {
    //Waive Fee Reason - Field that must be completed.
    if (ControlName == "Waive Fee Reason") {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.GetFieldValue("Waive Fee Reason"),
                "Blank"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Waive Fee Reason",
                "Please complete the Waive Fee Reason field."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Waive Fee Reason");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Waive Fee Reason");
}

if (parseInt(VV.Form.GetFieldValue("Reinspection Fee"), 10) > 0) {
    //Waive Reinspection Fee - DropDown must be selected.
    if (ControlName == "Waive Reinspection Fee" || RunAll) {
        if (
            VV.Form.Global.CentralValidation(
                VV.Form.getDropDownListText("Waive Reinspection Fee"),
                "DDSelect"
            ) == false
        ) {
            VV.Form.SetValidationErrorMessageOnField(
                "Waive Reinspection Fee",
                "Please make a selection from the Waive Reinspection Fee dropdown."
            );
            ErrorReporting = false;
        } else {
            VV.Form.ClearValidationErrorOnField("Waive Reinspection Fee");
        }
    }
} else {
    VV.Form.ClearValidationErrorOnField("Waive Reinspection Fee");
}

//Email Inspection - Email Address is required, and must be entered in a valid email format.
if (ControlName == "Email Inspection") {
    if (
        VV.Form.Global.CentralValidation(
            VV.Form.GetFieldValue("Email Inspection"),
            "Email"
        ) == false
    ) {
        VV.Form.SetValidationErrorMessageOnField(
            "Email Inspection",
            "An email address must be entered, and it must be in the form of a valid email address."
        );
        ErrorReporting = false;
    } else {
        VV.Form.ClearValidationErrorOnField("Email Inspection");
    }
}

return ErrorReporting;