import { useRouter } from "next/router";
import useSWR from "swr";
import { mutate } from "swr";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Masonry from "@mui/lab/Masonry";
import EditIcon from "@mui/icons-material/Edit";
import { Suspense } from "react";

import { ItemCard } from "../../components/rooms/ItemCard";
import { Toolbar } from "../../components/rooms/Toolbar";

const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

function Header({ room, itemCount }: { room: string; itemCount: number }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5">
          {((room: string) => room.charAt(0).toUpperCase() + room.slice(1))(
            room
          )}
        </Typography>
        <Typography>{itemCount} items</Typography>
      </CardContent>
    </Card>
  );
}

function Suggestions({ room, items }: any) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5">Suggestions</Typography>
        <Chip
          onClick={() => {
            return;
          }}
          sx={{ mt: 1, mr: 1 }}
          label={"Test suggestion"}
        />
        <Chip
          onClick={() => {
            return;
          }}
          sx={{ mt: 1, mr: 1 }}
          label={"Test suggestion"}
        />
        <Chip
          onClick={() => {
            return;
          }}
          sx={{ mt: 1, mr: 1 }}
          label={"Test suggestion"}
        />
        <Chip
          onClick={() => {
            return;
          }}
          sx={{ mt: 1, mr: 1 }}
          label={"Test suggestion"}
        />
        <Chip
          onClick={() => {
            return;
          }}
          sx={{ mt: 1, mr: 1 }}
          label={"Test suggestion"}
        />
        <Chip
          onClick={() => {
            return;
          }}
          sx={{ mt: 1, mr: 1 }}
          label={"Test suggestion"}
        />
      </CardContent>
    </Card>
  );
}

function LoadingScreen() {
  return (
    <Box sx={{ p: 3 }}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{ height: 160, mb: 2, borderRadius: "5px" }}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{ height: 120, mb: 2, borderRadius: "5px" }}
      />
      <Box
        sx={{
          mr: {
            sm: -2
          }
        }}
      >
        <Masonry columns={{ xs: 1, sm: 3 }} spacing={{ xs: 0, sm: 2 }}>
          {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(
            (_) => {
              let height = Math.random() * 400;
              if (height < 100) height = 100;
              return (
                <Paper
                  key={Math.random().toString()}
                  sx={{ p: 0 }}
                  elevation={0}
                >
                  <Skeleton
                    variant="rectangular"
                    height={height}
                    animation="wave"
                    sx={{ mb: 1, borderRadius: "5px" }}
                  />
                </Paper>
              );
            }
          )}
        </Masonry>
      </Box>
    </Box>
  );
}

function ItemList({ items }: { items: string }) {
  return (
    <Box
      sx={{
        mr: {
          sm: -2
        }
      }}
    >
      <Masonry columns={{ xs: 1, sm: 3 }} spacing={{ xs: 0, sm: 2 }}>
        {items.length === 0 ? (
          <Paper
            sx={{
              boxShadow: 0,
              p: 0,
              width: "calc(100% - 15px)!important",
              textAlign: "center",
              mb: 2
            }}
            key={(Math.random() + Math.random()).toString()}
          >
            <Card
              sx={{
                mb: 2
              }}
            >
              <CardContent>
                <img
                  src="https://ouch-cdn2.icons8.com/XBzKv4afS9brUYd2rl02wYqlGS8RRQ59aTS-49vo_s4/rs:fit:256:266/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNjE2/L2FmYmNiNTMyLWY5/ZjYtNGQxZC1iZjE0/LTYzMTExZmJmZWMw/ZC5zdmc.png"
                  alt="No items..."
                  style={{ width: "300px", maxWidth: "90vw" }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    mt: 1
                  }}
                >
                  No items yet...
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "inline-flex",
                    gap: "10px",
                    alignItems: "center",
                    mt: 1
                  }}
                >
                  Hit the <EditIcon /> icon to create an item.{" "}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        ) : null}

        {items.map(
          (item: {
            id: number;
            lastUpdated: string;
            amount: string;
            sync: string;
            title: string;
            categories: string;
            note: string;
            star: number;
            room: string;
          }) => (
            <Paper
              sx={{ boxShadow: 0, p: 0 }}
              key={(Math.random() + Math.random()).toString()}
            >
              <ItemCard item={item} />
            </Paper>
          )
        )}
      </Masonry>
    </Box>
  );
}

function Room() {
  const router = useRouter();
  const { index }: any = router.query;

  const url = "https://api.smartlist.tech/v2/items/list/";

  mutate(
    url,
    fetch(url, {
      method: "POST",
      body: new URLSearchParams({
        token: ACCOUNT_DATA.accessToken,
        room: index
      })
    }).then((res) => res.json()),
    { suspense: true }
  );

  const { data, error } = useSWR(
    url,
    (): Promise<any> =>
      fetcher(url, {
        method: "POST",
        body: new URLSearchParams({
          token: ACCOUNT_DATA.accessToken,
          room: index
        })
      }),
    { suspense: true }
  );

  if (error)
    return <div>Yikes! An error has occured, please try again later</div>;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Box sx={{ p: 3 }}>
        <Header room={index} itemCount={data.data.length} />
        <Suggestions room={index} items={data.data.length} />
        <Toolbar />
        <ItemList items={data.data} />
      </Box>
    </Suspense>
  );
}
export function getServerSideProps(context: any) {
  return {
    props: { params: context.params }
  };
}

export default Room;
