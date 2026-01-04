import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import useErrorHandling from "../hooks/useErrorHandling";
import { InputContainer } from "./ui/InputContainer";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
}

export const SetMessageModal = ({ isOpen, onClose, onSuccess }: Props) => {
    const [message, setMessage] = useState("");
    
    const toast = useToast();
    const { findErrorMessage } = useErrorHandling();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            
        >
             <ModalOverlay />
            <ModalContent>
                <ModalHeader paddingBottom="0">Set Message</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text marginBottom="4" fontSize="14">This message will be shown at the bottom of the screen</Text>

                    <InputContainer 
                        error={findErrorMessage("message")}
                        // statusText={`${message.length}/100`}
                    >
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Last orders at the bar"
                        />
                    </InputContainer>
                </ModalBody>
                <ModalFooter>
                    <Button 
                        colorScheme="purple"
                        height="8"
                        onClick={() => {
                            onSuccess(message);
                            onClose();
                        }}
                    >
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}