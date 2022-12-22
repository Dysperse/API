import { LoadingButton } from "@mui/lab";
import type { CustomRoom, Item } from "@prisma/client";
import BoringAvatar from "boring-avatars";
import { encode } from "js-base64";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { OptionsGroup } from "../components/Boards/Board/OptionsGroup";
import { ErrorHandler } from "../components/Error";
import { Puller } from "../components/Puller";
import { FloatingActionButton } from "../components/Rooms/FloatingActionButton";
import { ItemCard } from "../components/Rooms/ItemCard";
import { fetchApiWithoutHook, useApi } from "../hooks/useApi";
import { neutralizeBack, revivalBack } from "../hooks/useBackButton";
import { colors } from "../lib/colors";
import type { ApiResponse } from "../types/client";

import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  FormLabel,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  SwipeableDrawer,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

function Tidy() {
  return (
    <>
      <Box
        sx={{
          gap: 2,
          borderRadius: 5,
          color: "white",
          p: 3,
          cursor: "pointer",
          userSelect: "none",
          transition: "all .3s",
          "&:active": {
            transform: "scale(.98)",
            transition: "none",
          },
          py: 2,
          width: "400px",
          backgroundImage: `url("data:image/svg+xml,%0A%3Csvg id='visual' viewBox='0 0 900 600' width='900' height='600' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'%3E%3Cpath d='M0 139L30 148C60 157 120 175 180 191C240 207 300 221 360 211C420 201 480 167 540 166C600 165 660 197 720 203C780 209 840 189 870 179L900 169L900 0L870 0C840 0 780 0 720 0C660 0 600 0 540 0C480 0 420 0 360 0C300 0 240 0 180 0C120 0 60 0 30 0L0 0Z' fill='%236198ff'%3E%3C/path%3E%3Cpath d='M0 241L30 248C60 255 120 269 180 286C240 303 300 323 360 313C420 303 480 263 540 262C600 261 660 299 720 307C780 315 840 293 870 282L900 271L900 167L870 177C840 187 780 207 720 201C660 195 600 163 540 164C480 165 420 199 360 209C300 219 240 205 180 189C120 173 60 155 30 146L0 137Z' fill='%233c80ff'%3E%3C/path%3E%3Cpath d='M0 373L30 381C60 389 120 405 180 412C240 419 300 417 360 398C420 379 480 343 540 343C600 343 660 379 720 387C780 395 840 375 870 365L900 355L900 269L870 280C840 291 780 313 720 305C660 297 600 259 540 260C480 261 420 301 360 311C300 321 240 301 180 284C120 267 60 253 30 246L0 239Z' fill='%230066ff'%3E%3C/path%3E%3Cpath d='M0 427L30 435C60 443 120 459 180 466C240 473 300 471 360 457C420 443 480 417 540 416C600 415 660 439 720 445C780 451 840 439 870 433L900 427L900 353L870 363C840 373 780 393 720 385C660 377 600 341 540 341C480 341 420 377 360 396C300 415 240 417 180 410C120 403 60 387 30 379L0 371Z' fill='%230059dd'%3E%3C/path%3E%3Cpath d='M0 601L30 601C60 601 120 601 180 601C240 601 300 601 360 601C420 601 480 601 540 601C600 601 660 601 720 601C780 601 840 601 870 601L900 601L900 425L870 431C840 437 780 449 720 443C660 437 600 413 540 414C480 415 420 441 360 455C300 469 240 471 180 464C120 457 60 441 30 433L0 425Z' fill='%23004cbb'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Typography
          sx={{
            fontWeight: "600",
            mb: 1,
          }}
          variant="h6"
        >
          Tidy
          <Chip label="Coming soon" color="error" size="small" sx={{ ml: 1 }} />
        </Typography>
        <Typography>Organize your items and declutter your home.</Typography>
      </Box>
    </>
  );
}

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
          sx: {
            width: {
              sm: "50vw",
            },
            maxWidth: "600px",
            maxHeight: "95vh",
            borderRadius: "20px 20px 0 0",
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
                textAlign: "center",
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
                height={40}
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

function RoomActionMenu({ itemRef, isPrivate, isCustom }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <IconButton
      disabled={global.permission == "read-only" || !isCustom}
      size="small"
      ref={itemRef}
      onClick={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        handleClick(e);
      }}
      onMouseDown={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      disableRipple
      sx={{
        transition: "none",
        "&:hover": {
          background: "rgba(200,200,200,.3)",
        },
        ...(global.permission == "read-only" && {
          display: { sm: "none" },
          opacity: "1!important",
        }),
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleClose();
        }}
      >
        <MenuItem onClick={handleClose} disabled>
          Rename
        </MenuItem>
        <MenuItem onClick={handleClose} disabled>
          Make {isPrivate ? "private" : "public"}
        </MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
      <span className="material-symbols-outlined">
        {global.permission == "read-only" ? (
          "chevron_right"
        ) : isPrivate ? (
          "lock"
        ) : isCustom ? (
          "more_horiz"
        ) : (
          <Box
            sx={{ display: { sm: "none!important" } }}
            className="material-symbols-rounded"
          >
            east
          </Box>
        )}
      </span>
    </IconButton>
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
  isPrivate = false,
  isCustom = false,
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
  isPrivate?: boolean;
  onClick?;
  isCustom?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const itemCount =
    count && count.byRoom[primary.toLowerCase()]
      ? count.byRoom[primary.toLowerCase()]
      : 0;
  const ref: any = React.useRef(null);
  return (
    <ListItem
      button
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        ref.current.click();
      }}
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
          <RoomActionMenu
            isCustom={isCustom}
            isPrivate={isPrivate}
            itemRef={ref}
          />
        )
      }
      className="room-button"
      sx={{
        "&:hover": {
          background: {
            sm:
              global.theme == "dark"
                ? "hsl(240,11%,13%)!important"
                : colors[themeColor][50] + "!important",
          },
        },
        borderRadius: 5,
        ...(router.asPath.toLowerCase().includes(primary.toLowerCase())
          ? {
              background:
                global.theme == "dark"
                  ? "hsl(240,11%,13%)!important"
                  : colors[themeColor][50] + "!important",
            }
          : {
              background: "transparent!important",
            }),
        ...(theme === "dark" && {
          "&:hover .MuiAvatar-root": {
            background: "hsl(240,11%,17%)",
          },
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar
          sx={{
            borderRadius: 4,
            color: global.user.darkMode ? "#fff" : colors[themeColor][900],
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
          <Typography className="text-sm sm:hidden font-normal">
            {itemCount} item{itemCount !== 1 && "s"}
          </Typography>
        }
      />
    </ListItem>
  );
}

function CreateRoom({ mutationUrl }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [isPrivate, setIsPrivate] = React.useState(false);

  const handleSubmit = () => {
    setLoading(true);
    fetchApiWithoutHook("property/rooms/create", {
      name: name,
      private: isPrivate ? "true" : "false",
    })
      .then(() => {
        setOpen(false);
        setLoading(false);
        setName("");
        toast.success("Room created");
        mutate(mutationUrl);
      })
      .catch(() => {
        toast.error(
          "An error occurred while trying to create your room. Please try again later."
        );
        setLoading(false);
      });
  };

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            maxWidth: "500px",
            borderRadius: "20px 20px 0 0",
          },
        }}
      >
        <Puller />
        <Box
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Typography variant="h6" className="font-bold">
            Create{" "}
            {global.property.profile.type === "study group"
              ? "container"
              : "room"}
          </Typography>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            label={
              global.property.profile.type === "study group"
                ? "Container name (Example: backpack, drawer, etc.)"
                : "Room name"
            }
            fullWidth
            variant="filled"
            margin="dense"
            autoFocus
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
            <Switch
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <FormLabel>
              <b>Private</b>
              <br />
              {isPrivate
                ? "Only you can see this " +
                  (global.property.profile.type === "study group"
                    ? "container"
                    : "room") +
                  " and its contents"
                : (global.property.profile.type === "study group"
                    ? "Container"
                    : "Room") + " will be visible to other group members"}
            </FormLabel>
          </Box>
          <LoadingButton
            variant="contained"
            fullWidth
            loading={loading}
            sx={{
              background: colors[themeColor][900] + "!important",
              mt: 2,
              borderRadius: 999,
            }}
            size="large"
            onClick={handleSubmit}
          >
            Create
          </LoadingButton>
        </Box>
      </SwipeableDrawer>
      <Action
        disableLoading
        icon="add_circle"
        primary={
          global.property.profile.type === "study group"
            ? "New container"
            : "New room"
        }
        onClick={() => setOpen(true)}
      />
    </>
  );
}

/**
 * Rooms popup
 */
function Rooms({ data, error }) {
  return (
    <>
      {data &&
        data.map((room: CustomRoom) => (
          <Action
            href={`/rooms/${encode(
              `${room.id},${room.name}`
            ).toString()}?custom=true`}
            icon="label"
            isPrivate={room.private}
            primary={room.name}
            key={room.id.toString()}
            isCustom={true}
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
  const [viewBy, setViewBy] = React.useState("Room");
  const { data } = useApi("property/inventory/count");

  const { data: dataRooms, url, error } = useApi("property/rooms");

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Head>
        <title>Items &bull; Carbon</title>
      </Head>
      <Box
        sx={{
          width: { xs: "100%", sm: 300 },
          flex: { xs: "100%", sm: "0 0 300px" },
          px: 1.5,
          display: { xs: children ? "none" : "block", sm: "block" },
          minHeight: "calc(100vh - 70px)",
          pt: { sm: 0.5 },
          height: { sm: "calc(100vh - 64px)" },
          overflowY: { sm: "scroll" },
          borderRight: { sm: "1px solid rgba(0,0,0,.1)" },
          ml: -1,
        }}
      >
        <Box
          sx={{
            display: { sm: "none" },
          }}
        >
          <FloatingActionButton />
        </Box>
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
              setViewBy("Category");
              handleClose();
            }}
            sx={{
              ...(viewBy === "Category" && {
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
            px: { xs: 1.5, sm: 0 },
            borderRadius: "15px!important",
          }}
        >
          <Typography
            sx={{ my: 5, fontWeight: "600", display: { sm: "none" } }}
            variant="h5"
          >
            {global.property.profile.type === "study group"
              ? "Belongings"
              : "Inventory"}
          </Typography>
          <OptionsGroup
            currentOption={viewBy}
            setOption={setViewBy}
            options={["Room", "Category"]}
          />
        </Box>
        {viewBy === "Room" ? (
          <>
            {global.property.profile.type === "study group" ? (
              <>
                <Action
                  href="/rooms/backpack"
                  icon="backpack"
                  primary="Backpack"
                  count={data}
                />
              </>
            ) : (
              <>
                <Action
                  href="/rooms/kitchen"
                  icon="blender"
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
              </>
            )}
            <Divider sx={{ my: 1 }} />
            <Rooms data={dataRooms} error={error} />
            <CreateRoom mutationUrl={url} />
            <Divider sx={{ my: 1 }} />
            {/* <Action href="/starred" icon="star" primary="Starred" /> */}
            {/* <Action href="/trash" icon="delete" primary="Trash" /> */}
          </>
        ) : (
          <CategoryList />
        )}
      </Box>
      {children ? (
        <Box
          sx={{
            maxHeight: { sm: "calc(100vh - 70px)" },
            minHeight: { sm: "calc(100vh - 64px)" },
            height: { sm: "calc(100vh - 64px)" },
            overflowY: { sm: "auto" },
            flexGrow: 1,
          }}
        >
          {children}
        </Box>
      ) : (
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            height: "calc(100vh - 70px)",
            width: "100%",
            fontWeight: "500",
            color: colors[themeColor][global.user.darkMode ? 50 : 800],
          }}
        >
          <Box
            sx={{
              gap: 2,
              borderRadius: 5,
              p: 3,
              py: 2,
              width: "400px",
              background: colors[themeColor][global.user.darkMode ? 900 : 50],
            }}
          >
            <Typography
              variant="h6"
              sx={{ ...(global.permission !== "read-only" && { mb: 1 }) }}
            >
              No room selected
            </Typography>
            {global.permission !== "read-only" && <FloatingActionButton sm />}
          </Box>
          {global.permission !== "read-only" && <Tidy />}
        </Box>
      )}
    </Box>
  );
}
