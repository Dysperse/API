/* eslint-disable @next/next/no-page-custom-font */
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useColor as getColor } from "@/lib/client/useColor";
import { getUserData } from "@/lib/server/getUserData";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Script from "next/script";
import ClientLayout from "./client-layout";
import "./global.scss";

export const metadata = {
  title: "Dysperse",
  description: "Dysperse dashboard",
  applicationName: "Dysperse",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getSession();

  const themeColor = data?.user?.color || "violet";
  const palette = getColor(themeColor, data.user.darkMode);

  const s = {
    ...data,
    themeColor,
    darkMode: data.user.darkMode,
  };

  return (
    <html lang="en">
      <head>
        {/* Preconnect */}
        <link rel="preconnect" href="https://assets.dysperse.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />

        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />

        {/* Preload */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />

        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com/" />

        <link rel="prefetch" href="/" />
        <link rel="prefetch" href="/tasks/home" />
        <link rel="prefetch" href="/rooms" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=League+Gothic&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no, interactive-widget=resizes-content, viewport-fit=cover"
        />
        <link
          rel="shortcut icon"
          href="https://assets.dysperse.com/v9/android/android-launchericon-48-48.png"
        />
        <meta name="theme-color" content={palette[1]} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="description" content="Dysperse dashboard" />
        <meta name="theme-color" content="#fff" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="hsl(240,11%,10%)"
        />
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        {[57, 72, 76, 114, 120, 144, 152, 180].map((size) => (
          <link
            key={size}
            rel="apple-touch-icon"
            sizes={`${size}x${size}`}
            href={`https://assets.dysperse.com/v9-ios/${size}.png`}
          />
        ))}
        <link href="/manifest.json" rel="manifest" />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KFJ4BEE09N"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-KFJ4BEE09N');
        `}
        </Script>
      </head>
      <body
        style={{
          height: "100dvh",
          ["--toast-bg" as any]: addHslAlpha(palette[3], 0.8),
          ["--toast-text" as any]: palette[11],
          ["--toast-solid" as any]: palette[7],
          ["--bg" as any]: palette[1],
        }}
      >
        <ClientLayout session={s}>{children}</ClientLayout>
      </body>
    </html>
  );
}

async function getSession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    const { accessToken } = jwt.verify(
      token,
      process.env.SECRET_COOKIE_PASSWORD
    );

    const info = await getUserData(accessToken);
    return JSON.parse(JSON.stringify(info));
  } catch {
    return redirect("/auth");
  }
}
