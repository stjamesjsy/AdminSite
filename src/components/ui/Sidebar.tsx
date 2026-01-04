import { Box, Flex, Image, Link, Stack, Text, Tooltip, useBreakpointValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiHome, FiMenu, FiTv, FiUsers, FiVideo } from "react-icons/fi";

export default function Sidebar({ session }: any) {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [firstRender, setFirstRender] = useState<boolean>(true);
    const [mobileShown, setMobileShown] = useState<boolean>(false);

    const isMobile = useBreakpointValue({ base: true, lg: false });

    useEffect(() => {
        const value = localStorage.getItem("sidebarCollapsed") === "true";
        setCollapsed(value);
        setFirstRender(false);
    }, []);

    useEffect(() => {
        if (!firstRender) {
            localStorage.setItem("sidebarCollapsed", collapsed.toString());
        }
    }, [collapsed]);

    return (
        <Box
            width={(collapsed && !isMobile) ? "80px" : "260px"}
            maxWidth={(collapsed && !isMobile) ? "80px" : "260px"}
            paddingX="4"
            paddingY="6"
            bgColor="gray.200"
            borderRightWidth="1px"
            position="relative"
            overflow="hidden"
            // height is viewport height - top bar height (in Page.tsx)
            height="calc(100vh - 30px)"
            color="black"
            style={isMobile ? {
                left: "0%",
                top: "0%",
                right: "0%",
                bottom: "auto",
                width: "100%",
                maxWidth: "100%",
                height: "auto",
                paddingTop: "5px",
                paddingBottom: "5px",
                borderBottom: "1px solid #bbbbbbff",
                zIndex: 10
            } : {}}
        >
            <Flex justifyContent="space-between" alignItems="center">
                <Flex alignItems="center" gap={2}>
                    {(isMobile) ? (
                        <>
                            <Image
                                src="/images/logo.png"
                                height="10"
                                width="10"
                                alt="Logo"
                            />
                            <Text fontWeight="bold" fontSize="xl">
                                St James
                            </Text>
                        </>
                    ) : (
                        <Text
                            fontWeight="bold"
                            fontSize="xl"
                            marginBottom="6"
                            paddingLeft={collapsed ? 0 : 3}
                        >
                            {collapsed ? (
                                <Image
                                    src="/images/logo.png"
                                    height="10"
                                    width="10"
                                    alt="Logo"
                                />
                            ) : (
                                "St James"
                            )}
                        </Text>
                    )}
                </Flex>

                {(isMobile) && (
                    <Box
                        position="relative"
                        padding="18px"
                        onClick={() => setMobileShown(!mobileShown)}
                        _hover={{ backgroundColor: "rgba(0, 0, 0, .04)" }}
                    >
                        <FiMenu />
                    </Box>
                )}
            </Flex>

            {(!isMobile || mobileShown) && (
                <Stack 
                    gap="1" 
                    height="100%"
                    marginTop={{ base: 2, lg: 0 }}
                >
                    <SidebarItem
                        icon={<FiHome />}
                        label="Home"
                        collapsed={collapsed}
                        href="/"
                    />
                    <SidebarItem
                        icon={<FiUsers />}
                        label="Users"
                        collapsed={collapsed}
                        href="/users"
                    />
                    <SidebarItem
                        icon={<FiTv />}
                        label="Screens"
                        collapsed={collapsed}
                        href="/screens"
                    />
                    <SidebarItem
                        icon={<FiVideo />}
                        label="All Videos"
                        collapsed={collapsed}
                        href="/videos"
                    />
                </Stack>
            )}

            {!isMobile && (
                <Box position="absolute" bottom="4" left="0" width="100%">
                    <SidebarItem
                        icon={collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                        label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        collapsed={collapsed}
                        onClick={() => setCollapsed(v => !v)}
                    />
                </Box>
            )}
        </Box>
    );
}

type SidebarItemProps = {
    icon: ReactNode;
    label: string;
    collapsed: boolean;
    href?: string;
    onClick?: () => void;
};

function SidebarItem({
    icon,
    label,
    collapsed,
    href,
    onClick
}: SidebarItemProps) {
    const isMobile = useBreakpointValue({ base: true, lg: false });

    const content = (
        <Flex
            align="center"
            gap="3"
            paddingX="3"
            paddingY="2"
            borderRadius="md"
            cursor="pointer"
            width="100%"
            _hover={{
                bgColor: "gray.300",
                color: "fg.default",
            }}
            onClick={onClick}
        >
            <Box fontSize="20px">{icon}</Box>
            {(!collapsed || isMobile) && <Text fontSize="sm">{label}</Text>}
        </Flex>
    );

    return (
        <Tooltip
            label={label}
            shouldWrapChildren={!!href}
            isDisabled={!collapsed}
            placement="right-end"
        >
            {href ? (
                <Link as={NextLink} href={href} style={{ textDecoration: "none" }}>
                    {content}
                </Link>
            ) : <Box width="100%">{content}</Box>}
        </Tooltip>
    );
}