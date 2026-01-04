import { Flex, Heading, Link, SimpleGrid, Text } from "@chakra-ui/react";
import { Movie, People, SvgIconComponent, Tv } from "@mui/icons-material";
import { getServerSession } from "next-auth";
import { useEffect } from "react";
import { Page } from "../components/ui/Page";
import { checkUserRoleLower, UserRole } from "../models/enums/UserRole";
import { checkAuthenticated, getApiKey, processServerError } from "../utils/serverUtils";
import { authOptions } from "./api/auth/[...nextauth]";
import NextLink from "next/link";

interface PageLinkProps {
    text: string;
    href: string;
    icon: SvgIconComponent;
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

export default function Index({ apiKey, session }: any) {

    useEffect(() => {
        if (apiKey) {
            localStorage.setItem("apiKey", apiKey);
        }
    }, []);

    return (
        <Page title="Home" session={session}>
            <Heading size={{ base: "sm", md: "md" }} marginBottom="10">St James Admin</Heading>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing="4">
                {(session?.user?.isSuperAdmin || !checkUserRoleLower(session?.user?.role, UserRole.ADMIN)) && (
                    <PageLink text="Users" href="/users" icon={People} />
                )}
                <PageLink text="Screens" href="/screens" icon={Tv} />
                <PageLink text="All Videos" href="/videos" icon={Movie} />
            </SimpleGrid>
        </Page>
    )
}

function PageLink({ text, href, icon }: PageLinkProps) {
    const Icon = icon;

    return (
        <Link
            href={href}
            _hover={{ textDecoration: "none" }}
            as={NextLink}
        >
            <Flex
                border="1px solid"
                borderColor="gray.200"
                borderRadius="12"
                bgColor="white"
                padding="6"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                _hover={{
                    cursor: "pointer",
                    bgColor: "blue.50",
                    borderColor: "black"
                }}
            >
                <Icon />
                <Text fontSize="20">{text}</Text>
            </Flex>
        </Link>
    )
}