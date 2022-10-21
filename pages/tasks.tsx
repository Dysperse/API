import Container from "@mui/material/Container";
import Head from "next/head";
import { Lists } from "../components/home/Lists";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  return (
    <>
      <Head>
        <title>
          Tasks &bull;{" "}
          {global.property.profile.name.replace(/./, (c) => c.toUpperCase())}{" "}
          &bull; Carbon
        </title>
      </Head>
      <Container sx={{ mt: 4 }}>
        <Lists />
      </Container>
    </>
  );
}
