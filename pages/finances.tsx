import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { AccountList } from "../components/Finances/AccountList";
import NoData from "../components/Finances/NoData";

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
