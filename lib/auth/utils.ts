import { db } from "@/lib/db/index";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { redirect } from "next/navigation";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/lib/env.mjs"
import { UserRole } from "@prisma/client";
import { APP_PATH } from "@/config/path";

const placeholderUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCU383wdXdALpZtQtXaVR9dMxlIWCAxXnkmw&s";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      companies: AuthSessionCompanies[];
      selectedCompanyId: string | null;
    };
  }
}

export type AuthSessionCompanies = {
  companyId: string;
  companyName: string;
  companyLogo?: string;
  role: UserRole;
}

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
      companies: AuthSessionCompanies[];
      selectedCompanyId: string | null;
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
  session:{
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if(user){
        const userData = await db.user.findUnique({
          where: {
            email: user.email as string
          }
        });
        if(!userData) return token;
        token.id = userData.id;

        token.selectedCompanyId = token.selectedCompanyId || null;
      }
      if (trigger === "update" && session?.user.selectedCompanyId) {
        token.selectedCompanyId = session.user.selectedCompanyId;
      }
      return token; 
    },
    session: async ({ session, token }) => {
      const userCompanies = await db.userCompany.findMany({
        where: {
          userId: token.id as string,
          isEnabled: true
        },
        include: {
          company: true
        }
      })
      session.user.id = token.id as string;
      
      session.user.companies = userCompanies.map(uc => ({
        companyId: uc.companyId,
        companyName: uc.company.name,
        role: uc.role,
        companyLogo: placeholderUrl
      }));

      session.user.selectedCompanyId = token.selectedCompanyId as string | null;

      return session;
    },
    redirect: () => APP_PATH.public.signin
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

