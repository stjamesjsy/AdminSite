import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { Tv } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Card from "../../ui/Card";
import { DeviceType } from "../../../models/enums/DeviceType";
import { Screen } from "../../../models/Screen";

interface Props {
    screen: Screen;
    onChange: ({ videoType }: any) => void;
}

interface VideoCardProps {
    icon: any;
    text: string;
    active: boolean;
    onSelect: () => void;
}

export function GeneralSettings({ screen, onChange }: Props) {
    const [videoType, setVideoType] = useState(`screen.videoType ?? VideoType.Adverts`);

    // Update when any value is changed
    useEffect(() => handleChange(), [videoType]);

    const handleChange = () => {
        onChange({
            videoType
        });
    }

    /**
     * Checks if the screen supports karaoke based on the device type.
     */
    const supportsKaraoke = () => screen.deviceType === DeviceType.FIRE_STICK;

    return (
        <Stack spacing="4" marginTop="6">
            <Flex gap="2" flexWrap="wrap">
                <VideoCard
                    icon={<Tv />}
                    text="Videos"
                    active={true}
                    onSelect={() => setVideoType("video")}
                />
                {/* <VideoCard
                    icon={<Photo />}
                    text="Slideshow"
                    active={videoType === "slideshow"}
                    onSelect={() => setVideoType("slideshow")}
                />
                <VideoCard
                    icon={<Mic />}
                    text="Karaoke"
                    active={videoType === "karaoke"}
                    onSelect={() => setVideoType("karaoke")}
                />
                <VideoCard
                    icon={<Lyrics />}
                    text="Lyrics"
                    active={videoType === "lyrics"}
                    onSelect={() => setVideoType("lyrics")}
                />
                <VideoCard
                    icon={<Adjust />}
                    text="DJ"
                    active={videoType === "dj"}
                    onSelect={() => setVideoType("dj")}
                /> */}
            </Flex>

            <Box textAlign="right">
                <Button
                    colorScheme="purple"
                    height="8"
                    // onClick={() => updateSettings()}
                >
                    Update
                </Button>
            </Box>
        </Stack>
    )
}

function VideoCard({ icon, text, active, onSelect }: VideoCardProps) {
    return (
        <Card
            padding="4"
            border="1px solid"
            borderColor={active ? "black" : "gray.200"}
            borderRadius="16"
            textAlign="center"
            width="130px"
            _hover={{
                cursor: "pointer",
                bgColor: active ? "blue.100" : "gray.50"
            }}
            bgColor={active ? "blue.50" : "initial"}
            onClick={onSelect}
        >
            {icon}
            <Text>{text}</Text>
        </Card>
    )
}