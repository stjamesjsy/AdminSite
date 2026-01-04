import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/lexend/300.css";
import App, { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { v4 as uuid } from "uuid";
import AppLayout from "../components/ui/AppLayout";
import "../global.css";
import theme from "../theme";

export type NextPageWithLayout = AppProps["Component"] & {
    getLayout?: (page: ReactElement) => ReactNode;
}

class MyApp extends App {

    render() {
        const { Component, pageProps } = this.props;

        if (typeof window !== "undefined") {
            // This is used to keep track of websocket responses from the client
            // TODO: Unused, remove?
            const adminSessionId = sessionStorage.getItem("adminSessionId");

            if (adminSessionId === undefined || adminSessionId === null) {
                sessionStorage.setItem("adminSessionId", uuid());
            }
        }

        const getLayout = (Component as NextPageWithLayout).getLayout ?? ((page) => (
            <AppLayout session={pageProps.session}>
                {page}
            </AppLayout>
        ));

        return (
            <ChakraProvider
                theme={theme}
                toastOptions={{
                    defaultOptions: {
                        position: "top-right",
                    },
                }}
            >
                {getLayout(<Component {...pageProps} />)}
            </ChakraProvider>
        )
    }
}

export default MyApp;