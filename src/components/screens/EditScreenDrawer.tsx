import { Button, DrawerBody, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Stack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useErrorHandling from "../../hooks/useErrorHandling";
import { Screen } from "../../models/Screen";
import { DeviceType } from "../../models/enums/DeviceType";
import { newApiRequest } from "../../utils/clientUtils";
import { InputContainer } from "../ui/InputContainer";
import { Drawer, DrawerFooter } from "../ui/Drawer";

interface EditScreenModalProps {
    screen?: Screen;
    isOpen: any;
    onClose: any;
}

export function EditScreenDrawer({ screen, isOpen, onClose }: EditScreenModalProps) {
    const [name, setName] = useState(screen?.name ?? "");
    const [deviceType, setDeviceType] = useState(screen?.deviceType);

    const toast = useToast();
    const router = useRouter();
    const { findErrorMessage, clearErrorAndRun, clearErrors, handleApiError } = useErrorHandling();

    useEffect(() => {
        clearErrors();
        setName(screen?.name ?? "");
        setDeviceType(screen?.deviceType ?? DeviceType.UNKNOWN);
    }, [isOpen]);

    /**
     * Handles closing the modal.
     */
    const handleClose = () => {
        clearErrors();
        onClose();
    }

    async function sendRequest() {
        try {
            const response = await newApiRequest("POST", `/screens/${screen?.id}`, { screenId: screen?.id, name, deviceType });

            if (await handleApiError(response)) {
                router.push(`/screens/${screen?.id}`);
                onClose();
            }
        } catch (e: any) {
            toast({ title: e.message, status: "error" });
        }
    }

    /**
      * Deletes the advert.
      * 
      * @returns 
      */
    const sendDeleteRequest = async () => {
        const response = await newApiRequest("DELETE", `/screens/${screen?.id}`);

        if (await handleApiError(response)) {
            router.push("/screens");
            onClose();
        }
    }

    return (
        <Drawer
            title="Edit Screen"
            isOpen={isOpen}
            onClose={onClose}
        >
            <DrawerBody>
                <Stack spacing="6" marginBottom="6">
                    <InputContainer
                        label="Name"
                        error={findErrorMessage("name")}
                        statusText={`${name.length}/50`}
                    >
                        <Input
                            value={name}
                            onChange={(e) => clearErrorAndRun("name", () => setName(e.target.value))}
                            maxLength={50}
                        />
                    </InputContainer>

                    <InputContainer
                        label="Device Type"
                        error={findErrorMessage("deviceType")}
                    >
                        <Select
                            value={deviceType}
                            onChange={(e) => clearErrorAndRun("deviceType", () => setDeviceType(e.target.value as DeviceType))}
                        >
                            <option value={DeviceType.UNKNOWN}>Unknown</option>
                            <option value={DeviceType.COMPUTER}>Computer</option>
                            <option value={DeviceType.FIRE_STICK}>Fire TV Stick</option>
                            <option value={DeviceType.ANDROID_TV}>Android TV</option>
                            <option value={DeviceType.TABLET}>Tablet</option>
                            <option value={DeviceType.OTHER}>Other</option>
                        </Select>
                    </InputContainer>
                </Stack>
            </DrawerBody>

            <DrawerFooter>
                <Button
                    colorScheme="red"
                    onClick={sendDeleteRequest}
                    marginRight="3"
                    height="8"
                >
                    Delete
                </Button>
                <Button
                    colorScheme="purple"
                    onClick={sendRequest}
                    height="8"
                >
                    Update
                </Button>
            </DrawerFooter>
        </Drawer>
    )
}