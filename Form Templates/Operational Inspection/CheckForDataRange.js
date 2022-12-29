//CheckForDataRange

// Template function to check if the entered number of beds/rooms/spaces/maximum Occupancy is according to the range selected in the Drop Down Operational Permit Classification
// Returns true if the entered value meets the condition selected in the Drop Down.
//Parameters:
// -option: This variable represents the value in text format that is selected in the Drop Down Operational Permit Classification.
// -enteredNumber: This variable represents the entered numeric value related to the number of beds/rooms/spaces/maximum Occupancy

let returnVariable = true;

if (option === 'Select Item') {
    returnVariable = false;
} else {
    // Create an array with the value of the Drop Down Operational Permit Classification 
    let valueRange = option.split(" ");
    valueRange = valueRange.filter((elem) => {
        return !isNaN(elem) ? true : false;
    });

    // Check if the entered value meets the condition selected in the Drop Down
    if (valueRange.length === 1 && enteredNumber < parseInt(valueRange[0])) {
        returnVariable = false;
    } else if (valueRange.length === 2 && enteredNumber < parseInt(valueRange[0]) || enteredNumber > parseInt(valueRange[1])) {
        returnVariable = false;
    } else if (valueRange.length === 1 && parseInt(valueRange[0]) === 0 && enteredNumber != 0) {
        returnVariable = false;
    }
}
return returnVariable;
