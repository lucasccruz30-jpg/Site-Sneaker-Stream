import { UserRole } from "@prisma/client";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators/auth";

const providers: Array<ReturnType<typeof Credentials> | ReturnType<typeof Google>> = [];

providers.push(
  Credentials({
    name: "E-mail e senha",
    credentials: {
      email: { label: "E-mail", type: "email" },
      password: { label: "Senha", type: "password" },
    },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse(credentials);

      if (!parsed.success) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email },
      });

      if (!user?.passwordHash) {
        return null;
      }

      const validPassword = await compare(parsed.data.password, user.passwordHash);

      if (!validPassword) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      };
    },
  }),
);

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existingUser = await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name ?? user.email.split("@")[0],
            image: user.image,
          },
          create: {
            email: user.email,
            name: user.name ?? user.email.split("@")[0],
            image: user.image,
            role: UserRole.CUSTOMER,
          },
        });

        user.id = existingUser.id;
        user.role = existingUser.role;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        if (!token.sub && user.id) {
          token.sub = user.id;
        }
      }

      if (!token.role && token.sub) {
        const currentUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        });

        token.role = currentUser?.role ?? UserRole.CUSTOMER;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as UserRole) ?? UserRole.CUSTOMER;
      }

      return session;
    },
  },
  trustHost: true,
});
