import { Box, Button, Flex, Heading, Image, Link, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import { ErrorView } from "../../components/ui/ErrorView";
import { Page } from "../../components/ui/Page";
import { NewScreenDrawer } from "../../components/screens/NewScreenDrawer";
import useErrorHandling from "../../hooks/useErrorHandling";
import { Screen } from "../../models/Screen";
import { DeviceType, formatDeviceType } from "../../models/enums/DeviceType";
import { UserRole } from "../../models/enums/UserRole";
import { formatTimeSince, newApiRequest } from "../../utils/clientUtils";
import { checkAuthenticated, getApiKey, processServerError } from "../../utils/serverUtils";
import { authOptions } from "../api/auth/[...nextauth]";
import NextLink from "next/link";

interface Props {
    session: any;
    apiKey: string;
    error: any;
}

export async function getServerSideProps({ params, req, res }: any) {
    let session;

    try {
        session = await getServerSession(req, res, authOptions) as any;
        const authResponse = await checkAuthenticated(session, UserRole.USER);

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

export default function Screens(props: Props) {
    const { isOpen: isNewScreenModalOpen, onClose: onNewScreenModalClose, onOpen: onNewScreenModalOpen } = useDisclosure();

    const [screens, setScreens] = useState<Screen[]>([]);
    const toast = useToast();
    const { handleApiError } = useErrorHandling();

    useEffect(() => {
        if (!props.error) {
            fetchScreens();
        }
    }, []);

    useEffect(() => {
        if (props.apiKey) {
            localStorage.setItem("apiKey", props.apiKey);
        }
    }, []);

    async function fetchScreens() {
        try {
            const response = await newApiRequest("GET", "/screens");

            if (await handleApiError(response)) {
                const data = await response.json();
                setScreens(data);
            }
        } catch (e: any) {
            toast({ title: "Failed to fetch screens", description: e.message, status: "error" });
        }
    }

    function getDeviceTypeImage(deviceType: DeviceType) {
        switch (deviceType) {
            case DeviceType.FIRE_STICK: return "firetv.png";
            case DeviceType.COMPUTER: return "pc.png";
            default: return "unknown.png";
        }
    }

    if (props.error) {
        return <ErrorView error={props.error} session={props.session} />
    }

    return (
        <Page title="Screens">
            <Heading size="sm">Screens</Heading>

            <Button
                onClick={onNewScreenModalOpen}
                height="8"
                marginTop="2"
            >
                + New Screen
            </Button>

            <Flex gap={{ base: 2, md: 4 }} marginTop="6" flexWrap="wrap">
                {screens.map(screen => (
                    <Link 
                        key={screen.id}
                        href={`/screens/${screen.id}`} 
                        _hover={{ textDecoration: "none" }}
                        width={{ base: "100%", md: "fit-content" }}
                        as={NextLink}
                    >
                        <Card
                            paddingX="4"
                            paddingY="2"
                            width={{ base: "100%", md: "fit-content" }}
                            _hover={{ bgColor: "blue.50", border: "1px solid black" }}
                        >
                            <Flex>
                                <Flex
                                    width="16"
                                    justifyContent="center"
                                    alignItems="center"
                                    paddingRight="4"
                                >
                                    <Image src={`/images/${getDeviceTypeImage(screen.deviceType)}`} />
                                </Flex>
                                <Box>
                                    <Text fontSize="18" fontWeight="bold">{screen.name}</Text>
                                    <Text>{formatDeviceType(screen.deviceType)}</Text>
                                    <Text color="muted" fontSize="12">Created {formatTimeSince(screen.createdAt)}</Text>
                                </Box>
                            </Flex>
                        </Card>
                    </Link>
                ))}
            </Flex>

            <NewScreenDrawer
                isOpen={isNewScreenModalOpen}
                onClose={onNewScreenModalClose}
                onSuccess={screen => setScreens([...screens, screen])}
            />
        </Page>
    )
}