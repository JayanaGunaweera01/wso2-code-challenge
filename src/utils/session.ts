import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { Session, getServerSession } from "next-auth";

export async function getNextAuthServerSession(
  context: Pick<GetServerSidePropsContext<any, any>, "req" | "res">
) {
  return await getServerSession(context.req, context.res, authOptions);
}

export function getUserIdFromSeesion(session: Session | null): string | null {
  return (session as any)?.user?.id || null;
}
