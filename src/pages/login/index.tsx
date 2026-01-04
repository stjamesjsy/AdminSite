import { AbsoluteCenter, Badge, Box, Button, Flex, Heading, Input, Stack, Text, useToast } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import { InputContainer } from "../../components/ui/InputContainer";
import { Page } from "../../components/ui/Page";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const toast = useToast();
    const router = useRouter();
    
    useEffect(() => {
        if (router?.query?.error) {
            toast({
                title: router.query.error,
                position: "bottom",
                status: "error"
            });
            window.history.replaceState(null, "", "login");
        }
    }, [router.query]);

    const logIn = () => signIn("credentials", { username, password, callbackUrl: `${window.location.origin}` });

    return (
        <Page title="Sign In">
            <Flex
                marginTop="10"
                justifyContent="center"
            >
                <Box
                    bgColor="purple.600"
                    borderRadius="12"
                    color="white"
                    width="fit-content"
                    paddingX="4"
                    paddingY="1"
                >
                    <Text fontSize="20" fontWeight="bold">St James Admin</Text>
                </Box>
            </Flex>

            <Box
                position="relative"
                height="40vh"
                marginTop="60px"
                marginBottom="60px"
            >
                <AbsoluteCenter axis="both" width={{ base: "100%", md: "500px" }}>
                    <Card padding="10">
                        <Heading size="md" mb="4">Sign In</Heading>

                        <Stack spacing="6">
                            <InputContainer label="Username">
                                <Input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)} 
                                />
                            </InputContainer>

                            <Stack>
                                <InputContainer label="Password">
                                    <Input
                                        type="password"
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                logIn();
                                            }
                                        }}
                                    />
                                </InputContainer>
                            </Stack>

                            <Button
                                colorScheme="buttons.black"
                                color="white"
                                fontSize="18"
                                onClick={logIn}
                            >
                                Log In
                            </Button>
                        </Stack>
                    </Card>
                </AbsoluteCenter>
            </Box>

            <Text textAlign="center" color="muted">
                Unauthorized access is strictly prohbited
            </Text>
        </Page>
    )
}

// Hide the sidebar
Login.getLayout = (page: ReactElement) => page;

export default Login;