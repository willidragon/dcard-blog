import type { Metadata } from "next";
import { getServerSession } from "next-auth";

import SessionProvider from "./providers/SessionProvider";
import { options } from "./api/auth/[...nextauth]/options";

export const metadata: Metadata = {
  title: "Github Issue Blog",
  description: "",
};

export default async function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(options);

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
