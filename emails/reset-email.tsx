import { Section, Text } from "@react-email/components";
import { EmailWrapper } from "./wrapper";

interface EmailProps {
  name?: string;
  email?: string;
  token?: string;
}

export default function ResetEmail({
  name = "[name]",
  email = "[email]",
  token = "--------",
}: EmailProps) {
  return (
    <EmailWrapper
      emoji="2709"
      title="Reset your email"
      email={email}
      name={name}
      previewText="Here's the code to reset your email for your Dysperse account"
    >
      <Text className="text-black text-[14px] leading-[24px]">
        You recently requested us to change the email address for your Dysperse
        account. Copy and paste the code below into Dysperse to continue.
      </Text>
      <Section className="my-[32px] text-center bg-gray-200 rounded-xl p-5">
        {token}
      </Section>
      <Text className="text-black text-[14px] leading-[24px]">
        This code is only valid for 3 hours and can only be used once. If you
        didn&apos;t ask to change your email, chances are, someone else is
        trying to access your account. In that case, you can safely disregard
        this email 😎
      </Text>
    </EmailWrapper>
  );
}
