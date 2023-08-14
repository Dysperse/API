import {
  Body,
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
  emoji: string;
  title: string;
  email: string;
  name: string;
  previewText: string;
  children: any;
}

export function EmailWrapper({
  emoji,
  title,
  email,
  name,
  previewText,
  children,
}: EmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Space Grotesk"
          fallbackFontFamily="Georgia"
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
          <Img
            src={`https://assets.dysperse.com/footer.png`}
            width={192}
            height={48}
            alt="Dysperse"
            className="my-10 mx-auto text-center"
          />
          <Container className="border border-solid border-[#eaeaea] rounded-2xl my-[40px] mt-0 mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
                width="50"
                height="50"
                alt="Dysperse"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              {title}
            </Heading>
            <Text className="text-black text-[17px] leading-[20px] -mb-2">
              Hey <strong>{name}</strong>,
            </Text>
            {children}
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
                hello@dysperse.com
              </Link>{" "}
              right away.Since this is an important update regarding your
              account you cannot unsubscribe from these updates.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
export default EmailWrapper;
