import { Tab as ChakraTab, TabProps as ChakraTabProps, useColorModeValue } from "@chakra-ui/react";

interface TabProps {
    text: string;
    disabled?: boolean;
}

export function Tab({ text, disabled, ...props }: TabProps & ChakraTabProps) {
    return (
        <ChakraTab
            fontSize="18px"
            color="brand.gray"
            paddingBottom="12px"
            paddingLeft="0"
            paddingRight="0"
            isDisabled={disabled}
            marginRight="10"
            _selected={{
                color: useColorModeValue("black", "white"),
                paddingBottom: "10px",
                borderBottom: "2px solid",
                borderColor: "brand.purple"
            }}
            _hover={{
                color: "brand.purple"
            }}
            {...props}
        >
            {text}
        </ChakraTab>
    )
}