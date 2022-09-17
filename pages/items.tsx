import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { colors } from "../lib/colors";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ButtonGroup from "@mui/material/ButtonGroup";
import Menu from "@mui/material/Menu";
import Skeleton from "@mui/material/Skeleton";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { encode } from "js-base64";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { FloatingActionButton } from "../components/Layout/FloatingActionButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Puller } from "../components/Puller";
import { neutralizeBack, revivalBack } from "../components/history-control";
import CircularProgress from "@mui/material/CircularProgress";
import { ItemCard } from "../components/rooms/ItemCard";
import { ErrorHandler } from "../components/ErrorHandler";

/**
 * Category modal
 * @param {string} category - The category name
 */
function CategoryModal({ category }: { category: string }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <>
      <SwipeableDrawer
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        open={open}
        anchor="bottom"
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: "600px",
            maxHeight: "95vh",
            borderRadius: "30px 30px 0 0",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 3, overflow: "scroll" }}>
          <Typography
            sx={{
              textAlign: "center",
              my: 4,
              textTransform: "capitalize",
              fontWeight: "600",
            }}
            variant="h5"
          >
            {category}
          </Typography>
          {data.map((item: any) => (
            <Box sx={{ mb: 1 }} key={item.id.toString()}>
              <ItemCard item={item} displayRoom={false} />
            </Box>
          ))}
          {data.length === 0 && <>No items</>}
        </Box>
      </SwipeableDrawer>
      <ListItem
        button
        onClick={() => {
          setLoading(true);
          fetch(
            "/api/inventory/category-items?" +
              new URLSearchParams({
                property: global.property.propertyId,
                accessToken: global.property.accessToken,
                category: category,
              }).toString()
          )
            .then((res) => res.json())
            .then((res) => {
              setData(res.data);
              setOpen(true);
              setLoading(false);
            })
            .catch(() => {
              alert("An error occured while trying to fetch your inventory");
              setLoading(false);
            });
        }}
        sx={{
          mb: 1,
          transition: "transform .2s !important",
          borderRadius: 4,
          "&:active": {
            transition: "none!important",
            transform: "scale(.97)",
            background:
              global.theme == "dark"
                ? "hsl(240, 11%, 20%)"
                : "rgba(200,200,200,.4)",
          },
          ...(theme === "dark" && {
            "&:hover .avatar": {
              background: "hsl(240,11%,27%)",
            },
          }),
        }}
      >
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {category}{" "}
              {loading && <CircularProgress size={20} sx={{ ml: "auto" }} />}
            </Box>
          }
        />
      </ListItem>
      <Divider />
    </>
  );
}

/**
 * Component to dispay items by category
 */
function CategoryList() {
  const url =
    "/api/property/inventory/categories?" +
    new URLSearchParams({
      property: global.property.propertyId,
      accessToken: global.property.accessToken,
    }).toString();
  const { error, data }: any = useSWR(url, () =>
    fetch(url, { method: "POST" }).then((res) => res.json())
  );

  return (
    <>
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your items" />
      )}
      {!error && data ? (
        <>
          {[...new Set(data.data)].map((category: any, key: number) => (
            <CategoryModal category={category} key={key.toString()} />
          ))}
        </>
      ) : (
        !error && (
          <>
            {[...new Array(5)].map((_, i) => (
              <Skeleton
                animation="wave"
                height={30}
                sx={{ width: "100%", mb: 2, borderRadius: 3 }}
                variant="rectangular"
                key={i.toString()}
              />
            ))}
          </>
        )
      )}
    </>
  );
}

/**
 * Room button
 * @param {string | JSX.Element} icon - The room's icon
 * @param {string | JSX.Element} primary - The room's name
 * @param {string} href - The room's link
 * @param {Function} onClick - Callback function for the room's click event
 */
