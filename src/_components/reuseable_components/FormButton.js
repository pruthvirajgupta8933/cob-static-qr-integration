import React from 'react'
import { Button } from '@material-ui/core';
import { useFormikContext } from 'formik';

function FormButton({
    children,
    ...otherProps
    }) {
        const { submitForm } = useFormikContext();

        const handleSubmit = () => {
        submitForm();
        }
    
        const configButton = {
        variant: 'contained',
        color: 'primary',
        fullWidth: true,
        onClick: handleSubmit
        }
    
        return (
        <Button
            {...configButton}
        >
            {children}
        </Button>
        );
}

export default FormButton
