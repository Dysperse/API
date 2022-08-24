import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { CreateListModal } from "../AddPopup/CreateListModal";
import { GenerateListItem } from "./GenerateListItem";

function GenerateData({ data, parent, emptyImage, emptyText, title }: any) {
  const [items, setItems] = useState<any>(data);

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
                  sx={{ display: "inline-flex", alignItems: "center", gap: 3 }}
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
  description,
  title,
  emptyImage,
  emptyText,
  data,
}: {
  parent: any;
  description: string;
  title: any;
  emptyImage: any;
  emptyText: any;
  data: Array<any>;
}) {
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
        <Box sx={{ display: "flex", alignItems: "center", mb: 0.1, px: 1 }}>
          <Box>
            <Typography
              gutterBottom={!description}
              variant="h6"
              component="div"
            >
              {title}
            </Typography>
            {description && (
              <Typography sx={{ mb: 1.2 }} variant="body2" component="div">
                {"description"}
              </Typography>
            )}
          </Box>
          <IconButton
            disableRipple
            sx={{
              transition: "none",
              ml: "auto",
              "&:active": {
                background:
                  global.theme == "dark"
                    ? "hsl(240, 11%, 20%)"
                    : "rgba(200,200,200,.3)",
              },
              display: parent !== -1 && parent !== -2 ? "flex" : "none",
            }}
          >
            <span className="material-symbols-rounded">more_horiz</span>
          </IconButton>
        </Box>
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
