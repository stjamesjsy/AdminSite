import {
    Box,
    FormControl as ChakraFormControl,
    FormControlProps as ChakraFormControlProps,
    FormErrorMessage,
    FormHelperText,
    FormLabel
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface InputContainerProps {
    label?: string;
    error?: string | null;
    helpText?: string;
    statusText?: string;
}

export const InputContainer = (props: PropsWithChildren<InputContainerProps & ChakraFormControlProps>) => {
    const { label, error, helpText, statusText, children, ...rest } = props;

    return (
        <ChakraFormControl
            isInvalid={(error !== null && error !== undefined)}
            {...rest}
        >
            {statusText && (
                <Box display="flex">
                    <FormLabel>{label}</FormLabel>
                    <FormLabel marginLeft="auto">{statusText}</FormLabel>
                </Box>
            )}
            {(label && !statusText) && <FormLabel>{label}</FormLabel>}

            {children}

            {error && <FormErrorMessage>{error}</FormErrorMessage>}
            {helpText && <FormHelperText>{helpText}</FormHelperText>}
        </ChakraFormControl>
    )
}