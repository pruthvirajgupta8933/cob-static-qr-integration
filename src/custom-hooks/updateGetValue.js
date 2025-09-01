export function createUpdater(initialValue) {
    let value = initialValue;

    function updateValue(newValue) {
        value = newValue;
    }

    function getValue() {
        // console.log("value",value);
    }

    return {
        updateValue,
        getValue
    };
}

