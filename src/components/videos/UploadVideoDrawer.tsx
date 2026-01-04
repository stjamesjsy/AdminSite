import { Button, DrawerBody, FormHelperText, Input, Link, Stack, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useErrorHandling from "../../hooks/useErrorHandling";
import { newApiRequest } from "../../utils/clientUtils";
import googleCloud from "../../utils/googleCloud";
import { Drawer, DrawerFooter } from "../ui/Drawer";
import FileUploadArea from "../ui/FileUploadArea";
import { InputContainer } from "../ui/InputContainer";

interface Props {
    isOpen: any;
    onClose: any;
    onSuccess: any;
    screenId?: string;
}

type UploadState = null | "uploading" | "uploaded" | "failed";

export function UploadVideoDrawer({ isOpen, onClose, onSuccess, screenId }: Props) {
    const [name, setName] = useState("");
    const [summary, setSummary] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");
    const [videoState, setVideoState] = useState<UploadState>(null)

    const toast = useToast();
    const router = useRouter();
    const { findErrorMessage, clearErrorAndRun, clearErrors, handleApiError } = useErrorHandling();

    useEffect(() => {
        clearErrors();
        setName("");
        setSummary("");
        setAuthor("");
        setUrl("");
        setVideoState(null)
    }, [isOpen]);

    async function createVideo() {
        try {
            const response = await newApiRequest("POST", `/videos/new`, { 
                name, summary, author, url
            });

            if (await handleApiError(response)) {
                const data = await response.json();

                if (data?.id && screenId) {
                    assignVideo(data?.id);
                }
            }
        } catch (e: any) {
            toast({ title: e.message, status: "error" });
        }
    }

    async function assignVideo(videoId: string) {
        try {
            const response = await newApiRequest("POST", `/screens/${screenId}/videos/new`, { screenId, videoId });

            if (await handleApiError(response)) {
                onSuccess();
                onClose();
            }
        } catch (e: any) {
            toast({ title: e.message, status: "error" });
        }
    }

    function UploadStatus({ state, url }: { state: UploadState, url: string }) {
        switch (state) {
            case "uploading":
                return <Text color="orange">Uploading...</Text>
            case "uploaded":
                return <Link color="green" href={url} target="_blank">Uploaded (view)</Link>
            case "failed":
                return <Text color="red">Failed</Text>
            default:
                return <></>;
        }
    }

    function isCompleted() {
        return name !== "" && url !== "";
    }

    return (
        <Drawer
            title="Upload Video"
            isOpen={isOpen}
            onClose={onClose}
        >
            <DrawerBody>
                <Stack spacing="6" marginBottom="6">
                    <InputContainer
                        label="Name"
                        error={findErrorMessage("name")}
                        isRequired
                    >
                        <Input
                            value={name}
                            onChange={(e) => clearErrorAndRun("name", () => setName(e.target.value))}
                        />
                    </InputContainer>

                    <InputContainer>
                        <FileUploadArea
                            initialText="Select video"
                            accept="video/mp4"
                            onUpload={(e: any) => {
                                try {
                                    googleCloud.handleFileUpload(e, {
                                        onBeginUpload: () => setVideoState("uploading"),
                                        onFailedUpload: () => setVideoState("failed"),
                                        onFinishUpload: (url: string) => {
                                            setVideoState("uploaded");
                                            setUrl(url);
                                        }
                                    });
                                } catch (e: any) {
                                    toast({
                                        title: e.message,
                                        status: "error"
                                    });
                                }
                            }}
                        />

                        <FormHelperText>
                            <UploadStatus state={videoState} url={url} />
                        </FormHelperText>
                    </InputContainer>
                </Stack>
            </DrawerBody>

            <DrawerFooter>
                <Button
                    colorScheme="purple"
                    isDisabled={!isCompleted()}
                    onClick={createVideo}
                    height="8"
                >
                    Create
                </Button>
            </DrawerFooter>
        </Drawer>
    )
}