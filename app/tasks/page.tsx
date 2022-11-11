"use client";

import Container from "@mui/material/Container";
import Head from "next/head";
import { Lists } from "../../components/Tasks/Lists";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  return (
    <>
      <Container sx={{ mt: 4 }}>
        <Lists />
      </Container>
    </>
  );
}
