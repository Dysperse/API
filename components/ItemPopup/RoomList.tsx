import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import toast from "react-hot-toast";
import useSWR from "swr";

export function RoomList({
  title,
  handleClose,
}: {
  title: string;
  handleClose: any;
}) {
  const url =
    "/api/lists/fetch-custom-lists?" +
    new URLSearchParams({
      propertyToken: global.session.property.propertyToken,
      accessToken: global.session.property.accessToken,
    });
  const { error, data }: any = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );

  if (error) {
    return (
      <>
        Yikes! An error occured while trying to fetch your lists. Try reloading
        the page
      </>
    );
  }
  if (!data)
    return (
      <>
        {[...new Array(10)].map((_: any, id: number) => (
          <Skeleton animation="wave" key={id.toString()} />
        ))}
      </>
    );
  return (
    <>
      <List sx={{ mt: -1 }}>
        {[
          { title: "Shopping list", id: "-2" },
          { title: "To-do list", id: "-1" },
          ...data.data,
        ].map((list: any, id: number) => (
          <ListItem disablePadding key={id.toString()}>
            <ListItemButton
              sx={{ borderRadius: 9, py: 0.5, px: 2 }}
              onClick={() => {
                fetch(
                  "/api/lists/create-item?" +
                    new URLSearchParams({
                      propertyToken: global.session.property.propertyToken,
                      accessToken: global.session.property.accessToken,
                      parent: list.id,
                      title: title,
                      description: "",
                    }),
                  {
                    method: "POST",
                  }
                )
                  .then((res) => res.json())
                  .then((res) => {
                    toast.success("Added item!");
                    handleClose();
                  });
              }}
            >
              <ListItemText primary={list.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}
