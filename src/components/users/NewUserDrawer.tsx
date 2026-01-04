import { Button, DrawerBody, Input, Select, Stack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useErrorHandling from "../../hooks/useErrorHandling";
import { UserRole } from "../../models/enums/UserRole";
import { User } from "../../models/User";
import { newApiRequest } from "../../utils/clientUtils";
import { Drawer, DrawerFooter } from "../ui/Drawer";
import { InputContainer } from "../ui/InputContainer";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: User) => void;
}

export function NewUserDrawer({ isOpen, onClose, onSuccess }: Props) {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(UserRole.NONE);

    const toast = useToast();
    const router = useRouter();
    const { findErrorMessage, clearErrorAndRun, clearErrors, handleApiError } = useErrorHandling();

    useEffect(() => {
        clearErrors();
        setName("");
        setUsername("");
        setPassword("");
        setRole(UserRole.NONE);
    }, [isOpen]);

    async function sendRequest() {
        try {
            const response = await newApiRequest("POST", `/users/new`, { name, username, password, role });

            if (await handleApiError(response)) {
                const data = await response.json();

                onSuccess(data);
                onClose();
                toast({ title: "User created", status: "success", duration: 2000 });
            }
        } catch (e: any) {
            toast({ title: e.message, status: "error" });
        }
    }

    function isComplete() {
        return name !== "" && username !== "" && password != "";
    }

    return (
        <Drawer
            title="New User"
            isOpen={isOpen}
            onClose={onClose}
        >
            <DrawerBody>
                <Stack spacing="6" marginBottom="6">
                    <InputContainer
                        label="Name"
                        error={findErrorMessage("name")}
                        statusText={`${name.length}/60`}
                    >
                        <Input
                            value={name}
                            onChange={(e) => clearErrorAndRun("name", () => setName(e.target.value))}
                            placeholder="Test Account"
                            maxLength={60}
                        />
                    </InputContainer>

                    <InputContainer
                        label="Username"
                        error={findErrorMessage("username")}
                        helpText="Only letters, numbers and hyphens allowed"
                        statusText={`${username.length}/50`}
                    >
                        <Input
                            value={username}
                            onChange={(e) => clearErrorAndRun("username", () => setUsername(e.target.value))}
                            placeholder="testaccount123"
                            onKeyDown={(e) => {
                                if (!/[a-z\-0-9]/i.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            maxLength={50}
                        />
                    </InputContainer>

                    <InputContainer
                        label="Password"
                        error={findErrorMessage("password")}
                        statusText={`${password.length}/50`}
                    >
                        <Input
                            value={password}
                            onChange={(e) => clearErrorAndRun("password", () => setPassword(e.target.value))}
                            type="password"
                            maxLength={50}
                        />
                    </InputContainer>

                    <InputContainer
                        label="Role"
                        error={findErrorMessage("role")}
                        helpText="No access means no access to admin site at all. User is access to screens. Admin is access to everything."
                    >
                        <Select
                            value={role}
                            onChange={(e) => setRole(e.target.value as UserRole)}
                        >
                            <option value={UserRole.NONE}>None (No access)</option>
                            <option value={UserRole.USER}>User (Basic access)</option>
                            <option value={UserRole.ADMIN}>Admin (Full access)</option>
                        </Select>
                    </InputContainer>
                </Stack>
            </DrawerBody>

            <DrawerFooter>
                <Button
                    colorScheme="purple"
                    onClick={sendRequest}
                    isDisabled={!isComplete()}
                    height="8"
                >
                    Create
                </Button>
            </DrawerFooter>
        </Drawer>
    )
}