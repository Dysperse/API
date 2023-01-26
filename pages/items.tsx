import { decode } from "js-base64";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { OptionsGroup } from "../components/Boards/Board/OptionsGroup";
import { ErrorHandler } from "../components/Error";
import { FloatingActionButton } from "../components/Rooms/FloatingActionButton";
import { useApi } from "../hooks/useApi";
import { colors } from "../lib/colors";
import type { ApiResponse } from "../types/client";

import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
} from "@mui/material";
import { CategoryModal } from "../components/Rooms/items/CategoryModal";
import { CreateRoom } from "../components/Rooms/items/CreateRoom";
import { RoomActionMenu } from "../components/Rooms/items/RoomActionMenu";
import { Rooms } from "../components/Rooms/items/Rooms";

/**
 * Component to dispay items by category
 */
const CategoryList = React.memo(function CategoryList() {
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
            {[...new Array(15)].map(() => (
              <Skeleton
                animation="wave"
                height={60}
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
});

/**
 * Room button
 * @param {string | JSX.Element} icon - The room's icon
 * @param {string | JSX.Element} primary - The room's name
 * @param {string} href - The room's link
 * @param {Function} onClick - Callback function for the room's click event
 */
export const Action = React.memo(function Action({
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
      : -1;
  const ref: any = React.useRef(null);
  return (
    <ListItem
      button
      disableRipple
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        ref.current.click();
        navigator.vibrate(50);
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
          <CircularProgress
            size={15}
            sx={{
              ml: "auto",
              mt: "8px",
              animationDuration: ".4s",
              transitionDuration: ".4s",
            }}
            disableShrink
          />
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
              global.theme === "dark"
                ? "hsl(240,11%,13%)!important"
                : colors[themeColor][50] + "!important",
          },
        },
        border: "1px solid transparent",
        "&:active": {
          border: {
            sm:
              "1px solid " +
              (global.theme === "dark"
                ? "hsl(240,11%,13%)!important"
                : colors[themeColor][100] + "!important"),
          },
          background: {
            xs:
              global.theme === "dark"
                ? "hsl(240,11%,13%)!important"
                : colors[themeColor][50] + "!important",
          },
        },
        borderRadius: 5,
        transition: "none!important",
        ...((!isCustom &&
          router.asPath.toLowerCase().includes(primary.toLowerCase())) ||
        (isCustom &&
          router.asPath.split("rooms/")[1] &&
          decode(router.asPath.split("rooms/")[1]).includes(
            primary.toLowerCase()
          ))
          ? {
              background:
                global.theme === "dark"
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
        sx={
          {
            // ml: "auto",
            // float: "right",
          }
        }
        primary={
          <Typography
            sx={{
              fontWeight: "500",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {primary}
          </Typography>
        }
        secondary={
          <Typography
            className="text-sm sm font-normal"
            sx={{
              ...(!count &&
                itemCount !== -1 && {
                  filter: "blur(2px)!important",
                }),
            }}
          >
            {itemCount !== -1 ? itemCount : "No"} item{itemCount !== 1 && "s"}
          </Typography>
        }
      />
    </ListItem>
  );
});

/**
 * Top-level component for the items page
 */
export default function Inventory({ children = null }: any) {
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
        <title>Items &bull; Dysperse</title>
      </Head>
      <Box
        sx={{
          width: { xs: "100%", sm: 300 },
          flex: { xs: "100%", sm: "0 0 300px" },
          px: 1.5,
          display: { xs: children ? "none" : "block", sm: "block" },
          minHeight: "calc(100vh - var(--navbar-height))",
          pt: { sm: 0.5 },
          height: { sm: "calc(100vh - var(--navbar-height))" },
          overflowY: { sm: "scroll" },
          borderRight: {
            sm: global.user.darkMode
              ? "1px solid hsl(240,11%,15%)"
              : "1px solid rgba(200,200,200,.3)",
          },
          ml: { sm: -1 },
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
          <h1 className="text-4xl underline font-heading my-10 sm:hidden font-light">
            {global.property.profile.type === "study group"
              ? "Belongings"
              : "Inventory"}
          </h1>
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
            <Action href="/trash" icon="delete" primary="Trash" />
          </>
        ) : (
          <CategoryList />
        )}
      </Box>
      {children ? (
        <Box
          sx={{
            maxHeight: { sm: "calc(100vh - var(--navbar-height))" },
            minHeight: { sm: "calc(100vh - var(--navbar-height))" },
            height: { sm: "calc(100vh - var(--navbar-height))" },
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
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ ...(global.permission !== "read-only" && { mb: 2 }) }}
            >
              <u>No room selected</u>
            </Typography>
            {global.permission !== "read-only" && <FloatingActionButton sm />}
          </Box>
        </Box>
      )}
    </Box>
  );
}
