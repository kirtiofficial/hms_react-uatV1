
export const field = {
    fieldValue: '',
    isValidField: true,
    errorField: ""

};
export const Datefield = {
    fieldValue: new Date(),
    isValidField: true,
    errorField: ""

};

export const anythingExceptOnlySpace = (name, val) => {
    if (val.trim().length > 0) {
        return {
            fieldValue: val,
            isValidField: true,
            errorField: ''
        };
    } else {
        return {
            fieldValue: val,
            isValidField: false,
            errorField: `${name} is required`
        };
    }
}

export const GSTValue = (name, val) => {
    let regexval = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/
    if (val.trim().length !== 0) {
        if (regexval.test(val.trim())) {
            return {
                fieldValue: val,
                isValidField: true,
                errorField: ''
            };
        } else {
            return {
                fieldValue: val,
                isValidField: false,
                errorField: `Invalid ${name}`
            };
        }
    } else {
        return {
            fieldValue: val,
            isValidField: false,
            errorField: `${name} is required`
        };
    }
}

//validation only allow alphabates, required field and apply regex according to field name
export const onlyAlphabets = (name, val) => {
    let regexval = /^[a-zA-Z ]+$/;
    //let  regexval = /^(?!\d+$)(?:[a-zA-Z][a-zA-Z @&$]*)?$/
    if (String(name).toLowerCase() === "PromoCode Name".toLowerCase()) {
        regexval = /^[a-zA-Z ]+$/;
    }
    else if (String(name).toLowerCase() === "Email Address".toLowerCase()) {
        //console.log("inside email")
        regexval = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
    }
    else if (String(name).toLowerCase() === "Expiry Date") {
        regexval = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
        // regexval = /^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/
    }
    else if (String(name).toLowerCase() === "Clinic Address".toLowerCase()) {
        regexval = /^(?!\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 @&$]*)?$/
    }
    else if (String(name).toLowerCase() === "University For Graduation".toLowerCase() || String(name).toLowerCase() === "certUniversity".toLowerCase() || String(name).toLowerCase() === "postgradUniversity".toLowerCase()) {
        regexval = /[a-zA-Z]/
    }

    if (val.trim().length !== 0) {
        if (regexval.test(val.trim())) {
            return {
                fieldValue: val,
                isValidField: true,
                errorField: ''
            };
        } else {
            return {
                fieldValue: val,
                isValidField: false,
                errorField: `Invalid input`
            };
        }
    } else {
        return {
            fieldValue: val,
            isValidField: false,
            errorField: `${name} is required`
        };
    }
}

//validation only allow number, required field and length of the number
export const onlyNumber = (name = null, val, len) => {
    if (val.trim().length !== 0) {
        if (/^[0-9]\d*$/.test(val.trim())) {
            return {
                fieldValue: val,
                isValidField: true,
                errorField: ""
            };
        } else {
            return {
                fieldValue: val,
                isValidField: false,
                errorField: `Invalid input`
            };
        }
    } else {
        return {
            fieldValue: val,
            isValidField: false,
            errorField: name !== null ? `${name} is required` : `This field is required`
        };
    }
}

//validation only allow number greater than zero
export const onlyNumberGreaterThanzero = (name = null, val, len) => {
    if (val.trim().length !== 0) {
        if (/^[0-9]\d*$/.test(val.trim())) {
            if (val.trim() > 0) {
                return {
                    fieldValue: val,
                    isValidField: true,
                    errorField: ""
                };
            } else {
                return {
                    fieldValue: val,
                    isValidField: false,
                    errorField: `Enter value greater than 0`
                };
            }

        } else {
            return {
                fieldValue: val,
                isValidField: false,
                errorField: `Invalid input`
            };
        }
    } else {
        return {
            fieldValue: val,
            isValidField: false,
            errorField: name !== null ? `${name} is required` : `This field is required`
        };
    }
}
export const onlyPincode = (val, len, name = null) => {
    if (val.trim().length !== 0) {
        if (!/^[0]*$/.test(val.trim()) && /^[0-9]\d*$/.test(val.trim()) && val.trim().length <= len) {
            console.log("s");
            return {
                fieldValue: val,
                isValidField: true,
                errorField: ""
            };
        } else {
            console.log("sp");

            return {
                fieldValue: val,
                isValidField: false,
                errorField: `Invalid input`
            };
        }
    } else {
        console.log("sppp");

        return {
            fieldValue: val,
            isValidField: false,
            errorField: name !== null ? `${name} is required` : `This field is required`
        };
    }
}

