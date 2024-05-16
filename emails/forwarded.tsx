import { Button, Section, Text } from "@react-email/components";
import { EmailWrapper } from "./wrapper";

interface EmailProps {
  toName?: string;
  shortId?: string;
  error?: null | string;
  toEmail: string;
}

export const ForwardedEmail = ({
  toName = "[to-name]",
  shortId = "[short-id]",
  error = null,
  toEmail = "[to-email]",
}: EmailProps) => {
  return (
    <EmailWrapper
      emoji={error ? "1f62c" : "1f389"}
      title={
        error
          ? "We couldn't add your task"
          : "#dysperse added your email as a task!"
      }
      email={toEmail}
      name={error ? "there" : toName}
      previewText={
        error
          ? "We couldn't add your task"
          : "We've added your task to Dysperse. You can view it here"
      }
    >
      <Text className="text-black text-[14px] leading-[24px]">
        {error
          ? "We got your email, but we couldn't find a Dysperse account associated with it. Try resending your email using the email address associated with your Dysperse account."
          : "We recieved your email and it's now visible in your Dysperse account. Click on the button below to view the published task."}
      </Text>
      <Section className="my-[32px] text-center">
        <Button
          pX={20}
          pY={12}
          className="bg-[#000000] rounded-full text-white text-[12px] font-semibold no-underline text-center"
          href={`https://dys.us.to/${shortId}`}
        >
          View it here!
        </Button>
      </Section>
    </EmailWrapper>
  );
};

export default BoardEmail;
