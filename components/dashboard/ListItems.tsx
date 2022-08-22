import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import useFetch from "react-fetch-hook";
import { CreateListModal } from "../AddPopup/CreateListModal";
import { GenerateListItem } from "./GenerateListItem";

function GenerateData({ data, parent, emptyImage, emptyText, title }: any) {
  const [items, setItems] = useState<any>(data.data);

  return (
    <>
      {items.length === 0 && (
        <Box sx={{ textAlign: "center", my: 2 }}>
          <picture>
            <img src={emptyImage} alt="No items" loading="lazy" />
          </picture>
          <Typography sx={{ display: "block" }} variant="h6">
            No items?!
          </Typography>
          <Typography sx={{ display: "block" }}>{emptyText}</Typography>
        </Box>
      )}
      {items.map((list: Object, id: number) => (
        <GenerateListItem
          {...list}
          key={id.toString()}
          items={items}
          setItems={setItems}
        />
      ))}
      {items.length < 20 && global.session.property.role !== "read-only" && (
        <CreateListModal
          parent={parent.toString()}
          items={items}
          setItems={setItems}
        >
          <ListItemButton
            disableRipple
            sx={{
              ...(items.length === 0 && {
                textAlign: "center",
              }),
              py: 0,
              borderRadius: 3,
              color: global.theme == "dark" ? "#fff" : "#808080",
              transition: "transform .2s",
              "&:active": {
                transition: "none",
                transform: "scale(.97)",
                background: "rgba(200,200,200,.3)",
              },
            }}
            dense
          >
            <ListItemText
              sx={{ mt: 1.4 }}
              primary={
                <Box
                  sx={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                >
                  <span
                    style={{ marginLeft: "-2px" }}
                    className="material-symbols-outlined"
                  >
                    add_circle
                  </span>
                  <span
                    style={{
                      color: global.theme == "dark" ? "#fff" : "#202020",
                      marginLeft: "-7px",
                    }}
                  >
                    New list item
                  </span>
                </Box>
              }
            />
          </ListItemButton>
        </CreateListModal>
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
        propertyToken: global.session.property.propertyToken,
        accessToken: global.session.property.accessToken,
        parent: parent,
      }),
    {
      method: "POST",
    }
  );
  if (isLoading)
    return (
      <Skeleton
        height={300}
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
        maxWidth: "calc(100vw - 32.5px)",
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
