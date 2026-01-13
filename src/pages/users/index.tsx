import { Button, Flex, Heading, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import { ErrorView } from "../../components/ui/ErrorView";
import { Page } from "../../components/ui/Page";
import { EditUserDrawer } from "../../components/users/EditUserDrawer";
import { NewUserDrawer } from "../../components/users/NewUserDrawer";
import useErrorHandling from "../../hooks/useErrorHandling";
import { User } from "../../models/User";
import { formatUserRole, UserRole } from "../../models/enums/UserRole";
import { newApiRequest } from "../../utils/clientUtils";
import { checkAuthenticated, getApiKey, processServerError } from "../../utils/serverUtils";
import { authOptions } from "../api/auth/[...nextauth]";

interface Props {
    session: any;
    apiKey: string;
    error: any;
}

export async function getServerSideProps({ params, req, res }: any) {
    let session;

    try {
        session = await getServerSession(req, res, authOptions) as any;
        const authResponse = await checkAuthenticated(session, UserRole.ADMIN);

        if (authResponse !== true) {
            return authResponse;
        }

        return {
            props: {
                session: JSON.parse(JSON.stringify(session)),
                apiKey: getApiKey(session)
            }
        }
    } catch (e: any) {
        return processServerError(e, session);
    }
}

export default function Users(props: Props) {
    const { isOpen: isNewUserModalOpen, onClose: onNewUserModalClose, onOpen: onNewUserModalOpen } = useDisclosure();
    const { isOpen: isEditUserModalOpen, onClose: onEditUserModalClose, onOpen: onEditUserModalOpen } = useDisclosure();

    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>({});
    const toast = useToast();
    const { handleApiError } = useErrorHandling();

    useEffect(() => {
        if (!props.error) {
            fetchUsers();
        }
    }, []);

    useEffect(() => {
        if (props.apiKey) {
            localStorage.setItem("apiKey", props.apiKey);
        }
    }, []);

    async function fetchUsers() {
        try {
            const response = await newApiRequest("GET", "/users");

            if (await handleApiError(response)) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (e: any) {
            toast({ title: "Failed to fetch users", description: e.message, status: "error" });
        }
    }

    if (props.error) {
        return <ErrorView error={props.error} session={props.session} />
    }

    return (
        <Page title="Users">
            <Heading size="sm">Users</Heading>

            <Button
                onClick={onNewUserModalOpen}
                height="8"
                marginTop="2"
            >
                + New User
            </Button>

            <Flex gap="4" marginTop="6" flexWrap="wrap">
                {users.map(user => {
                    return (
                        <Card
                            paddingX="4"
                            paddingY="2"
                            width={{ base: "100%", sm: "250px" }}
                            _hover={{
                                cursor: "pointer",
                                bgColor: "blue.50",
                                border: "1px solid black"
                            }}
                            onClick={() => {
                                setSelectedUser(user);
                                onEditUserModalOpen();
                            }}
                        >
                            <Text fontWeight="bold" fontSize="16">{user.name}</Text>
                            <Text>{user.username}</Text>
                            <Flex gap="1.5">
                                <Text
                                    color={user.isActive ? "green" : "red"}
                                    fontSize="14"
                                >
                                    {user.isActive ? "Active" : "Disabled"}
                                </Text>
                                <Text fontSize="14">&bull;</Text>
                                <Text fontSize="14" color="muted">{formatUserRole(user.role)}</Text>
                            </Flex>
                        </Card>
                    );
                })}
            </Flex>

            <NewUserDrawer
                isOpen={isNewUserModalOpen}
                onClose={onNewUserModalClose}
                onSuccess={user => setUsers([...users, user])}
            />
            <EditUserDrawer
                isOpen={isEditUserModalOpen}
                onClose={onEditUserModalClose}
                onSuccess={fetchUsers}
                session={props.session}
                user={selectedUser}
            />
        </Page>
    )
}