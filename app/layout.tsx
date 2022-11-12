import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import Script from "next/script";
import { getUserData } from "../pages/api/user/info";
import { Property } from "../types/session";
import { ClientLayout } from "./clientLayout";

// Import CSS files
import "./globals.scss";
import "./search.scss";

async function getSessionData() {
  const cookie = cookies();
  const token: any = cookie.get("token");

  if (!token) {
    return {
      user: null,
      properties: null,
    };
  }

  const { accessToken } = jwt.verify(
    token.value,
    process.env.SECRET_COOKIE_PASSWORD
  );
  const { user }: any = await getUserData(accessToken);

  // Current selected property
  const property =
    user.properties.find((property: Property) => property.selected) ||
    user.properties[0];

  return {
    user: user,
    property: property,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, property } = await getSessionData();

  const headersInstance = headers();
  if (
    !user
    //  && !headersInstance.get("referer")?.includes("/auth")
  ) {
    redirect("/auth");
  }

  return !user ? (
    <>Please login</>
  ) : (
    <html>
      <head>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PPH4TH4');
         `}
        </Script>
        <link rel="preconnect" href="https://i.ibb.co" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
        <link rel="preconnect" href="https://ouch-cdn2.icons8.com" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://ouch-cdn2.icons8.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,200&display=block"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,200&display=block"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=block"
          rel="stylesheet"
        />
        <meta name="description" content="Carbon user dashboard" />
        <meta name="theme-color" content="#fff" />
        <link
          rel="apple-touch-icon"
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/img/logo/apple-touch-icon/apple-touch-icon.png"
        />
        <meta name="mobile-web-app-capable" content="yes" />
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
          href="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@master/v2/rounded.png"
          rel="shortcut icon"
        />
        <link href="/manifest.json" rel="manifest" />
      </head>
      <body>
        <ClientLayout user={user} property={property}>
          {children}
        </ClientLayout>

        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PPH4TH4" height="0" width="0" style="display: none; visibility: hidden;" />`,
          }}
        />
        <Script src="/prevent-navigate-history.js" />
      </body>
    </html>
  );
}
