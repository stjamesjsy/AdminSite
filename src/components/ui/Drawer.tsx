import {
    Drawer as ChakraModal,
    DrawerProps as ChakraModalProps,
    DrawerOverlay as ChakraModalOverlay,
    DrawerHeader as ChakraModalHeader,
    DrawerFooter as ChakraModalFooter,
    DrawerCloseButton as ChakraModalCloseButton,
    DrawerContent as ChakraModalContent,
    DrawerBody as ChakraModalBody,
    Stack,
    Text,
    BoxProps
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface DrawerProps {
    overlay?: boolean;
    closeButton?: boolean;
    title?: string;
    onClose?: any;
    confirmBeforeClose?: boolean;
}

export function Drawer(props: PropsWithChildren<DrawerProps & ChakraModalProps>) {
    const { overlay = true, closeButton = true, title, confirmBeforeClose, onClose, children, ...rest } = props;

    function handleClose() {
        const canClose = !confirmBeforeClose || confirm("Are you sure you want to close? You may lose your progress!");

        if (canClose) {
            onClose();
        }
    }

    return (
        <ChakraModal
            size="md"
            onClose={handleClose}
            {...rest}
        >
            {overlay && <ChakraModalOverlay />}

            <ChakraModalContent borderLeftRadius={{ base: undefined, md: "6" }}>
                <ChakraModalHeader
                    textAlign="center"
                    fontSize="18"
                    borderBottom="1px solid"
                    borderBottomColor="gray.100"
                    marginBottom="4"
                >
                    {title ?? "&"}
                </ChakraModalHeader>

                {closeButton && <ChakraModalCloseButton marginTop="2" />}

                {children}
            </ChakraModalContent>
        </ChakraModal>
    )
}

export const DrawerBody = ({ children, ...props }: PropsWithChildren<BoxProps>) => (
    <ChakraModalBody marginBottom="5" {...props}>{children}</ChakraModalBody>
)


export const DrawerFooter = ({ children, ...props }: PropsWithChildren<BoxProps>) => {
    return (
        <ChakraModalFooter
            position="sticky"
            bottom="0"
            marginTop="0"
            marginBottom="-1"
            paddingTop="3"
            borderTop="1px solid"
            borderTopColor="gray.100"
            {...props}
        >
            {children}
        </ChakraModalFooter>
    )
}