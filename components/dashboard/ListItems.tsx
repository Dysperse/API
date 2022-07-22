import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import React from "react";
import useFetch from "react-fetch-hook";
import { GenerateListItem } from "./GenerateListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { CreateListModal } from "../AddPopup/CreateListModal";

function GenerateData({ data, parent, emptyImage, emptyText, title }: any) {
  const [items, setItems] = useState<any>(data.data);

  return (
    <>
      {items.map((list: Object, id: number) => (
        <GenerateListItem
          {...list}
          key={id.toString()}
          items={items}
          setItems={setItems}
        />
      ))}
      {items.length < 10 && (
        <CreateListModal
          parent={parent.toString()}
          title={"item"}
          items={items}
          setItems={setItems}
        >
          <ListItemButton
            disableRipple
            sx={{
              py: 0,
              borderRadius: 3,
              transition: "transform .2s",
              "&:active": {
                transition: "none",
                transform: "scale(.97)",
                background: "rgba(200,200,200,.3)",
              },
            }}
            dense
          >
            <ListItemIcon>
              <span
                style={{ marginLeft: "-2px" }}
                className="material-symbols-outlined"
              >
                add_circle
              </span>
            </ListItemIcon>
            <ListItemText sx={{ my: 1.4 }} primary={"New list item"} />
          </ListItemButton>
        </CreateListModal>
      )}
      {items.length === 0 && (
        <Box sx={{ textAlign: "center" }}>
          <picture>
            <img src={emptyImage} alt="No items" loading="lazy" />
          </picture>
          <Typography sx={{ display: "block" }} variant="h6">
            No items?!
          </Typography>
          <Typography sx={{ display: "block" }}>{emptyText}</Typography>
        </Box>
      )}
    </>
  );
}

// Shopping list / todo list
export function ListItems({
  parent,
  title,
  emptyImage,
  emptyText,
}: {
  parent: any;
  title: any;
  emptyImage: any;
  emptyText: any;
}) {
  const { data, isLoading }: any = useFetch(
    "/api/lists/items?" +
      new URLSearchParams({
        token:
          global.session &&
          (global.session.user.SyncToken || global.session.accessToken),
        parent: parent,
      }),
    {
      method: "POST",
    }
  );
  if (isLoading)
    return (
      <Skeleton
        height={200}
        animation="wave"
        variant="rectangular"
        sx={{ borderRadius: "28px" }}
      />
    );

  return (
    <Card
      sx={{
        borderRadius: "28px",
        width: "100%",
        p: 1,
        background: global.theme === "dark" ? "hsl(240, 11%, 13%)" : "#eee",
        boxShadow: 0,
      }}
    >
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
        <GenerateData
          data={data}
          parent={parent}
          emptyImage={emptyImage}
          emptyText={emptyText}
          title={title}
        />
      </CardContent>
    </Card>
  );
}
