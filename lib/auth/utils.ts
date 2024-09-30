import { db } from "@/lib/db/index";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { redirect } from "next/navigation";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/lib/env.mjs"
import { APP_PATH } from "@/config/path";
import { UserRole } from "@prisma/client";

export type SelectedCompany = {
  id: string;
  name: string;
  image: string;
  role: UserRole;
}
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      selectedCompany: SelectedCompany | null;
    };
  }
}

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      selectedCompany: SelectedCompany | null;
    };
  } | null;
};

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    })
  ],
}

export const authOptions: NextAuthOptions = {
  ...authConfig,
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        const userData = await db.user.findUnique({
          where: {
            email: user.email as string
          }
        });
        if (!userData) return token;
        token.id = userData.id;

        token.selectedCompany = token.selectedCompany || null;
      }
      if (trigger === "update" && session?.user.selectedCompany) {
        token.selectedCompany = session.user.selectedCompany;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id as string;

      session.user.selectedCompany = token.selectedCompany as SelectedCompany | null;

      return session;
    },
    redirect: () => APP_PATH.protected.dashboard.root
  }
};


export const getUserAuth = async () => {
  const session = await getServerSession(authOptions);
  return { session } as AuthSession;
};

export const checkAuth = async () => {
  const { session } = await getUserAuth();
  if (!session) redirect("/api/auth/signin");
};

