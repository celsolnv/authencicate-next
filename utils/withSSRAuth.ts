import { AuthTokenError } from "./../services/erros/AuthTokenError";
import { destroyCookie, parseCookies } from "nookies";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
export function withSSRAuth<P>(fn: GetServerSideProps<P>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    if (!cookies["next-auth.token"]) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    try {
      return await fn(ctx);
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, "next-auth.token");
        destroyCookie(ctx, "next-auth.refreshToken");
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    }
  };
}
