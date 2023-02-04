import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

/**
 * Top-level component for the document.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script id="google-analytics" strategy="afterInteractive" defer>
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PPH4TH4');
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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />

        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com/" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=DM+Serif+Display&display=swap"
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
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PPH4TH4" height="0" width="0" style="display: none; visibility: hidden;" />`,
          }}
        />
        <Script
          defer
          src="/prevent-navigate-history.js"
          strategy="afterInteractive"
        />
      </body>
    </Html>
  );
}
