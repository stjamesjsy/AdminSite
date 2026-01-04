import { theme as proTheme } from "@chakra-ui/pro-theme";
import { extendTheme } from "@chakra-ui/react";

const config = {
    initialColorMode: "light",
    useSystemColorMode: false
}

const fonts = {
    heading: `'Lexend', sans-serif`,
    body: `'Lexend', sans-serif`,
}

const colors = {
    brand: {
        secondary: "#422AFB",
        secondaryDark: "#1B254B",
        sidebarDark: "#191f2b",
        bgDark: "#24292e",
        heading: "#1B2559",
        text: "#707EAE",

        yellow: "#d5b41f",
        pink: "#F2779A",
        purple: "#6B46C1"
    },
    buttons: {
        purple: { // Primary
            500: "#6B46C1", // normal
            600: "#5c39ac", // hover
            700: "#5c39ac", // active
        },
        black: {
            500: "#2c3032", // normal
            600: "#161819", // hover
            700: "#161819" // active
        }
    }
}

const theme = extendTheme({ config, fonts, colors }, proTheme);

export default theme;