import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface CardProps {
    className?: string;
}

export function Card(props: PropsWithChildren<CardProps & BoxProps>) {
    return (
        <Box
            position="relative"
            bgColor="white"
            border="1px solid #e8e9ec"
            borderRadius="8px"
            {...props}
            boxShadow="none"
        >
            <div>
                {props.children}
            </div>
        </Box>
    )
}

export default Card;