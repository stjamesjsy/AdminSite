import { Badge, Box, Flex, Heading, Stack, TabList, TabPanel, TabPanels, Tabs, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import Card from "../../../components/ui/Card";
import { EditScreenDrawer } from "../../../components/screens/EditScreenDrawer";
import { ErrorView } from "../../../components/ui/ErrorView";
import { LoadingView } from "../../../components/ui/LoadingView";
import { Page } from "../../../components/ui/Page";
import InformationTabPanel from "../../../components/screens/tabs/InformationTabPanel";
import VideosTabPanel from "../../../components/screens/tabs/VideoTabsPanel";
import { Tab } from "../../../components/ui/Tab";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { DeviceType, formatDeviceType } from "../../../models/enums/DeviceType";
import { ScreenAction } from "../../../models/enums/ScreenAction";
import { UserRole } from "../../../models/enums/UserRole";
import { Screen } from "../../../models/Screen";
import { Video } from "../../../models/Video";
import { formatTimeSince, newApiRequest } from "../../../utils/clientUtils";
import { AppError } from "../../../utils/exceptions/AppError";
import { checkAuthenticated, getApiKey, processServerError } from "../../../utils/serverUtils";
import { authOptions } from "../../api/auth/[...nextauth]";

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

export default function ScreenInfo(props: Props) {
    const { isOpen: isEditScreenModalOpen, onClose: onEditScreenModalClose, onOpen: onEditScreenModalOpen } = useDisclosure();

    const [screen, setScreen] = useState<Screen>();
    const [videos, setVideos] = useState<Video[]>([]);
    const [error, setError] = useState(props.error);
    const [lastUpdated, setLastUpdated] = useState("");
    const [deviceUptime, setDeviceUptime] = useState("");
    const [connected, setConnected] = useState(false);

    const toast = useToast();
    const router = useRouter();
    const { handleApiError } = useErrorHandling();

    useEffect(() => {
        if (props.apiKey) {
            localStorage.setItem("apiKey", props.apiKey);
        }
    }, []);

    useEffect(() => {
        if (!props.error) {
            if (router.query.id) {
                fetchScreen(String(router.query.id));
            }
        }
    }, [router.query]);

    useEffect(() => {
        const id = setInterval(() => {
            if (screen) {
                fetchStatus(screen);
            }
        }, 2000);
        return () => clearInterval(id);
    }, [screen]);

    async function fetchScreen(id: string) {
        try {
            const response = await newApiRequest("GET", `/screens/${id}`);

            if (await handleApiError(response)) {
                const data = await response.json();

                setScreen(data);
                fetchVideos(data);
            } else {
                setError(new AppError({ description: "Failed to fetch screen info", httpCode: response.status }))
            }
        } catch (e: any) {
            setError(e);
            toast({ title: "Failed to fetch screens", description: e.message, status: "error" });
        }
    }

    async function fetchVideos(screen: Screen) {
        try {
            const response = await newApiRequest("GET", `/screens/${screen?.id}/videos`);

            if (await handleApiError(response)) {
                const data = await response.json();
                setVideos(data);
            } else {
                setError(new AppError({ description: "Failed to fetch videos", httpCode: response.status }))
            }
        } catch (e: any) {
            setError(e);
            toast({ title: "Failed to fetch videos", description: e.message, status: "error" });
        }
    }

    async function fetchStatus(screen: Screen) {
        try {
            const response = await newApiRequest("GET", `/screens/${screen?.id}/status`);

            if (await handleApiError(response)) {
                const data = await response.json();
                const moreThan30SecsAgo = (Date.now() - new Date(Number(data?.lastUpdated)).getTime()) > 10 * 1000;

                setConnected(!moreThan30SecsAgo);
                setLastUpdated(formatTimeSince(data?.lastUpdated));
                setDeviceUptime(data?.uptime);
            } else {
                setConnected(false);
            }
        } catch (e: any) {
            setConnected(false);
        }
    }

    const sendAction = async (action: ScreenAction, data?: any) => {
        try {
            const response = await newApiRequest("POST", `/screens/${screen?.id}/action`, {
                screenId: screen?.id,
                action,
                data
            });

            if (await handleApiError(response)) {
                toast({ title: `Action sent (${action})`, status: "success", duration: 1500 });
            }
        } catch (e: any) {
            toast({ title: e.message, status: "error" });
        }
    }

    function getDeviceTypeImage(deviceType: DeviceType) {
        switch (deviceType) {
            case DeviceType.FIRE_STICK: return "firetv.png";
            case DeviceType.COMPUTER: return "pc.png";
            default: return "unknown.png";
        }
    }

    if (error) {
        return <ErrorView error={props.error} session={props.session} />
    }

    if (!screen) {
        return <LoadingView />
    }

    return (
        <Page title={screen?.name ?? ""} session={props.session}>
            <Flex
                justifyContent="space-between"
                flexWrap="wrap"
                flexDirection={{ base: "column", md: "row" }}
                rowGap={{ base: 0, md: 2 }}
            >
                <Stack spacing="0">
                    <Flex justifyContent="space-between">
                        <Heading size={{ base: "xs", md: "sm" }} marginRight="4">{screen.name}</Heading>

                        <Box
                            onClick={onEditScreenModalOpen}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            boxSize="32px"
                            borderRadius="md"
                            cursor="pointer"
                            _hover={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
                            _active={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                        >
                            <FiEdit />
                        </Box>
                    </Flex>

                    <Box>
                        <Badge
                            bgColor="black"
                            color="white"
                            marginTop="2"
                            fontSize="14"
                            paddingY="0"
                        >
                            {formatDeviceType(screen.deviceType)}
                        </Badge>
                    </Box>
                </Stack>

                <Box
                    marginTop={{ base: "4", md: "0" }}
                >
                    <Card
                        paddingX="4"
                        paddingY="1"
                        borderRadius="16"
                        width="fit-content"
                    >
                        <Flex justifyContent="space-between" alignItems="center">
                            <Text fontSize="16" paddingRight="6">Status</Text>

                            <Box>
                                <Badge
                                    bgColor={connected ? "green" : "red"}
                                    color="white"
                                    paddingY={{ base: 0, md: 0.5 }}
                                    fontSize="14"
                                >
                                    {connected ? "Connected" : "Disconnected"}
                                </Badge>
                            </Box>
                        </Flex>
                    </Card>
                </Box>
            </Flex>

            <Tabs marginTop="4">
                <TabList>
                    <Tab
                        text="Information"
                        marginRight="8"
                    />
                    <Tab
                        text="Videos"
                        marginRight="8"
                    />
                </TabList>
                <TabPanels>
                    <TabPanel paddingX="0">
                        <InformationTabPanel
                            screen={screen}
                            session={props.session}
                            sendAction={sendAction}
                            deviceUptime={deviceUptime}
                            connected={connected}
                            fetchScreen={() => fetchScreen(screen.id)}
                        />
                    </TabPanel>
                    <TabPanel paddingX="0">
                        <VideosTabPanel
                            screen={screen}
                            videos={videos}
                            session={props.session}
                            fetchVideos={() => fetchVideos(screen)}
                            fetchScreen={() => fetchScreen(screen?.id)}
                            sendAction={sendAction}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>

            <EditScreenDrawer
                isOpen={isEditScreenModalOpen}
                onClose={onEditScreenModalClose}
                screen={screen}
            />
        </Page>
    )
};