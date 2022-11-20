import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import type { CustomRoom, Item } from "@prisma/client";
import BoringAvatar from "boring-avatars";
import { encode } from "js-base64";
import { useRouter } from "next/router";
import React from "react";
import { ErrorHandler } from "../components/error";
import { Puller } from "../components/Puller";
import { FloatingActionButton } from "../components/Rooms/FloatingActionButton";
import { ItemCard } from "../components/Rooms/ItemCard";
import { fetchApiWithoutHook, useApi } from "../hooks/useApi";
import { neutralizeBack, revivalBack } from "../hooks/useBackButton";
import { colors } from "../lib/colors";
import type { ApiResponse } from "../types/client";

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
            borderRadius: "20px 20px 0 0",
            mx: "auto",
            ...(global.user.darkMode && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 3, pt: 0, overflow: "scroll" }}>
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
          {data
            .filter((item) => item)
            .map((item: Item) => (
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
          fetchApiWithoutHook("property/inventory/categoryList", {
            category: category,
          })
            .then((res) => {
              setData(res);
              setOpen(true);
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
            });
        }}
        sx={{
          mb: 1,
          transition: "transform .2s !important",
          gap: 2,
          borderRadius: 4,
          "&:active": {
            transition: "none!important",
            transform: "scale(.97)",
            background: global.user.darkMode
              ? "hsl(240, 11%, 20%)"
              : "rgba(200,200,200,.4)",
          },
          ...(theme === "dark" && {
            "&:hover .MuiAvatar-root": {
              background: "hsl(240,11%,27%)",
            },
          }),
        }}
      >
        <BoringAvatar
          name={category}
          size={30}
          colors={["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"]}
        />
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {category}{" "}
              {loading && <CircularProgress size={20} sx={{ ml: "auto" }} />}
            </Box>
          }
        />
      </ListItem>
    </>
  );
}

/**
 * Component to dispay items by category
 */
