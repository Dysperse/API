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
  appleWebApp: {
    capable: true,
    title: "Dysperse",
    startupImage: [
      {
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)",
        url: "/ios-splash/2048x2732.png",
      },
      {
        media:
          "(device-width: 1284px) and (device-height: 2778px) and (-webkit-device-pixel-ratio: 3)",
        url: "/ios-splash/2048x2732.png",
      },
      {
        media:
          "(device-width: 1170px) and (device-height: 2532px) and (-webkit-device-pixel-ratio: 3)",
        url: "/ios-splash/2048x2732.png",
      },
      {
        media:
          "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)",
        url: "/ios-splash/1668x2388.png",
      },
      {
        media:
          "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)",
        url: "/ios-splash/1668x2224.png",
      },
      {
        media:
          "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)",
        url: "/ios-splash/1536x2048.png",
      },
      {
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)",
        url: "/ios-splash/1242x2688.png",
      },
      {
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)",
        url: "/ios-splash/828x1792.png",
      },
      {
        media:
          "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)",
        url: "/ios-splash/1125x2436.png",
      },
      {
        media:
          "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)",
        url: "/ios-splash/1242x2208.png",
      },
      {
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
        url: "/ios-splash/750x1334.png",
      },
      {
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
        url: "/ios-splash/640x1136.png",
      },
      {
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
        url: "/ios-splash/640x1136.png",
      },
    ],
  },
};
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
  spaceModal,
}: {
  spaceModal: any;
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
    <html
      lang="en"
      style={{
        background: palette[1],
      }}
    >
      <head>
        {/* Preconnect */}
        <link rel="preconnect" href="https://assets.dysperse.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="preconnect"
          href="https://use.typekit.net"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://use.typekit.net/vjj3nss.css" />

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
          href="https://assets.dysperse.com/v10/android/android-launchericon-48-48.png"
        />
        <meta name="theme-color" content={palette[1]} />
        <meta name="description" content="Dysperse dashboard" />
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
            href={`https://assets.dysperse.com/v10-ios/${size}.png`}
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
        }}
      >
        <ClientLayout session={s}>
          {spaceModal}
          {children}
          {/* <span className="font-heading">idk man</span> */}
        </ClientLayout>
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
