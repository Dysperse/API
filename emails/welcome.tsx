import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Font } from "@react-email/font";

interface EmailProps {
  name?: string;
  email?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const WelcomeEmail = ({
  name = "[name]",
  email = "[email]",
}: EmailProps) => {
  const previewText = `You're part of the #dysperse family!`;

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Space Grotesk"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded-2xl my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44b.png`}
                width="50"
                height="50"
                alt="Vercel"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Welcome to Dysperse!
            </Heading>
            <Text className="text-black text-[17px] leading-[20px] -mb-2">
              Hey <strong>{name}</strong>,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              You&apos;re now part of the{" "}
              <Link
                href="https://instagram.com/tags/dysperse"
                target="_blank"
                className="text-blue-600 no-underline"
              >
                #dysperse
              </Link>{" "}
              family. We literally can&apos;t wait to see how you grow with
              Dysperse!
            </Text>
            <Section className="my-[32px] text-center">
              <Button
                pX={20}
                pY={12}
                className="bg-[#000000] rounded-full text-white text-[12px] font-semibold no-underline text-center"
                href="https://my.dysperse.com"
              >
                Check out my dashboard
              </Button>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Section className="my-[32px]">
              <Text className="text-gray-700 text-[17px] leading-[24px]">
                Lost? Here are some articles to help you get started...
              </Text>
              {[
                {
                  name: "How do sync Dysperse with Canvas?",
                  href: "https://blog.dysperse.com/integrating-your-canvas-dashboard-with-dysperse",
                },
                {
                  name: "How do I install Dysperse on my device?",
                  href: "https://blog.dysperse.com/installing-dysperse-on-your-device",
                },
                {
                  name: "View more...",
                  href: "https://blog.dysperse.com",
                },
              ].map((link) => (
                <Button
                  key={link.name}
                  className="text-gray-500 text-[14px] underline leading-[24px] block"
                  href={link.href}
                >
                  {link.name} ↗
                </Button>
              ))}
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px] italic">
              This email was intended for{" "}
              <span className="text-black">{email}</span>. Dysperse staff will
              never ask for your password. If you&apos;re concerned about your
              account&apos;s security, contact us at{" "}
              <Link
                href="mailto:hello@dysperse.com"
                className="text-blue-600 no-underline"
              >
                helo@dysperse.com
              </Link>{" "}
              right away.Since this is an important update regarding your
              account you cannot unsubscribe from these updates.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
