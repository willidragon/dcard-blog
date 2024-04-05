"use client";

import { SessionProvider } from "next-auth/react";

interface ProviderProps {
  children: React.ReactNode;
  session: any;
}

export default function Provider({ children, session }: ProviderProps): React.ReactNode {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
