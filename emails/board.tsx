import { Button, Section, Text } from "@react-email/components";
import { EmailWrapper } from "./wrapper";

interface EmailProps {
  fromName?: string;
  toName?: string;
  boardName?: string;
  boardId?: string;
}

export const BoardEmail = ({
  fromName = "[from-name]",
  toName = "[to-name]",
  boardName = "[board-name]",
  boardId = "[board-id]",
}: EmailProps) => {
  return (
    <EmailWrapper
      emoji="270c"
      title="You've been added to a board!"
      email={toName}
      name={toName}
      previewText="Someone on Dysperse has invited you to collaborate on a board!"
    >
      <Text className="text-black text-[14px] leading-[24px]">
        <b>{fromName}</b> has invited you to collaborate with you on{" "}
        <b>&quot;{boardName}&quot;</b>! Boards are great places for you to plan
        and collaborate on anything, from shopping lists, to business plans.{" "}
      </Text>
      <Section className="my-[32px] text-center">
        <Button
          pX={20}
          pY={12}
          className="bg-[#000000] rounded-full text-white text-[12px] font-semibold no-underline text-center"
          href={`https://my.dysperse.com/tasks/boards/${boardId}`}
        >
          Open in Dysperse
        </Button>
      </Section>
    </EmailWrapper>
  );
};

export default BoardEmail;
