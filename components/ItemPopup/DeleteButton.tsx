import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import dayjs from "dayjs";
import toast from "react-hot-toast";

export function DeleteButton({
  item,
  styles,
  setDeleted,
  setDrawerState,
}: any): JSX.Element {
  return (
    <ListItem
      button
      sx={styles}
      onClick={() => {
        fetch(
          "/api/inventory/trash?" +
            new URLSearchParams({
              propertyToken: global.session.property.propertyToken,
              accessToken: global.session.property.accessToken,
              id: item.id.toString(),
              lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            }),
          {
            method: "POST",
          }
        );
        toast.success((t) => (
          <span>
            Item moved to trash
            <Button
              size="small"
              sx={{
                ml: 2,
                borderRadius: 999,
                p: "0!important",
                width: "auto",
                minWidth: "auto",
              }}
              onClick={() => {
                toast.dismiss(t.id);
                fetch(
                  "/api/inventory/restore?" +
                    new URLSearchParams({
                      propertyToken: global.session.property.propertyToken,
                      accessToken: global.session.property.accessToken,
                      id: item.id.toString(),
                      lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    }),
                  {
                    method: "POST",
                  }
                );
                setDeleted(false);
                setDrawerState(true);
              }}
            >
              Undo
            </Button>
          </span>
        ));
        setDeleted(true);
        setDrawerState(false);
      }}
    >
      <span className="material-symbols-rounded">delete</span>
      Delete
    </ListItem>
  );
}
