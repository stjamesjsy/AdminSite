import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/lexend/300.css";
import App from "next/app";
import { v4 as uuid } from "uuid";
import "../global.css";
import theme from "../theme";

class MyApp extends App {

    render() {
        const { Component, pageProps } = this.props;

        if (typeof window !== "undefined") {
            // This is used to keep track of websocket responses from the client
            const adminSessionId = sessionStorage.getItem("adminSessionId");

            if (adminSessionId === undefined || adminSessionId === null) {
                sessionStorage.setItem("adminSessionId", uuid());
            }
        }

        return (
            <ChakraProvider
                theme={theme}
                toastOptions={{
                    defaultOptions: {
                        position: "top-right",
                    }
                }}
            >
                <Component {...pageProps} />
            </ChakraProvider>
        )
    }
}

export default MyApp;