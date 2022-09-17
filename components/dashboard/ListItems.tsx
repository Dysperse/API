import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { createRef, useState } from "react";
import { useScreenshot } from "use-react-screenshot";
import { neutralizeBack, revivalBack } from "../history-control";
import { CreateListModal } from "./CreateListModal";
import { GenerateListItem } from "./GenerateListItem";
// import download from "downloadjs";

function downloadBlob(blob, name = "list.png") {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  // Remove link from body
  document.body.removeChild(link);
}

function GenerateData({
  screenshotReady,
  data,
  parent,
  emptyImage,
  emptyText,
}: {
  screenshotReady: boolean;
  data: Array<any>;
  parent: string | number;
  emptyImage: string;
  emptyText: string | JSX.Element;
  title: string;
}) {
  const [items, setItems] = useState<any>(data);

  return (
    <>
      {items.length === 0 && (
        <Box sx={{ textAlign: "center", my: 2 }}>
          <picture>
            <img
              src={emptyImage}
              alt="No items"
              loading="lazy"
              style={{
                ...(global.user.darkMode && { filter: "invert(1)" }),
              }}
            />
          </picture>
          <Typography sx={{ display: "block" }} variant="h6">
            No items?!
          </Typography>
          <Typography sx={{ display: "block" }}>{emptyText}</Typography>
        </Box>
      )}
      {items
        .filter((item: any) => !item.completed)
        .map((list: any, id: number) => (
          <GenerateListItem
            {...list}
            key={id.toString()}
            items={items}
            title={list.name}
            setItems={setItems}
          />
        ))}

      {items
        .filter((item: any) => item.completed)
        .map((list: any, id: number) => (
          <GenerateListItem
            {...list}
            key={id.toString()}
            items={items}
            title={list.name}
            setItems={setItems}
          />
        ))}

      {items.length < 20 &&
        global.property.role !== "read-only" &&
        !screenshotReady && (
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
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                    }}
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
  lists,
  setLists,
}: {
  parent: any;
  description: string;
  title: any;
  emptyImage: any;
  emptyText: any;
  data: Array<any>;
  lists: any;
  setLists: any;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [deleted, setDeleted] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => {
    setAnchorEl(null);
  };
  React.useEffect(() => {
    open ? neutralizeBack(handleClose) : revivalBack();
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const ref: any = createRef();
  const [image, takeScreenshot] = useScreenshot();
  const [screenshotReady, setScreenshotReady] = useState(false);
  const getImage = () => {
    setScreenshotReady(true);
    takeScreenshot(ref.current);
    setScreenshotReady(false);
  };

  return deleted ? null : (
    <Paper>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          elevation: 0,
          sx: {
            width: "450px",
            maxWidth: "calc(100vw - 20px)",
            borderRadius: "28px",
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "800" }}>
          Delete list?
          <DialogContentText id="alert-dialog-slide-description" sx={{ mt: 1 }}>
            Are you sure you want to delete this list? This action cannot be
            undone.
          </DialogContentText>
        </DialogTitle>
        <DialogActions>
          <Button
            variant="outlined"
            disableElevation
            size="large"
            sx={{
              borderRadius: 99,
              px: 3,
              py: 1,
              borderWidth: "2px!important",
            }}
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            size="large"
            sx={{
              borderRadius: 99,
              px: 3,
              py: 1,
              border: "2px solid transparent",
            }}
            onClick={() => {
              setLists(lists.filter((list) => list.id !== parent));
              fetch(
                "/api/property/lists/delete-list?" +
                  new URLSearchParams({
                    property: global.property.propertyId,
                    accessToken: global.property.accessToken,
                    parent: parent.toString(),
                  }).toString(),
                {
                  method: "POST",
                }
              ).then(() => {
                setDialogOpen(false);
                setTimeout(() => setDeleted(true), 200);
              });
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <div ref={ref}>
        <Card
          sx={{
            borderRadius: "28px",
            width: "100%",
            maxWidth: "calc(100vw - 32.5px)",
            p: 1,
            mb: { xs: 2, sm: 0 },
            background: global.theme === "dark" ? "hsl(240, 11%, 13%)" : "#eee",
            boxShadow: 0,
          }}
        >
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
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
            <MenuItem sx={{ gap: 2 }} disabled>
              <span className="material-symbols-outlined">push_pin</span>
              Pin
            </MenuItem>
            <MenuItem sx={{ gap: 2 }} disabled>
              <span className="material-symbols-outlined">edit</span>
              Edit description
            </MenuItem>
            <MenuItem
              sx={{ gap: 2 }}
              onClick={async () => {
                getImage();
                // download(image, "list.png", "image/png");
                const blob = await (await fetch(image)).blob();
                downloadBlob(blob);
              }}
            >
              <span className="material-symbols-outlined">view_in_ar</span>
              Download as PNG
            </MenuItem>
            <MenuItem
              sx={{ gap: 2 }}
              onClick={async () => {
                getImage();
                const base64url = image;
                const blob = await (await fetch(base64url)).blob();
                const file = new File([blob], "image.png", {
                  type: blob.type,
                });
                navigator.share({
                  title: title,
                  text: "Smartlist",
                  files: [file],
                });
              }}
            >
              <span className="material-symbols-outlined">share</span>
              Share
            </MenuItem>
            <MenuItem
              sx={{ gap: 2 }}
              onClick={() => {
                setDialogOpen(true);
                handleClose();
              }}
            >
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
                    {description}
                  </Typography>
                )}
              </Box>
              <IconButton
                onClick={handleClick}
                disableRipple
                sx={{
                  transition: "none",
                  opacity: screenshotReady ? 0 : 1,
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
              screenshotReady={screenshotReady}
              data={data}
              parent={parent}
              emptyImage={emptyImage}
              emptyText={emptyText}
              title={title}
            />
          </CardContent>
        </Card>
      </div>
    </Paper>
  );
}
