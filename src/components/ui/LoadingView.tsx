import { Center, Heading, Stack } from "@chakra-ui/react";
import Card from "./Card";
import { Page } from "./Page";

export function LoadingView() {
    return (
        <Page title="Loading">
            <Center>
                <Card padding="14" textAlign="center">
                    <Stack spacing="4">
                        <Heading size={{ base: "sm", md: "md" }}>Loading...</Heading>
                    </Stack>
                </Card>
            </Center>
        </Page>
    )
}