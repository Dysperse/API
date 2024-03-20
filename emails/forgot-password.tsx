import { Button, Section, Text } from "@react-email/components";
import { EmailWrapper } from "./wrapper";

interface EmailProps {
  name?: string;
  email?: string;
  link?: string;
}

export default function ForgotPasswordEmail({
  name = "[name]",
  email = "[email]",
  link = "https://api.dysperse.com/auth",
}: EmailProps) {
  return (
    <EmailWrapper
      emoji="1f914"
      title="Forgot your password?"
      email={email}
      name={name}
      previewText="No worries! We'll help you reset it."
    >
      <Text className="text-black text-[14px] leading-[24px]">
        Forgot your password? No worries! We&apos;ll help you reset it. If you
        didn&apos;t ask to reset your password, chances are, someone else is
        trying to access your account. In that case, you can safely disregard
        this email 😎
      </Text>
      <Section className="my-[32px] text-center">
        <Button
          pX={20}
          pY={12}
          className="bg-[#000000] rounded-full text-white text-[12px] font-semibold no-underline text-center"
          href={link}
        >
          Reset my password
        </Button>
      </Section>
    </EmailWrapper>
  );
}
