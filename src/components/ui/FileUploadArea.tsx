import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { Component, useRef, useState } from "react";

interface FileUploadButtonProps {
    onUpload?(e: any): void;
    accept?: string;
    initialText?: string;
    buttonColorScheme?: string;
}

export type ImageState = null | "uploading" | "uploaded" | "failed";

const FileUploadArea = ({ onUpload, initialText, buttonColorScheme, ...rest }: FileUploadButtonProps) => {
    const ref = useRef<HTMLInputElement>(null);
    const [text, setText] = useState(initialText ?? "Upload File");

    const onChange = (e: any) => {
        if (onUpload) {
            onUpload(e);
        }
        if (e.target.files.length !== 0) {
            setText(e.target.files[0].name);
        }
    }

    return (
        <>
                <input
                    ref={ref}
                    onChange={onChange}
                    type="file"
                    style={{ display: "none" }}
                    {...rest}
                />
                <Flex
                    flexDirection="column"
                    border="1px solid"
                    borderColor="gray.100"
                    borderRadius="16"
                    justifyContent="center"
                    alignItems="center"
                    onClick={() => ref.current?.click()}
                    _hover={{ cursor: "pointer", borderColor: "black", bgColor: "blue.50" }}
                    paddingY="6"
                    paddingX="4"
                >
                    <Text>{text}</Text>
                </Flex>
            </>
    )
}

export default FileUploadArea;