export const onlyValidYearReq = (val, name = null) => {
    let year = new Date();
    if (val.trim().length !== 0) {
        if (/^[1-9]\d*$/.test(val.trim()) && val.trim().length === 4 && val.trim() <= year.getFullYear()) {
            return {
                fieldValue: val,
                isValidField: true,
                errorField: ""
            };
        } else {
            return {
                fieldValue: val,
                isValidField: false,
                errorField: `Invalid input`
            };
        }
    } else {
        return {
            fieldValue: val,
            isValidField: false,
            errorField: name !== null ? `${name} is required` : `This field is required`
        };
    }
}
export const onlyValidYear = (val) => {
    let year = new Date();
    if (val.trim().length !== 0) {
        if (/^[1-9]\d*$/.test(val.trim()) && val.trim().length === 4 && val.trim() <= year.getFullYear()) {
            return {
                fieldValue: val,
                isValidField: true,
                errorField: ""
            };
        } else {
            return {
                fieldValue: val,
                isValidField: false,
                errorField: `Invalid input`
            };
        }
    } else {
        return {
            fieldValue: val,
            isValidField: true,
            errorField: ``
        };
    }
}


export const onPassword = (val) => {
    if (val.trim().length !== 0) {
        /*  if (/^(?=.*\d)(?=.*[a-z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,20}$/.test(val)) { */
        if (/^(?=.*\d)(?=.*[a-z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,20}$/.test(val)) {
            //console.log("inside if")
            return {
                fieldValue: val,
                isValidField: true,
                errorField: ""
            };
        } else {
            return {
                fieldValue: val,
                isValidField: false,
                // errorField: 'Password must be at least 1 lower case,1 upper case, 1 numeric, special character and length  minimum of 8'
                errorField: 'Password must contain letters and numbers and length  minimum of 8'
            };
        }
    } else {
        return {
            fieldValue: val,
            isValidField: false,
            errorField: 'This Field is required'
        };
    }
}

export const onAllowAllCharacters = (name, val) => {
    if (val.trim().length !== 0) {
        return {
            fieldValue: val,
            isValidField: true,
            errorField: ''
        };
    } else {
        return {
            fieldValue: val,
            isValidField: false,
            errorField: `${name} is required`
        };
    }
}

export const matchPassword = (val1, val2) => {
    if (val1 === val2) {
        return {
            fieldValue: val1,
            isValidField: true,
            errorField: ''
        };
    } else {
        return {
            fieldValue: val1,
            isValidField: false,
            errorField: 'Passwords did not match'
        };
    }
}

export const nonRequired = (val) => {
    let regexval = /^[a-zA-Z ]+$/;
    if (val !== '' && val.trim().length !== 0) {
        if (regexval.test(val.trim())) {
            return {
                fieldValue: val,
                isValidField: true,
                errorField: ''
            };
        } else {
            return {
                fieldValue: val,
                isValidField: false,
                errorField: `Invalid input`
            };
        }
    } else {
        return {
            fieldValue: val,
            isValidField: true,
            errorField: ''
        };
    }
}

export const nonRequiredNum = (val, len) => {
    if (val !== '' || val.trim().length !== 0) {
        if (/^[1-9]\d*$/.test(val.trim()) && val.trim().length === len) {
            return {
                fieldValue: val,
                isValidField: true,
                errorField: ""
            };
        } else {
            return {
                fieldValue: val,
                isValidField: false,
                errorField: `Invalid input`
            };
        }
    } else {
        return {
            fieldValue: val,
            isValidField: true,
            errorField: ''
        };
    }
}

export const AddressValidation = (val) => {
    if (val.trim().length !== 0) {
        return {
            fieldValue: val,
            isValidField: true,
            errorField: ''
        };
    } else {
        return {
            fieldValue: val,
            isValidField: false,
            errorField: 'This Field is required'
        };
    }
}

export const onHeightChange = (val, name = null) => {
    let reg = /^[1-9]\d*$/;
    if (val.trim().length >= 2 && reg.test(val.trim())) {
        return {
            fieldValue: val,
            isValidField: true,
            errorField: ''
        };
    } else {
        return {
            fieldValue: val,
            isValidField: false,
            errorField: name !== null ? `${name} is required` : `This field is required`
        };
    }
}