function CategoryList() {
  const { error, data }: ApiResponse = useApi("property/inventory/categories");

  return (
    <>
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your items" />
      )}
      {!error && data ? (
        <>
          {[...new Set(data)].map((category: any) => (
            <CategoryModal category={category} key={category.toString()} />
          ))}
          {[...new Set(data)].length === 0 && (
            <Box
              sx={{
                p: 2,
                my: 1,
                background: "rgba(200,200,200,.3)",
                borderRadius: 5,
                fontWeight: "500",
              }}
            >
              You haven&apos;t added any categories to items yet
            </Box>
          )}
        </>
      ) : (
        !error && (
          <>
            {[...new Array(5)].map(() => (
              <Skeleton
                animation="wave"
                height={30}
                sx={{ width: "100%", mb: 2, borderRadius: 3 }}
                variant="rectangular"
                key={Math.random().toString()}
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
function Action({
  count,
  icon,
  disableLoading = false,
  primary,
  href,
  onClick,
}: {
  disableLoading?: boolean;
  count?: {
    byRoom: {
      [key: string]: string | number | boolean;
    };
  };
  icon: string | JSX.Element;
  primary: string;
  href?: string;
  onClick?;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const itemCount =
    count && count.byRoom[primary.toLowerCase()]
      ? count.byRoom[primary.toLowerCase()]
      : 0;
  return (
    <ListItem
      button
      onClick={() => {
        if (href) router.push(href).then(() => setLoading(false));
        else {
          onClick && onClick();
        }
        setLoading(true);
      }}
      secondaryAction={
        !disableLoading && loading ? (
          <CircularProgress size={15} sx={{ ml: "auto", mt: "8px" }} />
        ) : (
          <Box
            sx={{
              display: { sm: "none" },
            }}
          >
            <span
              className="material-symbols-rounded"
              style={{ marginTop: "10px" }}
            >
              chevron_right
            </span>
          </Box>
        )
      }
      sx={{
        mb: 1,
        transition: "transform .1s !important",
        borderRadius: 4,
        "&:active": {
          transform: "scale(.99)",
          background: "transparent!important",
        },
        "&:hover": {
          background: { sm: colors[themeColor][50] + "!important" },
        },
        ...(router.asPath.toLowerCase().includes(primary.toLowerCase())
          ? {
              background: colors[themeColor][50] + "!important",
            }
          : {
              background: "transparent!important",
            }),
        ...(theme === "dark" && {
          "&:hover .MuiAvatar-root": {
            background: "hsl(240,11%,27%)",
          },
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar
          sx={{
            color: global.user.darkMode ? "#fff" : colors[themeColor][900],
            borderRadius: 4,
            background: global.user.darkMode
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
        secondary={
          <Typography
            sx={{
              fontWeight: "400",
              fontSize: "15px",
              display: { sm: "none" },
            }}
          >
            {itemCount} item{itemCount !== 1 && "s"}
          </Typography>
        }
      />
    </ListItem>
  );
}

/**
 * Rooms popup
 */
function Rooms() {
  const { data, error } = useApi("property/rooms");

  return (
    <>
      {data &&
        data.map((room: CustomRoom) => (
          <Action
            href={`/rooms/${encode(
              `${room.id},${room.name}`
            ).toString()}?custom=true`}
            icon="label"
            primary={room.name}
            key={room.id.toString()}
          />
        ))}
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your items" />
      )}
    </>
  );
}

/**
 * Top-level component for the items page
 */
export default function Categories({ children = null }: any) {
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
  const { data } = useApi("property/inventory/count");

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box
        sx={{
          width: { sm: 300 },
          flex: { sm: "0 0 300px" },
          mt: { sm: -6 },
          pt: { sm: 4 },
          px: 1,
          minHeight: "100vh",
          height: "100%",
          overflowY: "scroll",
          borderRight: { sm: "1px solid rgba(0,0,0,.1)" },
          borderLeft: { sm: "1px solid rgba(0,0,0,.1)" },
        }}
      >
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
                  colors[global.themeColor][global.user.darkMode ? 700 : 300],
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
                  colors[global.themeColor][global.user.darkMode ? 700 : 300],
              }),
            }}
          >
            Category
          </MenuItem>
        </Menu>
        <Box
          sx={{
            my: 4,
            px: 1,
            borderRadius: "15px!important",
          }}
        >
          <Typography
            sx={{ my: 5, fontWeight: "600", display: { sm: "none" } }}
            variant="h5"
          >
            Inventory
          </Typography>
          <ButtonGroup
            variant="outlined"
            sx={{
              p: 0.2,
              borderRadius: "15px!important",
              width: "100%",
              background: `${
                colors[themeColor][global.theme !== "dark" ? 100 : 900]
              }!important`,
            }}
            aria-label="outlined primary button group"
          >
            <Button
              variant="contained"
              disableElevation
              onClick={() => setViewBy("room")}
              sx={{
                px: 5,
                mr: 0.1,
                borderRadius: "15px!important",
                transition: "none!important",
                width: "50%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                ...(viewBy !== "room" && {
                  background: `${
                    colors[themeColor][global.theme !== "dark" ? 100 : 900]
                  }!important`,
                  color: `${
                    colors[themeColor][global.user.darkMode ? 50 : 900]
                  }!important`,
                }),
              }}
            >
              Room
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={() => setViewBy("category")}
              sx={{
                px: 5,
                borderRadius: "15px!important",
                borderWidth: "2px!important",
                transition: "none!important",
                width: "50%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                ...(viewBy !== "category" && {
                  background: `${
                    colors[themeColor][global.theme !== "dark" ? 100 : 900]
                  }!important`,

                  color: `${
                    colors[themeColor][global.user.darkMode ? 50 : 900]
                  }!important`,
                }),
              }}
            >
              Category
            </Button>
          </ButtonGroup>
        </Box>
        {viewBy === "room" ? (
          <>
            <Action
              href="/rooms/kitchen"
              icon="oven_gen"
              primary="Kitchen"
              count={data}
            />
            <Action
              href="/rooms/bedroom"
              icon="bedroom_parent"
              primary="Bedroom"
              count={data}
            />
            <Action
              count={data}
              href="/rooms/bathroom"
              icon="bathroom"
              primary="Bathroom"
            />
            <Action
              count={data}
              href="/rooms/garage"
              icon="garage"
              primary="Garage"
            />
            <Action
              count={data}
              href="/rooms/dining"
              icon="dining"
              primary="Dining room"
            />
            <Action
              count={data}
              href="/rooms/living"
              icon="living"
              primary="Living room"
            />
            <Action
              href="/rooms/laundry"
              count={data}
              icon="local_laundry_service"
              primary="Laundry room"
            />
            <Action
              href="/rooms/storage"
              count={data}
              icon="inventory_2"
              primary="Storage room"
            />
            <Action
              href="/rooms/garden"
              count={data}
              icon="yard"
              primary="Garden"
            />
            <Action
              href="/rooms/camping"
              count={data}
              icon="camping"
              primary="Camping"
            />
            <Divider sx={{ my: 1 }} />
            <Rooms />
            <Action
              onClick={() =>
                document.getElementById("setCreateRoomModalOpen")?.click()
              }
              disableLoading
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
          <CategoryList />
        )}
      </Box>
      {children ?? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 65px)",
            width: "100%",
            fontWeight: "500",
            color: colors[themeColor][global.user.darkMode ? 50 : 500],
          }}
        >
          No room selected
        </Box>
      )}
    </Box>
  );
}
