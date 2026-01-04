import { Box, Button, Flex, Heading, Stack, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { Delete } from "@mui/icons-material";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import { ErrorView } from "../../components/ui/ErrorView";
import { Page } from "../../components/ui/Page";
import { EditVideoDrawer } from "../../components/videos/EditVideoDrawer";
import { UploadVideoDrawer } from "../../components/videos/UploadVideoDrawer";
import useErrorHandling from "../../hooks/useErrorHandling";
import { Video } from "../../models/Video";
import { UserRole } from "../../models/enums/UserRole";
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

export default function Videos(props: Props) {
    const { isOpen: isUploadModalOpen, onOpen: onUploadModalOpen, onClose: onUploadModalClose } = useDisclosure();
    const { isOpen: isUpdateModalOpen, onOpen: onUpdateModalOpen, onClose: onUpdateModalClose } = useDisclosure();

    const [selectedVideo, setSelectedVideo] = useState<any>();
    const [videos, setVideos] = useState<Video[]>([]);

    const router = useRouter();
    const toast = useToast();
    const { handleApiError } = useErrorHandling();

    useEffect(() => {
        if (!props.error) {
            fetchVideos();
        }
    }, []);

    useEffect(() => {
        if (props.apiKey) {
            localStorage.setItem("apiKey", props.apiKey);
        }
    }, []);

    async function fetchVideos() {
        try {
            const response = await newApiRequest("GET", "/videos");

            if (await handleApiError(response)) {
                const data = await response.json();
                setVideos(data);
            }
        } catch (e: any) {
            toast({ title: "Failed to fetch videos", description: e.message, status: "error" });
        }
    }

    async function deleteAllVideos() {
        const shouldDelete = confirm("Are you sure you want to delete all videos?");

        if (shouldDelete) {
            videos.forEach(async video => await deleteVideo(video.id));
            fetchVideos();
            toast({ title: "Videos deleted", status: "success", duration: 1500 });
        }
    }

    async function deleteVideo(videoId: string) {
        try {
            const response = await newApiRequest("DELETE", `/videos/${videoId}`);

            if (await handleApiError(response)) {
                return true;
            }
        } catch (e: any) {
            return false;
        }
    }

    if (props.error) {
        return <ErrorView error={props.error} session={props.session} />
    }

    return (
        <Page title="Videos" session={props.session}>
            <Heading size="sm">Videos</Heading>
            <Text>All videos across all screens.</Text>

            <Flex gap="2" marginTop="2">
                <Button
                    onClick={onUploadModalOpen}
                    height="8"
                >
                    + Upload Video
                </Button>

                {props.session?.user?.isSuperAdmin ? (
                    <Button
                        onClick={deleteAllVideos}
                        height="8"
                        colorScheme="red"
                        leftIcon={<Delete />}
                    >
                        Delete All Videos
                    </Button>
                ) : false}
            </Flex>

            <Stack spacing="2" marginTop="4">
                {videos.map(video => {
                    return (
                        <Card
                            paddingX="4"
                            paddingY="2"
                            width="100%"
                            _hover={{
                                cursor: "pointer",
                                bgColor: "blue.50",
                                border: "1px solid black"
                            }}
                            onClick={() => {
                                setSelectedVideo(video);
                                onUpdateModalOpen();
                            }}
                        >
                            <Text fontWeight="bold" fontSize="16">{video.name}</Text>
                            <Text fontSize="14">Author: {video.author}</Text>
                            <Text fontSize="14">Summary: {video.summary}</Text>
                            <Text color="muted" fontSize="12">{video.screens.length === 0 ? "(No screens)" : video.screens.join(", ")}</Text>
                        </Card>
                    );
                })}
            </Stack>

            <UploadVideoDrawer
                isOpen={isUploadModalOpen}
                onClose={onUploadModalClose}
                onSuccess={() => fetchVideos()}
            />
            <EditVideoDrawer
                video={selectedVideo}
                isOpen={isUpdateModalOpen}
                onClose={onUpdateModalClose}
                onSuccess={() => { }}
            />
        </Page>
    )
}