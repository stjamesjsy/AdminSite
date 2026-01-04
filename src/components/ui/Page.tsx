import Head from "next/head";
import { PropsWithChildren } from "react";

interface Props {
    title: string;
}

export function Page({ title, children }: PropsWithChildren<Props>) {
    return (
        <>
            <Head>
                <title>{title} - St James Admin</title>
            </Head>

            {children}
        </>
    );
}
