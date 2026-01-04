import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface CardProps {
    className?: string;
}

export const Card = (props: PropsWithChildren<CardProps & BoxProps>) => {
    return (
        <Box
            position="relative"
            backgroundColor={useColorModeValue("white", "rgb(53, 56, 64)")}
            border="1px solid #e8e9ec"
            borderRadius="8px"
            {...props}
        >
            <div>
                {props.children}
            </div>
        </Box>
    )
}

export default Card;