import { Button, DrawerBody, Input, Select, Stack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useErrorHandling from "../../hooks/useErrorHandling";
import { DeviceType } from "../../models/enums/DeviceType";
import { Screen } from "../../models/Screen";
import { newApiRequest } from "../../utils/clientUtils";
import { Drawer, DrawerFooter } from "../ui/Drawer";
import { InputContainer } from "../ui/InputContainer";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (screen: Screen) => void;
}

export function NewScreenDrawer({ isOpen, onClose, onSuccess }: Props) {
    const [name, setName] = useState("");
    const [deviceType, setDeviceType] = useState(DeviceType.UNKNOWN);

    const toast = useToast();
    const router = useRouter();
    const { findErrorMessage, clearErrorAndRun, clearErrors, handleApiError } = useErrorHandling();

    useEffect(() => {
        clearErrors();
        setName("");
        setDeviceType(DeviceType.UNKNOWN);
    }, [isOpen]);

    async function sendRequest() {
        try {
            const response = await newApiRequest("POST", `/screens/new`, { 
                name, 
                deviceType
            });

            if (await handleApiError(response)) {
                const data = await response.json();

                onSuccess(data)
                onClose();
                toast({ title: "Screen created", status: "success", duration: 1500 });
            }
        } catch (e: any) {
            toast({ title: e.message, status: "error" });
        }
    }

    return (
        <Drawer
            title="New Screen"
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
                    colorScheme="purple"
                    onClick={sendRequest}
                    height="8"
                >
                    Create
                </Button>
            </DrawerFooter>
        </Drawer>
    )
}