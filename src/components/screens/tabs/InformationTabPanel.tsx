import { useEffect, useState } from "react";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { Box, Button, Flex, Grid, GridItem, Heading, Stack, Switch, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import { Log } from "../../../models/Log";
import { formatDate, newApiRequest } from "../../../utils/clientUtils";
import { Screen } from "../../../models/Screen";
import { LogStatus } from "../../../models/enums/LogStatus";
import { ScreenAction } from "../../../models/enums/ScreenAction";
import { FiDelete, FiDownload, FiInfo } from "react-icons/fi";
import { ExitToAppOutlined } from "@mui/icons-material";
import { SetMessageModal } from "../../SetMessageModal";
import Card from "../../ui/Card";

interface InfoProps {
    session: any;
    screen: Screen;
    sendAction: any;
}

export default function InformationTabPanel({ screen, sendAction, session }: InfoProps) {
    const { isOpen: isSetMessageModalOpen, onClose: onSetMessageModalClose, onOpen: onSetMessageModalOpen } = useDisclosure();

    const [logs, setLogs] = useState<Log[]>([]);
    const [logsError, setLogsError] = useState("");
    const [showDebug, setShowDebug] = useState(false);
    const { handleApiError } = useErrorHandling();

    useEffect(() => {
        const id = setInterval(() => {
            if (screen) {
                fetchLogs();
            }
        }, 1000);
        return () => clearInterval(id);
    }, []);

    async function fetchLogs() {
        try {
            setLogsError("");
            const response = await newApiRequest("GET", `/screens/${screen?.id}/logs`);

            if (await handleApiError(response)) {
                const data = await response.json();
                setLogs(data);
            } else {
                setLogsError("Failed to fetch logs");
            }
        } catch (e: any) {
            setLogsError(e.message);
        }
    }

    function getLogColor(log: Log) {
        if (log.status === LogStatus.INFO) {
            return "gray";
        }
        if (log.status === LogStatus.ERROR) {
            return "red";
        }
        if (log.status === LogStatus.DEBUG) {
            return "gray.400";
        }
        return "gray";
    }

    function Action({ icon, text, summary, onClick }: any) {
        return (
            <Tooltip label={summary}>
                <Button
                    colorScheme="blue"
                    onClick={onClick}
                    leftIcon={icon}
                    height="8"
                    paddingX="3"
                    fontSize="14"
                >
                    {text}
                </Button>
            </Tooltip>
        )
    }

    return (
        <Stack spacing="4">
            <Grid
                gridTemplateColumns={{ base: "1fr", md: "40% 1fr" }}
                gap="2"
            >
                <GridItem>
                    <Card padding="5">
                        <Heading size="xs" marginBottom="2">Connect</Heading>
                        <Text>Enter this code on the setup screen in the app.</Text>

                        <Box
                            bgColor="gray.100"
                            width="fit-content"
                            paddingX="2"
                            marginTop="2"
                        >
                            <Text fontSize="20" fontWeight="bold">{screen?.uniqueCode}</Text>
                        </Box>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card padding="5">
                        <Heading size="xs" marginBottom="3">Actions</Heading>

                        <Flex
                            gap="2"
                            flexWrap="wrap"
                        >
                            <Action
                                text="Fetch Videos"
                                onClick={() => sendAction(ScreenAction.FETCH_VIDEOS)}
                                icon={<FiDownload />}
                                summary="Downloads videos onto the device"
                            />
                            <Action
                                text="Send Test Toast"
                                onClick={() => sendAction(ScreenAction.TOAST, { text: "This is a test message" })}
                                icon={<FiInfo />}
                            />
                            <Action
                                text="Set Message"
                                onClick={onSetMessageModalOpen}
                                icon={<FiInfo />}
                            />
                            <Action
                                text="Clear Message"
                                onClick={() => sendAction(ScreenAction.CLEAR_MESSAGE)}
                                icon={<FiDelete />}
                            />
                            <Action
                                text="Kill App"
                                onClick={() => sendAction(ScreenAction.KILL_APP)}
                                icon={<ExitToAppOutlined />}
                            />
                        </Flex>
                    </Card>
                </GridItem>
            </Grid>

            <Card padding="5">
                <Flex justifyContent="space-between">
                    <Heading size="xs" marginBottom="4">Logs</Heading>

                    <Switch
                        isChecked={showDebug}
                        onChange={(e) => setShowDebug(e.target.checked)}
                    >
                        Debug
                    </Switch>
                </Flex>

                {logsError !== "" ? (
                    <Box>
                        <Text color="red" marginBottom="2">{logsError}</Text>
                        <Button onClick={fetchLogs} height="8">Retry</Button>
                    </Box>
                ) : (
                    <Box
                        maxHeight="300px"
                        overflowY="auto"
                        overflowX="auto"
                        whiteSpace="nowrap"
                    >
                        {logs.map(log => {
                            if (!showDebug && log.status === LogStatus.DEBUG) {
                                return;
                            }
                            return (
                                <Flex
                                    key={log.id}
                                    fontSize={{ base: 12, md: 13 }}
                                    whiteSpace="nowrap"
                                    minWidth="max-content"
                                >
                                    <Text color="gray">{formatDate(log.createdAt)} -&nbsp;</Text>
                                    <Text color={getLogColor(log)}>[{log.status}]</Text>
                                    <Text color={getLogColor(log)}>&nbsp;{log.text}</Text>
                                </Flex>
                            );
                        })}
                    </Box>
                )}
            </Card>

            <SetMessageModal
                isOpen={isSetMessageModalOpen}
                onClose={onSetMessageModalClose}
                onSuccess={(message) => sendAction(ScreenAction.SET_MESSAGE, { text: message })}
            />
        </Stack>
    )
}