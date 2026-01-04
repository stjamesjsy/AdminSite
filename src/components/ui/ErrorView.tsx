import { Center, Heading, Stack, Text } from "@chakra-ui/react";
import { AppError } from "../../utils/exceptions/AppError";
import Card from "./Card";
import { Page } from "./Page";

interface Props {
    error: AppError;
    session: any
}

export function ErrorView({ error, session }: Props) {
    return (
        <Page title="Error" session={session}>
            <Center>
                <Card padding="14" textAlign="center">
                    <Stack spacing="2">
                        <Heading size={{ base: "sm", md: "md" }}>An error has occurred</Heading>
                        <Text fontSize="20">{error?.message}</Text>
                        <Text color="muted" fontSize="16">Status code: {error?.httpCode || 500}</Text>
                    </Stack>
                </Card>
            </Center>
        </Page>
    )
}