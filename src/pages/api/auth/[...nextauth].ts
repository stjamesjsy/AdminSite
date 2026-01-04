import { compare } from "bcrypt";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { pool } from "../../../database";
import { UserRole } from "../../../models/enums/UserRole";
import { RowDataPacket } from "mysql2";

interface ICredentials {
    email: string;
    password: string;
}

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    secret: "Ey7nTKnggBc0bRN8WUjyShw2qzOZ6KW4fUyqcKBePxY=",
    session: {
        // @ts-expect-error
        jwt: true
    },
    jwt: {
        secret: "Ey7nTKnggBc0bRN8WUjyShw2qzOZ6KW4fU="
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req: any): Promise<any> {
                try {
                    const [user] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE username = ?", [credentials.username]);

                    if (user.length === 0) {
                        throw new Error("User doesn't exist");
                    }
                    if (user[0].role === UserRole.NONE && !user[0].isSuperAdmin) {
                        throw new Error("You do not have permission to access this site");
                    }

                    const passwordIsCorrect = await compare(credentials.password, user[0].password);

                    if (!passwordIsCorrect) {
                        throw new Error("Incorrect password");
                    }
                    return user[0];
                } catch (e: any) {
                    throw new Error("Failed to login: " + e.message);
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }: any) {
            const [user] = await pool.execute<RowDataPacket[]>("SELECT * FROM users WHERE username = ?", [token?.user?.username]);

            if (user.length !== 0) {
                session.user = user[0];
                session.user.password = undefined;
                return session;
            }
            return null;
        },
        async signIn({ user, account, profile }: any) {
            return true;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.user = user;
            }
            return token;
        }
    },
    events: {
        async signOut({ token }: any) {

        },
        async linkAccount({ user, account, profile }: any) {
            console.log("Link account")
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    }
}
export default NextAuth(authOptions)