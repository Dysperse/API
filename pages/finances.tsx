import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import NoData from "../components/finances/NoData";
import { AccountList } from "../components/finances/AccountList";

dayjs.extend(relativeTime);

export function RenderFinances() {
  return <AccountList />;
}
export default function Finances() {
  return (
    <Container>
      {global.session &&
      global.session.user.financeToken &&
      global.session.user.financeToken.startsWith("access-sandbox-") ? (
        <RenderFinances />
      ) : (
        <>
          <Typography variant="h5">Finances</Typography>
          <NoData />
        </>
      )}
    </Container>
  );
}
