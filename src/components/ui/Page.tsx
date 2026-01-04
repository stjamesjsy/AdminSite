import { Box, Button, Container, Flex, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
import { PropsWithChildren, useEffect } from "react";
import Sidebar from "./Sidebar";
import { signOut } from "next-auth/react";

interface Props {
    title: string;
    session?: any;
    hideSidebar?: boolean;
}

export function Page(props: PropsWithChildren<Props>) {
    const pageTitle = `${props.title} - St James Admin`;
    const isMobile = useBreakpointValue({ base: true, lg: false });

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
            </Head>

            {props.hideSidebar ? (
                <Container
                    marginTop="30px"
                    marginBottom="30px"
                    paddingLeft={{ base: "10px", "2xl": "60px" }}
                    paddingRight={{ base: "10px", "2xl": "130px" }}
                    width="100%"
                >
                    {props.children}
                </Container>
            ) : (
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
                                textDecoration: "underline"
                            }}
                        >
                            Sign Out
                        </Button>
                    </Flex>
                    <Flex
                        flexDirection={{ base: "column", lg: "row" }}
                        height="100%"
                    >
                        <Sidebar
                            session={props.session}
                        />
                        <Container
                            height="calc(100vh - 60px)"
                            overflowY="scroll"
                            paddingTop="30px"
                            marginBottom="30px"
                            paddingLeft={{ base: "10px", "2xl": "60px" }}
                            paddingRight={{ base: "10px", "2xl": "420px" }}
                            maxWidth={{ base: "80rem", "2xl": "105rem" }}
                            width="100%"
                        >
                            {props.children}
                        </Container>
                    </Flex>
                </>
            )}
        </>
    )
}