import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, SimpleGrid, Stack, Switch, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { PropsWithChildren, useState } from "react";
import { InputContainer } from "../../ui/InputContainer";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { Screen } from "../../../models/Screen";
import { Video } from "../../../models/Video";
import { ScreenAction } from "../../../models/enums/ScreenAction";
import { newApiRequest, newLocalApiRequest } from "../../../utils/clientUtils";
import { EditVideoDrawer } from "../../videos/EditVideoDrawer";
import { UploadVideoDrawer } from "../../videos/UploadVideoDrawer";

interface Props {
    screen: Screen;
    onChange: (data: any) => void;
    videos: Video[];
    findErrorMessage: (error: string) => string | null;
    clearErrorAndRun: (error: string, callback: () => void) => void;
    fetchVideos: () => void;
    sendAction: (action: string, data?: any) => void;
    fetchScreen: () => void;
}

export function VideoSettings({ screen, videos, findErrorMessage, clearErrorAndRun, onChange, fetchVideos, fetchScreen, sendAction }: Props) {
    const { isOpen: isUploadModalOpen, onOpen: onUploadModalOpen, onClose: onUploadModalClose } = useDisclosure();
    const { isOpen: isUpdateModalOpen, onOpen: onUpdateModalOpen, onClose: onUpdateModalClose } = useDisclosure();

    const [selectedVideo, setSelectedVideo] = useState<any>();

    const [activeVideoId, setActiveVideoId] = useState(screen.activeVideoId);
    const [activeVideoName, setActiveVideoName] = useState<any>(null);
    const [isControlsShown, setIsControlsShown] = useState(Boolean(screen.isControlsShown));
    const [isTimeShown, setIsTimeShown] = useState(Boolean(screen.isTimeShown));

    const toast = useToast();
    const router = useRouter();
    const { handleApiError } = useErrorHandling();

    // Update on selected video change
    // useEffect(() => handleChange(), [activeVideoId, isControlsShown, isTimeShown]);

    const handleChange = () => {
        onChange({
            activeVideoId,
            activeVideoName,
            isControlsShown,
            isTimeShown,
        });
    }

    function onEdit(e: any, video: Video) {
        e.stopPropagation();
        e.preventDefault();

        setSelectedVideo(video);
        onUpdateModalOpen();
    }

    async function onRemove(e: any, video: Video) {
        e.stopPropagation();
        e.preventDefault();

        try {
            const response = await newApiRequest("DELETE", `/screens/${screen?.id}/videos/${video?.id}`);

            if (await handleApiError(response)) {
                fetchVideos();
                toast({ title: "Video removed", status: "success", duration: 1500 });
            }
        } catch (e: any) {
            toast({ title: e.message, status: "error" });
        }
    }

    async function toggleVideoControls(isChecked: boolean) {
        try {
            const result = await newLocalApiRequest("POST", "/actions/toggle-controls", {
                screenId: screen.id,
                showControls: isChecked
            });

            if (await handleApiError(result)) {
                toast({ title: (isChecked ? "Shown" : "Hidden") + " video controls", duration: 2000 });
                fetchScreen();

                setIsControlsShown(isChecked);
                sendAction(ScreenAction.TOGGLE_CONTROLS, { shown: isChecked });
            }
        } catch (error: any) {
            showToastError(error);
        }
    }


    async function changeVideo(video: { id?: string; name?: string } | null) {
        try {
            const videoId = video?.id ?? null;
            const videoName = video?.name ?? null;

            const result = await newLocalApiRequest("POST", "/actions/change-active-video", {
                screenId: screen.id,
                activeVideoId: videoId
            });

            if (await handleApiError(result)) {
                toast({ title: "Active video changed", duration: 2000 });

                setActiveVideoId(videoId);
                setActiveVideoName(videoName);
                handleChange();

                sendAction(ScreenAction.CHANGE_VIDEO, {
                    videoId,
                    videoName
                });
            }
        } catch (error: any) {
            showToastError(error);
        }
    }


    const getCurrentSettings = () => ({
        general: {
            // videoType: Number(screen.videoType)
        },
        videos: {
            activeVideoId,
            isControlsShown,
            isTimeShown: !!screen?.isTimeShown
        },
    });

    const updateSettingsNew = async (overrides: any) => {
        const currentSettings = getCurrentSettings();

        const mergedSettings = {
            general: { ...currentSettings.general, ...overrides.general },
            videos: { ...currentSettings.videos, ...overrides.videos }
        };

        try {
            const result = await newLocalApiRequest("POST", "/update-settings", {
                general: mergedSettings.general,
                videos: mergedSettings.videos,
                screenId: screen?.id,
            });

            if (await handleApiError(result)) {
                toast({ title: "Settings updated", duration: 2000 });
                fetchScreen();
                return true;
            }

            return false;
        } catch (error: any) {
            showToastError(error);
            return false;
        }
    };


    function showToastError(error: any) {
        toast({ title: error?.message ?? "An unexpected error occurred", status: "error" });
    }


    function Pill({ children, video }: PropsWithChildren<any>) {
        const isActive = activeVideoId === (video ? video.id : null);

        return (
            <Box
                border="1px solid"
                borderColor={isActive ? "black" : "gray.200"}
                borderRadius="16"
                paddingX="4"
                paddingY="1"
                _hover={{
                    cursor: "pointer",
                    bgColor: isActive ? "blue.100" : "gray.100"
                }}
                bgColor={isActive ? "blue.50" : "white"}
                onClick={(e) => changeVideo(video)}
            >
                {children}
            </Box>
        )
    }

    return (
        <Stack spacing="4" marginTop="6">
            <Stack marginBottom="5">
                <Stack
                    spacing="2"
                    maxHeight="300px"
                    overflowY="scroll"
                >
                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="2">
                        {videos.map(video => {
                            const fileName = video ? video.url.substring(video.url.lastIndexOf("/") + 1) : null;

                            return (
                                <Pill key={video.id} video={video}>
                                    <Flex
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Box>
                                            <Text marginBottom="-1">{video.name}</Text>
                                            <Text color="muted" fontSize="12">{fileName}</Text>
                                        </Box>

                                        <Flex gap="4" alignItems="center">
                                            <EditIcon onClick={(e) => onEdit(e, video)} />
                                            <CloseIcon fontSize="14" onClick={(e) => onRemove(e, video)} />
                                        </Flex>
                                    </Flex>
                                </Pill>
                            )
                        })}
                        <Pill alignItems="center" video={null}>
                            <Text>None</Text>
                        </Pill>
                    </SimpleGrid>
                </Stack>

                <Box>
                    <Button
                        variant="ghost"
                        color="green"
                        fontSize="14"
                        height="8"
                        onClick={() => onUploadModalOpen()}
                    >
                        + Upload Video
                    </Button>
                </Box>
            </Stack>

            <Stack spacing="1">
                <InputContainer
                    error={findErrorMessage("isControlsShown")}
                >
                    <Switch
                        colorScheme="purple"
                        isChecked={isControlsShown}
                        onChange={(e) => clearErrorAndRun("isControlsShown", () => toggleVideoControls(e.target.checked))}
                    >
                        Show video controls
                    </Switch>
                </InputContainer>

                {/* <InputContainer
                    error={findErrorMessage("isTimeShown")}
                >
                    <Switch
                        colorScheme="purple"
                        isChecked={isTimeShown}
                        disabled={screen.deviceType === DeviceType.TABLET}
                        onChange={(e) => clearErrorAndRun("isTimeShown", () => setIsTimeShown(e.target.checked))}
                    >
                        Show time
                    </Switch>
                </InputContainer> */}
            </Stack>

            <UploadVideoDrawer
                screenId={screen?.id}
                isOpen={isUploadModalOpen}
                onClose={onUploadModalClose}
                onSuccess={() => fetchVideos()}
            />
            <EditVideoDrawer
                screenId={screen.id}
                video={selectedVideo}
                isOpen={isUpdateModalOpen}
                onClose={onUpdateModalClose}
                onSuccess={() => router.push(`/screens/${screen?.id}`)}
            />
        </Stack>
    )
}