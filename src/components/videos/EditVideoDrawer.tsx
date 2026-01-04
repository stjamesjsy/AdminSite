import { Button, DrawerBody, Input, Link, Stack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useErrorHandling from "../../hooks/useErrorHandling";
import { Video } from "../../models/Video";
import { newApiRequest } from "../../utils/clientUtils";
import { Drawer, DrawerFooter } from "../ui/Drawer";
import { InputContainer } from "../ui/InputContainer";

interface Props {
    isOpen: any;
    onClose: any;
    onSuccess: any;
    screenId?: string;
    video: Video;
}

export function EditVideoDrawer({ isOpen, onClose, onSuccess, screenId, video }: Props) {
    const [name, setName] = useState("");
    const [summary, setSummary] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const toast = useToast();
    const router = useRouter();
    const { findErrorMessage, clearErrorAndRun, clearErrors, handleApiError } = useErrorHandling();

    useEffect(() => {
        clearErrors();
        setName(video?.name ?? "");
        setSummary(video?.summary ?? "");
        setAuthor(video?.author ?? "");
        setUrl(video?.url ?? "");
    }, [isOpen]);

    async function updateVideo() {
        try {
            const response = await newApiRequest("POST", `/videos/${video?.id}`, { 
                name, summary, author, url 
            });

            if (await handleApiError(response)) {
                onSuccess();
                onClose();
            }
        } catch (e: any) {
            toast({ title: e.message, status: "error" });
        }
    }

    async function deleteVideo() {
        try {
            const response = await newApiRequest("DELETE", `/videos/${video?.id}`);

            if (await handleApiError(response)) {
                onSuccess();
                onClose();
            }
        } catch (e: any) {
            toast({ title: e.message, status: "error" });
        }
    }

    return (
        <Drawer
            title="Edit Video"
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

                    <Link target="_blank" href={video?.url}>View video</Link>
                </Stack>
            </DrawerBody>

            <DrawerFooter>
                <Button
                    colorScheme="red"
                    onClick={deleteVideo}
                    height="8"
                    marginRight="2"
                >
                    Delete
                </Button>

                <Button
                    colorScheme="purple"
                    onClick={updateVideo}
                    height="8"
                >
                    Edit
                </Button>
            </DrawerFooter>
        </Drawer>
    )
}