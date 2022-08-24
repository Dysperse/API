import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { CreateListModal } from "../AddPopup/CreateListModal";
import { neutralizeBack, revivalBack } from "../history-control";
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  React.useEffect(() => {
    open ? neutralizeBack(handleClose) : revivalBack();
  });

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
      <Menu
        BackdropProps={{ sx: { opacity: "0!important" } }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          transition: "all .2s",
          "& .MuiPaper-root": {
            mt: 1,
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            ml: -1,
            borderRadius: "15px",
            minWidth: 180,
            background:
              global.theme === "dark"
                ? colors[global.themeColor][900]
                : colors[global.themeColor][100],

            color:
              global.theme === "dark"
                ? colors[global.themeColor][200]
                : colors[global.themeColor][800],
            "& .MuiMenu-list": {
              padding: "4px",
            },
            "& .MuiMenuItem-root": {
              "&:hover": {
                background:
                  global.theme === "dark"
                    ? colors[global.themeColor][800]
                    : colors[global.themeColor][200],
                color:
                  global.theme === "dark"
                    ? colors[global.themeColor][100]
                    : colors[global.themeColor][900],
                "& .MuiSvgIcon-root": {
                  color:
                    global.theme === "dark"
                      ? colors[global.themeColor][200]
                      : colors[global.themeColor][800],
                },
              },
              padding: "10px 15px",
              borderRadius: "15px",
              marginBottom: "1px",

              "& .MuiSvgIcon-root": {
                fontSize: 25,
                color: colors[global.themeColor][700],
                marginRight: 1.9,
              },
              "&:active": {
                background:
                  global.theme === "dark"
                    ? colors[global.themeColor][700]
                    : colors[global.themeColor][300],
              },
            },
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem sx={{ gap: 2 }}>
          <span className="material-symbols-outlined">push_pin</span>
          Pin
        </MenuItem>
        <MenuItem sx={{ gap: 2 }}>
          <span className="material-symbols-outlined">edit</span>
          Edit description
        </MenuItem>
        <MenuItem sx={{ gap: 2 }}>
          <span className="material-symbols-outlined">share</span>
          Share
        </MenuItem>
        <MenuItem sx={{ gap: 2 }}>
          <span className="material-symbols-outlined">delete</span>
          Delete
        </MenuItem>
      </Menu>
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
            onClick={handleClick}
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
