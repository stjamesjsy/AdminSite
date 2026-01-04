import { Box, Button, DrawerBody, Input, Select, Stack, Switch, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useErrorHandling from "../../hooks/useErrorHandling";
import { User } from "../../models/User";
import { UserRole } from "../../models/enums/UserRole";
import { formatDate, newApiRequest } from "../../utils/clientUtils";
import { Drawer, DrawerFooter } from "../ui/Drawer";
import { InputContainer } from "../ui/InputContainer";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    session: any;
    user: User;
}

export function EditUserDrawer({ isOpen, onClose, onSuccess, session, user }: Props) {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [role, setRole] = useState(UserRole.NONE);

    const toast = useToast();
    const router = useRouter();
    const { findErrorMessage, clearErrorAndRun, clearErrors, handleApiError } = useErrorHandling();

    useEffect(() => {
        clearErrors();

        setName(user?.name ?? "");
        setUsername(user?.username ?? "");
        setIsActive(user?.isActive ?? "");
        setRole(user?.role ?? UserRole.NONE);
    }, [isOpen]);

    async function sendRequest() {
        try {
            const response = await newApiRequest("POST", `/users/${user?.id}`, { name, username, isActive, role });

            if (await handleApiError(response)) {
                onSuccess();
                onClose();
                toast({ title: "User updated", status: "success", duration: 2000 });
            }
        } catch (e: any) {
            toast({ title: e.message, status: "error", duration: 2000 });
        }
    }

    async function sendDeleteRequest() {
        try {
            const response = await newApiRequest("DELETE", `/users/${user?.id}`);

            if (await handleApiError(response)) {
                onSuccess();
                onClose();
                toast({ title: "User deleted", status: "success", duration: 2000 });
            }
        } catch (e: any) {
            toast({ title: e.message, status: "error", duration: 2000 });
        }
    }

     async function sendTokenRegenRequest() {
        try {
            const response = await newApiRequest("POST", `/users/${user?.id}/regen-token`);

            if (await handleApiError(response)) {
                onSuccess();
                onClose();
                toast({ title: "Token regenerated", status: "success", duration: 2000 });
            }
        } catch (e: any) {
            toast({ title: e.message, status: "error", duration: 2000 });
        }
    }

    function isComplete() {
        return name !== "" && username !== "";
    }

    return (
        <Drawer
            title="Edit User"
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
                        statusText={`${username.length}/50`}
                        helpText="Only letters, numbers and hyphens allowed"
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

                    <Stack spacing="2">
                        <InputContainer error={findErrorMessage("isActive")}>
                            <Switch
                                isChecked={isActive}
                                onChange={(e) => clearErrorAndRun("isActive", () => setIsActive(e.target.checked))}
                            >
                                Active
                            </Switch>
                        </InputContainer>

                        <InputContainer>
                            <Switch
                                isChecked={user?.isSuperAdmin}
                                isDisabled
                            >
                                Super admin
                            </Switch>
                        </InputContainer>
                    </Stack>

                    <Box marginTop="auto">
                        <Text fontSize="12" color="muted">Created at {formatDate(user?.createdAt)}</Text>
                        <Text fontSize="12" color="muted">{user?.id}</Text>
                    </Box>
                </Stack>
            </DrawerBody>

            <DrawerFooter>
                <Button
                    colorScheme="red"
                    onClick={sendDeleteRequest}
                    height="8"
                    marginRight="2"
                    isDisabled={session?.user?.id === user?.id}
                >
                    Delete
                </Button>
                <Button
                    onClick={sendTokenRegenRequest}
                    height="8"
                    marginRight="2"
                >
                    Regen Token
                </Button>
                <Button
                    colorScheme="purple"
                    onClick={sendRequest}
                    isDisabled={!isComplete()}
                    height="8"
                >
                    Update
                </Button>
            </DrawerFooter>
        </Drawer>
    )
}