import { Box, Divider, DrawerBody, Stack, StackDivider, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useErrorHandling from "../../hooks/useErrorHandling";
import { Video } from "../../models/Video";
import { newApiRequest } from "../../utils/clientUtils";
import { Drawer, DrawerFooter } from "../ui/Drawer";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    screenId?: string;
}

export function SelectVideoDrawer({ isOpen, onClose, onSuccess, screenId }: Props) {
    const [videos, setVideos] = useState<Video[]>([]);

    const toast = useToast();
    const router = useRouter();
    const { findErrorMessage, clearErrorAndRun, clearErrors, handleApiError } = useErrorHandling();

    useEffect(() => {
        clearErrors();
    }, [isOpen]);

    useEffect(() => {
        fetchVideos();
    }, [isOpen]);

    async function fetchVideos() {
        try {
            const response = await newApiRequest("GET", `/videos/not-in/${screenId}`);

            if (await handleApiError(response)) {
                const data = await response.json();
                setVideos(data);
            }
        } catch (e: any) {
            toast({ title: e.message, status: "error" });
        }
    }

    async function assignVideo(video: Video) {
        try {
            const response = await newApiRequest("POST", `/screens/${screenId}/videos/new`, {
                screenId,
                videoId: video.id
            });

            if (await handleApiError(response)) {
                onSuccess();
                onClose();
                toast({ title: "Video added", status: "success", duration: 1500 });
            }
        } catch (e: any) {
            toast({ title: e.message, status: "error" });
        }
    }

    return (
        <Drawer
            title="Select Video"
            isOpen={isOpen}
            onClose={onClose}
        >
            <DrawerBody>
                <Text>Click a video to add it to this screen</Text>
                <Divider marginTop="2" />
                <Stack
                    spacing="0"
                    divider={<StackDivider />}
                    marginTop="2"
                >
                    {videos.map(video => {
                        return (
                            <Box
                                paddingX="4"
                                paddingY="2"
                                width="100%"
                                _hover={{
                                    cursor: "pointer",
                                    bgColor: "blue.50",
                                    border: "1px solid black"
                                }}
                                onClick={() => assignVideo(video)}
                            >
                                <Text fontWeight="bold" fontSize="16">{video.name}</Text>
                                <Text fontSize="14" color="muted">{video.url.substring(video.url.lastIndexOf("/") + 1)}</Text>
                                <Box marginTop="2">
                                    {video.author && <Text fontSize="12"><strong>Author:</strong> {video.author}</Text>}
                                    {video.summary && <Text fontSize="12"><strong>Summary:</strong> {video.summary}</Text>}
                                </Box>
                            </Box>
                        );
                    })}
                </Stack>
            </DrawerBody>

            <DrawerFooter>
                {/* <Button
                    colorScheme="purple"
                    onClick={sendRequest}
                    height="8"
                >
                    Create
                </Button> */}
            </DrawerFooter>
        </Drawer>
    )
}