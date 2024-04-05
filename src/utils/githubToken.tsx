import { useSession } from "next-auth/react";

/**
 * Retrieves the access token from the current session.
 *
 * @returns The access token as a string if it exists in the session, otherwise undefined.
 */
export const getAccessToken = () => {
  const { data: session } = useSession();
  return session?.access_token!;
};

export default getAccessToken;
