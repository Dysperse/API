import { Button, Hr, Link, Section, Text } from "@react-email/components";
import { EmailWrapper } from "./wrapper";

interface EmailProps {
  name?: string;
  email?: string;
}

export const WelcomeEmail = ({
  name = "[name]",
  email = "[email]",
}: EmailProps) => {
  return (
    <EmailWrapper
      emoji="1f44b"
      title="Welcome to Dysperse"
      email={email}
      name={name}
      previewText="We literally can't wait to see how you grow with Dysperse!"
    >
      <Text className="text-black text-[14px] leading-[24px]">
        You&apos;re now part of the{" "}
        <Link
          href="https://instagram.com/tags/dysperse"
          target="_blank"
          className="text-blue-600 no-underline"
        >
          #dysperse
        </Link>{" "}
        family. We literally can&apos;t wait to see how you grow with Dysperse!
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
    </EmailWrapper>
  );
};

export default WelcomeEmail;
