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
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
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
          href="/api/session"
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
          href="https://fonts.googleapis.com/css2?family=League+Gothic&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="description" content="Dysperse dashboard" />
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
        {[57, 72, 76, 114, 120, 144, 152, 180].map((size) => (
          <link
            key={size}
            rel="apple-touch-icon"
            sizes={`${size}x${size}`}
            href={`https://assets.dysperse.com/v6/ios/${size}.png`}
          />
        ))}
        <link href="/manifest.json" rel="manifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
