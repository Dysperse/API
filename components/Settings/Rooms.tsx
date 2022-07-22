import Box from "@mui/material/Box";
import useSWR from "swr";
import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";

function Room({ data }) {
  const [deleted, setDeleted] = React.useState<boolean>(false);
  return deleted ? null : (
    <ListItem
      sx={{
        background: "rgba(0,0,0,0.05)",
        mb: 1,
        borderRadius: 5,
        p: 3,
        px: 4,
      }}
    >
      <ListItemText
        primary={data.name}
        secondary={
          <Button
            onClick={() => {
              if (
                confirm(
                  "Delete this room including the items in it? This action is irreversible."
                )
              ) {
                setDeleted(true);
                fetch(
                  "/api/rooms/delete?" +
                    new URLSearchParams({
                      id: data.id,
                      token:
                        global.session.user.SyncToken ||
                        global.session.accessToken,
                    }),
                  {
                    method: "POST",
                  }
                )
                  .then(() => toast.success("Room deleted!"))
                  .catch(() => {
                    toast.error("Failed to delete room");
                    setDeleted(false);
                  });
              }
            }}
            sx={{ mt: 1, borderWidth: "2px!important", borderRadius: 3 }}
            variant="outlined"
          >
            Delete
          </Button>
        }
      />
    </ListItem>
  );
}

export default function Rooms() {
  const url =
    "/api/rooms?" +
    new URLSearchParams({
      token: global.session.user.SyncToken || global.session.accessToken,
    });
  const [open, setOpen] = React.useState<boolean>(false);

  const { error, data }: any = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );
  if (error) {
    return <>An error occured while trying to fetch your rooms. </>;
  }

  return (
    <Box
      sx={{
        p: 4,
      }}
    >
      {data ? (
        <>
          {data.data.map((room: any) => (
            <Room data={room} />
          ))}
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            mt: -5,
            justifyContent: "center",
            height: "100%",
            alignItems: "center",
            px: 10,
          }}
        >
          Loading...
        </Box>
      )}
    </Box>
  );
}
