import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import * as React from "react";
import { Lists } from "../components/dashboard/CustomLists/Lists";
import { ListItems } from "../components/dashboard/ListItems";
import { RecentItems } from "../components/dashboard/RecentItems";
import Head from "next/head";
export default function Dashboard() {
  return (
    <>
      <Head>
        <title>
          Dashboard &bull;{" "}
          {global.session.user.houseName.replace(/./, (c) => c.toUpperCase())}{" "}
          &bull; Carbon
        </title>
      </Head>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ mr: -2 }}>
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>
            <Paper
              key={(Math.random() + Math.random()).toString()}
              sx={{ boxShadow: 0, p: 0 }}
            >
              <ListItems
                emptyText="Your shopping list is empty"
                emptyImage="https://ouch-cdn2.icons8.com/9ZkS5oUxGuBU8xmECIcW5iRDv56KpODUsTuuykys3NU/rs:fit:256:252/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMzk3/LzUxZTU5NjM3LWVk/YzQtNDM0My04ODNl/LWZhMmNkM2EzMmQ4/YS5zdmc.png"
                title={"Shopping list"}
                parent={-2}
              />
            </Paper>
            <Paper
              key={(Math.random() + Math.random()).toString()}
              sx={{ elevation: 0 }}
            >
              <RecentItems />
            </Paper>
            <Paper
              key={(Math.random() + Math.random()).toString()}
              sx={{ boxShadow: 0, p: 0 }}
            >
              <Lists />
            </Paper>
            <Paper
              key={(Math.random() + Math.random()).toString()}
              sx={{ boxShadow: 0, p: 0 }}
            >
              <ListItems
                emptyText="Great job — You've finished all your tasks!"
                emptyImage="https://ouch-cdn2.icons8.com/ILJ4wkr6UuNv9n7wnbxnxKRGFEvqc0_vKV13mA4Q0wM/rs:fit:256:256/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNTU5/L2YwMDczNGQ4LWFj/NjQtNGQyNS1hNTU2/LTdjNTdkZTY3ZWQz/MS5zdmc.png"
                title={"To-do list"}
                parent={-1}
              />
            </Paper>
          </Masonry>
        </Box>
      </Container>
    </>
  );
}
