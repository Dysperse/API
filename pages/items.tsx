import Head from "next/head";
import React from "react";
import { ErrorHandler } from "../components/Error";
import { OptionsGroup } from "../components/OptionsGroup";
import { FloatingActionButton } from "../components/Rooms/FloatingActionButton";
import { useApi } from "../hooks/useApi";
import { colors } from "../lib/colors";
import type { ApiResponse } from "../types/client";

import {
  Alert,
  Box,
  Divider,
  Menu,
  MenuItem,
  Skeleton,
  Toolbar,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import { CreateRoom } from "../components/Rooms/items/CreateRoom";
import { Rooms } from "../components/Rooms/items/Rooms";

const Action = dynamic(() => import("../components/Rooms/Action"));

const CategoryModal = dynamic(
  () => import("../components/Rooms/items/CategoryModal")
);

/**
 * Component to dispay items by category
 */
const CategoryList = React.memo(function CategoryList() {
  const { error, url, data }: ApiResponse = useApi(
    "property/inventory/categories"
  );

  return (
    <>
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your items" />
      )}
      {!error && data ? (
        <>
          {[...new Set(data)].map((category: any) => (
            <CategoryModal
              mutationUrl={url}
              category={category}
              key={category.toString()}
            />
          ))}
          {[...new Set(data)].length === 0 && (
            <Alert severity="info">
              You haven&apos;t added any categories to items yet
            </Alert>
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
  const { data } = useApi("property/inventory/room/itemCount");

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
          minHeight: "100vh",
          pt: { sm: 0.5 },
          height: { sm: "100vh" },
          overflowY: { sm: "scroll" },
          background: { sm: global.user.darkMode ? "hsl(240,11%,7%)" : "#fff" },
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
                  mutationUrl={url}
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
                  mutationUrl={url}
                  icon="blender"
                  primary="Kitchen"
                  count={data}
                />
                <Action
                  href="/rooms/bedroom"
                  icon="bedroom_parent"
                  mutationUrl={url}
                  primary="Bedroom"
                  count={data}
                />
                <Action
                  count={data}
                  href="/rooms/bathroom"
                  icon="bathroom"
                  mutationUrl={url}
                  primary="Bathroom"
                />
                <Action
                  count={data}
                  href="/rooms/garage"
                  mutationUrl={url}
                  icon="garage"
                  primary="Garage"
                />
                <Action
                  count={data}
                  href="/rooms/dining"
                  icon="dining"
                  mutationUrl={url}
                  primary="Dining room"
                />
                <Action
                  count={data}
                  href="/rooms/living"
                  icon="living"
                  mutationUrl={url}
                  primary="Living room"
                />
                <Action
                  href="/rooms/laundry"
                  mutationUrl={url}
                  count={data}
                  icon="local_laundry_service"
                  primary="Laundry room"
                />
                <Action
                  mutationUrl={url}
                  href="/rooms/storage"
                  count={data}
                  icon="inventory_2"
                  primary="Storage room"
                />
                <Action
                  href="/rooms/garden"
                  count={data}
                  icon="yard"
                  mutationUrl={url}
                  primary="Garden"
                />
                <Action
                  href="/rooms/camping"
                  count={data}
                  mutationUrl={url}
                  icon="camping"
                  primary="Camping"
                />
              </>
            )}
            <Divider sx={{ my: 1 }} />
            <Rooms data={dataRooms} error={error} mutationUrl={url} />
            <CreateRoom mutationUrl={url} />
            <Divider sx={{ my: 1 }} />
            {/* <Action href="/starred" icon="star" primary="Starred" /> */}
            <Action
              href="/trash"
              icon="delete"
              mutationUrl={url}
              primary="Trash"
              count={{
                byRoom: {
                  trash: -3,
                },
              }}
            />
            <Toolbar />
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