function Action({ icon, primary, href, onClick }: any) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  return (
    <ListItem
      disableRipple
      button
      onClick={() => {
        if (href) router.push(href);
        else {
          onClick && onClick();
        }
        setLoading(true);
      }}
      secondaryAction={
        <>
          {loading ? (
            <CircularProgress size={18} sx={{ ml: "auto", mt: "8px" }} />
          ) : (
            <span
              className="material-symbols-rounded"
              style={{ marginTop: "10px" }}
            >
              chevron_right
            </span>
          )}
        </>
      }
      sx={{
        mb: 1,
        transition: "transform .2s !important",
        borderRadius: 4,
        "&:active": {
          transition: "none!important",
          transform: "scale(.97)",
          background:
            global.theme == "dark"
              ? "hsl(240, 11%, 20%)"
              : "rgba(200,200,200,.4)",
        },
        ...(theme === "dark" && {
          "&:hover .avatar": {
            background: "hsl(240,11%,27%)",
          },
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar
          className="avatar"
          sx={{
            color: global.theme === "dark" ? "#fff" : colors[themeColor][900],
            borderRadius: 4,
            background:
              global.theme === "dark"
                ? "hsl(240,11%,17%)"
                : colors[themeColor][100],
          }}
        >
          <span
            style={{ fontSize: "20px" }}
            className="material-symbols-rounded"
          >
            {icon}
          </span>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Typography sx={{ fontWeight: "500" }}>{primary}</Typography>}
        // secondary={
        //   <Typography sx={{ fontWeight: "400", fontSize: "15px" }}>
        //     {secondary}
        //   </Typography>
        // }
      />
    </ListItem>
  );
}

/**
 * Top-level component for the items page
 */
export default function Categories() {
  const url =
    "/api/property/rooms?" +
    new URLSearchParams({
      property: global.property.propertyId,
      accessToken: global.property.accessToken,
    }).toString();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [viewBy, setViewBy] = React.useState("room");
  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );

  return (
    <>
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your items" />
      )}
      <FloatingActionButton />
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
        <MenuItem
          onClick={() => {
            setViewBy("room");
            handleClose();
          }}
          sx={{
            ...(viewBy === "room" && {
              background:
                colors[global.themeColor][global.theme === "dark" ? 700 : 300],
            }),
          }}
        >
          Room
        </MenuItem>
        <MenuItem
          onClick={() => {
            setViewBy("category");
            handleClose();
          }}
          sx={{
            ...(viewBy === "category" && {
              background:
                colors[global.themeColor][global.theme === "dark" ? 700 : 300],
            }),
          }}
        >
          Category
        </MenuItem>
      </Menu>
      <Container sx={{ mb: 3 }}>
        <Typography
          variant="h3"
          sx={{
            my: 12,
            fontWeight: "400",
            textAlign: "center",
          }}
        >
          Inventory
        </Typography>
        <Box
          sx={{
            my: 4,
            textAlign: "center",
          }}
        >
          <ButtonGroup
            variant="outlined"
            aria-label="outlined primary button group"
          >
            <Button
              onClick={() => setViewBy("room")}
              sx={{
                px: 5,
                borderRadius: 999,
                height: 40,
                transition: "none!important",
                width: 150,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                ...(viewBy === "room" && {
                  background:
                    colors[themeColor][global.theme !== "dark" ? 100 : 900] +
                    "!important",
                  color:
                    colors[themeColor][global.user.darkMode ? 50 : 900] +
                    "!important",
                }),
              }}
            >
              {viewBy === "room" ? (
                <span
                  className="material-symbols-rounded"
                  style={{ marginRight: "10px" }}
                >
                  check
                </span>
              ) : (
                <></>
              )}
              Room
            </Button>
            <Button
              onClick={() => setViewBy("category")}
              sx={{
                px: 5,
                height: 40,
                borderRadius: 999,
                transition: "none!important",
                width: 150,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                ...(viewBy === "category" && {
                  background:
                    colors[themeColor][global.theme !== "dark" ? 100 : 900] +
                    "!important",

                  color:
                    colors[themeColor][global.user.darkMode ? 50 : 900] +
                    "!important",
                }),
              }}
            >
              {viewBy === "category" ? (
                <span
                  className="material-symbols-rounded"
                  style={{ marginRight: "10px" }}
                >
                  check
                </span>
              ) : (
                <></>
              )}
              Category
            </Button>
          </ButtonGroup>
        </Box>
        {viewBy === "room" ? (
          <>
            <Action href="/rooms/kitchen" icon="oven_gen" primary="Kitchen" />
            <Action
              href="/rooms/bedroom"
              icon="bedroom_parent"
              primary="Bedroom"
            />
            <Action href="/rooms/bathroom" icon="bathroom" primary="Bathroom" />
            <Action href="/rooms/garage" icon="garage" primary="Garage" />
            <Action href="/rooms/dining" icon="dining" primary="Dining room" />
            <Action href="/rooms/living" icon="living" primary="Living room" />
            <Action
              href="/rooms/laundry"
              icon="local_laundry_service"
              primary="Laundry room"
            />
            <Action
              href="/rooms/storage"
              icon="inventory_2"
              primary="Storage room"
            />
            <Action href="/rooms/garden" icon="yard" primary="Garden" />
            <Action href="/rooms/camping" icon="camping" primary="Camping" />
            <Divider sx={{ my: 1 }} />
            {data &&
              data.map((room: any, id: number) => (
                <Action
                  href={
                    "/rooms/" +
                    encode(room.id + "," + room.name) +
                    "?custom=true"
                  }
                  icon="label"
                  primary={room.name}
                  key={id.toString()}
                />
              ))}
            <Action
              onClick={() =>
                document.getElementById("setCreateRoomModalOpen")?.click()
              }
              icon="add_circle"
              primary="Create room"
            />
            <Action
              onClick={() =>
                document.getElementById("houseProfileTrigger")?.click()
              }
              icon="edit"
              primary="Manage rooms"
            />
            <Divider sx={{ my: 1 }} />
            <Action href="/starred" icon="star" primary="Starred" />
            <Action href="/trash" icon="delete" primary="Trash" />
          </>
        ) : (
          <>
            <CategoryList />
          </>
        )}
      </Container>
    </>
  );
}
