import { Section, Text } from "@react-email/components";
import { EmailWrapper } from "./wrapper";

interface EmailProps {
  name?: string;
  email?: string;
  token?: string;
}

export default function ForgotPasswordEmail({
  name = "[name]",
  email = "[email]",
  token = "--------",
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
        While your password is out there having its escapade, we&apos;ll make
        sure you regain access to your account faster than a squirrel on
        caffeine. Copy and paste the code below into Dysperse to continue.
      </Text>
      <Section className="my-[32px] text-center bg-gray-200 rounded-xl p-5">
        {token}
      </Section>
      <Text className="text-black text-[14px] leading-[24px]">
        If you didn&apos;t ask to reset your password, chances are, someone else
        is trying to access your account. In that case, you can safely disregard
        this email 😎
      </Text>
    </EmailWrapper>
  );
}
