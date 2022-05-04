import { useState } from "react";
import Box from "@mui/material/Box";
import useFetch from "react-fetch-hook";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Skeleton from "@mui/material/Skeleton";

function Session({ session }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapse in={!open}>
      <ListItem
        secondaryAction={
          <Tooltip title="Revoke access">
            <IconButton
              disabled={session.token === global.session.accessToken}
              onClick={() => setOpen(true)}
            >
              <span class="material-symbols-rounded">remove_circle</span>
            </IconButton>
          </Tooltip>
        }
        key={session.token}
        disableGutters
      >
        <ListItemText
          sx={{
            maxWidth: "100%",
            textOverflow: "ellipsis",
            overflow: "hidden"
          }}
          secondary={<>Access&nbsp;token:&nbsp;{session.token}</>}
          primary={global.session.user.name}
        />
      </ListItem>
    </Collapse>
  );
}

export default function Sessions() {
  const { isLoading, data } = useFetch(
    "https://api.smartlist.tech/v2/account/sessions/",
    {
      method: "POST",
      body: new URLSearchParams({
        token: global.session && global.session.accessToken
      })
    }
  );
  return (
    <Box
      sx={{
        py: 1,
        px: {
          sm: 10
        }
      }}
    >
      {isLoading ? (
        <Box sx={{ mt: 4 }}>
          {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_) => (
            <Skeleton
              sx={{ height: 60, mb: 2, borderRadius: 5 }}
              variant="rectangular"
              animation="wave"
            />
          ))}
        </Box>
      ) : (
        <List sx={{ width: "100%" }}>
          {data.data.map((session) => (
            <Session session={session} />
          ))}
        </List>
      )}
    </Box>
  );
}
