import { Button, Container, Flex } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { PropsWithChildren } from "react";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
    session?: any;
}

export default function AppLayout({
    children,
    session,
}: PropsWithChildren<AppLayoutProps>) {
    return (
        <>
            <Flex
                bgColor="black"
                color="white"
                width="100%"
                height="30px"
                paddingY="1"
                paddingX="8"
            >
                <Button
                    variant="link"
                    onClick={() => signOut()}
                    marginLeft="auto"
                    color="white"
                    _hover={{
                        color: "white",
                        textDecoration: "underline",
                    }}
                >
                    Sign Out
                </Button>
            </Flex>

            <Flex flexDirection={{ base: "column", lg: "row" }} height="calc(100vh - 30px)">
                <Sidebar session={session} />

                <Container
                    height="100%"
                    overflowY="auto"
                    paddingTop="30px"
                    marginBottom="30px"
                    paddingLeft={{ base: "10px", "2xl": "60px" }}
                    paddingRight={{ base: "10px", "2xl": "420px" }}
                    maxWidth={{ base: "80rem", "2xl": "105rem" }}
                    width="100%"
                >
                    {children}
                </Container>
            </Flex>
        </>
    );
}
