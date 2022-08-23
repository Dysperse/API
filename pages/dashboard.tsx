import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Head from "next/head";
import { Lists } from "../components/dashboard/CustomLists/Lists";
import { ListItems } from "../components/dashboard/ListItems";
import { RecentItems } from "../components/dashboard/RecentItems";
import { sessionData } from "./api/user";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>
          Dashboard &bull;{" "}
          {global.session.property.houseName.replace(/./, (c) =>
            c.toUpperCase()
          )}{" "}
          &bull; Carbon
        </title>
      </Head>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ display: { sm: "none" } }}>
          <Lists mobile />
        </Box>
        <Box sx={{ mr: -2 }}>
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>
            <Paper>
              <ListItems
                emptyText="Your shopping list is empty"
                emptyImage="https://ouch-cdn2.icons8.com/sSUvce4XDF1pkQB9MM4uEhuC1jww-uC6qOniWYaDIu8/rs:fit:256:256/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNjAx/LzVjMWVmMzYyLWQz/ZWMtNDQ4Zi1iNDYw/LTdmZTVkYWVlYzhk/MC5zdmc.png"
                title={"Shopping list"}
                parent={-2}
              />
            </Paper>
            <Paper>
              <ListItems
                emptyText="Great job — You've finished all your tasks!"
                emptyImage="https://ouch-cdn2.icons8.com/Gmb2VDsK_0vYJN8H8Q_-pj5cJEKjFQY6buBtji7rJGo/rs:fit:256:171/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMzkz/L2E5OTFhYjE3LTNh/MDktNGM2My1iNjhi/LTk1ZDA1NmRhYzNk/MS5zdmc.png"
                title={"My tasks"}
                parent={-1}
              />
            </Paper>
            <Paper>
              <RecentItems />
            </Paper>
            <Paper>
              <Box
                sx={{
                  display: { xs: "none", sm: "unset" },
                }}
              >
                <Lists />
              </Box>
            </Paper>
          </Masonry>
        </Box>
      </Container>
    </>
  );
}

export const getServerSideProps = async ({ req }) => {
  const session = await sessionData(req.cookies.token);
  console.log(session);

  return {
    props: { session: session },
  };
};
