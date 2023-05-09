import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

/**
 * Top-level component for the document.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
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
          href="/api/user"
          as="fetch"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />

        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com/" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Fraunces:wght@600;700;900&display=swap"
          rel="stylesheet"
        />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="description" content="Dysperse user dashboard" />
        <meta name="theme-color" content="#fff" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="hsl(240,11%,10%)"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no, interactive-widget=resizes-content"
        />
        <link
          rel="apple-touch-icon"
          href="https://assets.dysperse.com/v6/ios/57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="https://assets.dysperse.com/v6/ios/57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="https://assets.dysperse.com/v6/ios/72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="https://assets.dysperse.com/v6/ios/76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="https://assets.dysperse.com/v6/ios/114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="https://assets.dysperse.com/v6/ios/120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="https://assets.dysperse.com/v6/ios/144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="https://assets.dysperse.com/v6/ios/152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://assets.dysperse.com/v6/ios/180.png"
        />
        <link
          href="https://assets.dysperse.com/v5/windows11/SmallTile.scale-100.png"
          rel="shortcut icon"
        />
        <link href="/manifest.json" rel="manifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
