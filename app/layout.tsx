import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserData } from "../pages1/api/user/info";
import { ClientLayout } from "./clientLayout";

async function getSessionData(providedToken: any) {
  const { accessToken } = jwt.verify(
    providedToken,
    process.env.SECRET_COOKIE_PASSWORD
  );
  const token: string = accessToken;
  const info = await getUserData(token);

  console.log(info);
  return JSON.parse(JSON.stringify(info));
}

export default async function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const nextCookies = cookies();
  const token: any = nextCookies.get("token");
  const session = await getSessionData(token.value);
  if (!session) {
    redirect("/auth");
  }
  const theme = session.user.darkMode ? "dark" : "light";

  return <ClientLayout session={session}>{children}</ClientLayout>;
}
