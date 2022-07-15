import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { AccountList } from "../components/Finances/AccountList";
import NoData from "../components/Finances/NoData";
import { useState } from "react";

export default function Finances() {
  const [loginRequired, setLoginRequired] = useState(false);
  return (
    <Container>
      {global.session &&
      global.session.user.financeToken &&
      global.session.user.financeToken.startsWith("access-sandbox-") &&
      loginRequired === false ? (
        <AccountList setLoginRequired={setLoginRequired} />
      ) : (
        <>
          <Typography variant="h5">Finances</Typography>
          <NoData />
        </>
      )}
    </Container>
  );
}
