import { useState } from "react";

function useForm(
    fields: readonly string[], 
    initialValues: {[k in typeof fields[number]]: string},
    validators: {[k in typeof fields[number]]: [string, (val:string)=>boolean][]}
) {
    const [fieldValues, setFieldValues] = useState(initialValues);
    const [errors, setErrors] = useState(
        Object.fromEntries(fields.map(k => [k, ""])) as {[k in typeof fields[number]]: string}
    );

    const setFieldValue = (field: string, value: string) => {
        setFieldValues({
            ...fieldValues,
            [field]: value
        });
        setError(field, "");
    }

    const setError = (field: string, error: string) => {
        setErrors({
            ...errors,
            [field]: error
        });
    }

    const clearErrors = () => {        
        setErrors(Object.fromEntries(fields.map(k => [k, ""])) as {[k in typeof fields[number]]: string});
    }

    const clearForm = () => {
        setFieldValues(initialValues);
        clearErrors();
    }
    
    const validate = ():boolean => {
        let valid = true;
        let cerrors = Object.fromEntries(fields.map(k => [k, ""]));
        for(const key in validators){
            for(const [error, validator] of validators[key]){
                if(!validator(fieldValues[key])){
                    cerrors[key] = error;
                    valid = false;
                    break;
                }
            }
        }
        setErrors(cerrors);
        return valid;
    }

    return {fieldValues,
        errors, 
        setFieldValue, 
        setError, 
        validate, 
        clearForm, 
        clearErrors,
        setFieldValues
    };
}

export default useForm;