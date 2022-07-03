import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import useSWR from "swr";

function Session({ session }) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Collapse in={!open}>
      <ListItem
        secondaryAction={
          <Tooltip title="Revoke access">
            <IconButton
              disabled={session.token === global.session.accessToken}
              onClick={() => setOpen(true)}
            >
              <span className="material-symbols-rounded">remove_circle</span>
            </IconButton>
          </Tooltip>
        }
        key={session.token}
        sx={{ px: { xs: 2, sm: 0 } }}
        disableGutters
      >
        <ListItemText
          sx={{
            maxWidth: "100%",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          secondary={<>Access&nbsp;token:&nbsp;{session.token}</>}
          primary={global.session.user.name}
        />
      </ListItem>
    </Collapse>
  );
}

export default function Sessions() {
  const { error, data }: any = useSWR(
    "https://api.smartlist.tech/v2/account/sessions/",
    () =>
      fetch("https://api.smartlist.tech/v2/account/sessions/", {
        method: "POST",
        body: new URLSearchParams({
          token: global.session && global.session.accessToken,
        }),
      }).then((res) => res.json())
  );
  if (error)
    return (
      <>
        Yikes! An error occured while trying to fetch your sessions. Try
        reloading this page
      </>
    );
  return (
    <Box
      sx={{
        py: 1,
        px: {
          sm: 10,
        },
      }}
    >
      {!data ? (
        <Box sx={{ mt: 4 }}>
          {[...new Array(10)].map((_: any, id: number) => (
            <Skeleton
              sx={{ height: 60, mb: 2, borderRadius: 5 }}
              variant="rectangular"
              animation="wave"
              key={id.toString()}
            />
          ))}
        </Box>
      ) : (
        <List sx={{ width: "100%" }}>
          {data.data.map((session: any, id: number) => (
            <Session session={session} key={id.toString()} />
          ))}
        </List>
      )}
    </Box>
  );
}
