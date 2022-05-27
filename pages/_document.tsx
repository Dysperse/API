import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content="Smartlist user dashboard" />
        <meta name="theme-color" content="#fff" />
        <link
          rel="apple-touch-icon"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon-180x180.png"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@350;600;700;900&amp;display=swap"
          rel="stylesheet"
        />
        <link
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA4JJREFUaEPVmj1QE0EUx/8rEseCHHF0hkJGSyWW4lfjqIXS+QlWgCPQqKBQ8xVqUD5skBmRSkDBDi3EsQEFS4OUOtjpeFwsHA/DOm/JZULIJXtfSW6r5O7te++3b/ft1zG4UFT1z6FdKDkLoJoDYQacy6SWA+8YEAWwvIn4+1Bo7zen5pldBbEY34/4v3rOeTMYjtjSw7HKGHuCkt0TwSD7aUeHZYBEa3cAuGfHYJY6w5uI91uNiiUATf3bBbBelx1PU8e7ldCeiKwNKYD1df0443gM4ISsYodyS5zhTnl54FMuPTkBNFWvB/AslyKP3jcoocBENt1ZAWLqRjsH7/fIOSm1DKwjGCodMBM2BSgG5w2ns0FkBChwtzFr7IzdaQdAYsAuS8U3z0KcoTp9YO8A0FT9Yx6zjdUmWFJCgZOplbYB5CfPW/U5XX77PJEESMywX52qz0f9TcQPGzN2EkBT9SEPlgde8QwroUArKRcAtDDj8Y0fXlnzQi8rKT1AC8AtgCKYsKxCGnODANB+6V9sL4mtWnZLnmNV2Rc4yvw0eNPZaTAzL2fdmKYJm0FFcavd0/U0EMAwgLt2LSwsLAKMQSkrQ/hYOKmGnL9yrU78n3056RXECFtX9XmzPawMVEVFpRA7c/oUZmanxe/o5ygabzVhbe27+F9ZeRDjT8e2AcroziUj9tiaqvNcgtneGwDNzbfR19cjnKeWpwjU1V4XVSenXogIUCRSo+TErlHXFQBydHDoIZ5PTqOrq1c4H4l0o6WlSdgZHR0TzwmCnt+su+GG70KHYwByjhwl5++3tQuljwYHdjiZ671dIscAZLit9YHoJmXBIF7NTJl2E+pel6/W4ncsJgAJ1GlxDCDrvOGo2xC2AYw0SQ5VhatEy8vme6pLkViJrohoOUmzttIopUdKk+Q8pc/x8TFp541IEERjYxMWFj8ICEqzlG6tFCONWprI0tMkZR8nxeiCNtPsiOWlBLXc+QsXUVNzSeR9N0pnZw/m5l5j/u0bq5FssLWYIwjZ/i4LaEenWMyRAV8vpwnA9xsa328pRTfy86aeAPy0M8t4rLIVhXxcYMjmJTM5k4MtQ9zXR4sE4fvD3cSALuStjFnfkTteTy62iuiwy/IFRzFB2L5iShnUhexOzi75DAhfX7Omjqj8zBMeXHSnQvj6U4NUEN9+7JEpSRfyc5v/bnLetoY01pwAAAAASUVORK5CYII="
          rel="shortcut icon"
        />
        <link href="/manifest.webmanifest" rel="manifest" />
        <title>Smartlist</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
