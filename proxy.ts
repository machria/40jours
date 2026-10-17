import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
    // Seules ces routes dépendent de la session (cf. authorized() dans auth.config.ts) :
    // inutile de déchiffrer le JWT à chaque navigation sur les autres pages.
    matcher: ["/dashboard/:path*", "/login"],
};
