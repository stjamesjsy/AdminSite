import { Box, Flex, Grid, GridItem, Heading, IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { Screen } from "../../../models/Screen";
import { SelectVideoDrawer } from "../../videos/SelectVideoDrawer";
import { GeneralSettings } from "../views/general";
import { VideoSettings } from "../views/videos";
import Card from "../../ui/Card";

interface ScreenInfoProps {
    session: any;
    screen: Screen;
    videos: any[];
}

export default function SettingsTabPanel({ screen, videos, fetchVideos, fetchScreen, sendAction, session }: ScreenInfoProps & { fetchVideos: () => void; fetchScreen: any; sendAction: any }) {
    const [generalSettings, setGeneralSettings] = useState<any>();
    const [videoSettings, setVideoSettings] = useState<any>();

    const toast = useToast();
    const { clearErrorAndRun, findErrorMessage, handleApiError } = useErrorHandling();
    const { isOpen: isSelectModalOpen, onOpen: onSelectModalOpen, onClose: onSelectModalClose } = useDisclosure();

    const getCurrentSettings = () => {
        return {
            general: {
                // videoType: Number(screen.videoType)
            },
            videos: {
                activeVideoId: screen.activeVideoId,
                isControlsShown: Boolean(screen.isControlsShown),
                isTimeShown: Boolean(screen.isTimeShown)
            }
        }
    }

    return (
        <Box>
            <Grid
                gap="4"
                gridTemplateColumns={{ base: "1fr", md: "42% 1fr" }}
                gridTemplateAreas={{ base: `'general' 'videos' 'messages'`, md: `'general videos' 'messages videos'` }}
                alignItems="start"
            >
                <GridItem gridArea="general">
                    <Card padding="5" marginBottom="4">
                        <Heading size="xs" marginBottom="4">Video Type</Heading>

                        <GeneralSettings
                            screen={screen}
                            onChange={(s: any) => setGeneralSettings(s)}
                        />
                    </Card>
                    {/* 
                    <Card padding="5">
                        <Heading size="xs" marginBottom="4">Messages</Heading>
                        
                        <MessagesSettings
                            screen={screen}
                            onChange={(s: any) => setGeneralSettings(s)}
                        />
                    </Card> */}
                </GridItem>

                <GridItem gridArea="videos">
                    <Card padding="5">
                        <Flex justifyContent="space-between">
                            <Heading size="xs" marginBottom="4">Videos</Heading>
                            <IconButton
                                icon={<Add />}
                                variant="ghost"
                                aria-label="New video"
                                onClick={onSelectModalOpen}
                            />
                        </Flex>

                        <VideoSettings
                            screen={screen}
                            videos={videos}
                            onChange={(s: any) => setVideoSettings(s)}
                            fetchScreen={fetchScreen}
                            findErrorMessage={findErrorMessage}
                            clearErrorAndRun={clearErrorAndRun}
                            fetchVideos={fetchVideos}
                            sendAction={sendAction}
                        />
                    </Card>
                </GridItem>

                <GridItem gridArea="messages">
                    {/* <Card padding="5">
                        <Heading size="xs" marginBottom="4">Messages</Heading>

                    </Card> */}
                </GridItem>
            </Grid>

            <SelectVideoDrawer
                isOpen={isSelectModalOpen}
                onClose={onSelectModalClose}
                onSuccess={fetchVideos}
                screenId={screen?.id}
            />
        </Box>
    )
}