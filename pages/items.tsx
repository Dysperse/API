import {
  Alert,
  Box,
  Divider,
  Skeleton,
  Toolbar,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useState } from "react";
import { ErrorHandler } from "../components/Error";
import { OptionsGroup } from "../components/OptionsGroup";
import { CreateRoom } from "../components/Rooms/items/CreateRoom";
import { Rooms } from "../components/Rooms/items/Rooms";
import { useApi } from "../lib/client/useApi";
import { useSession } from "../lib/client/useSession";
import { colors } from "../lib/colors";

const Action = dynamic(() => import("../components/Rooms/Action"));

const CategoryModal = dynamic(
  () => import("../components/Rooms/items/CategoryModal")
);

/**
 * Component to dispay items by category
 */
const CategoryList = React.memo(function CategoryList() {
  const { error, url, data } = useApi("property/inventory/categories");

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
            {[...new Array(15)].map((_, i) => (
              <Skeleton
                animation="wave"
                height={60}
                sx={{ width: "100%", mb: 2, borderRadius: 3 }}
                variant="rectangular"
                key={i}
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
  const session = useSession();
  const [viewBy, setViewBy] = useState("Room");

  const { data } = useApi("property/inventory/room/itemCount");
  const { data: dataRooms, url, error } = useApi("property/rooms");

  const actions = [
    {
      href: "/rooms/kitchen",
      icon: "blender",
      primary: "Kitchen",
    },
    {
      href: "/rooms/bedroom",
      icon: "bedroom_parent",
      primary: "Bedroom",
    },
    {
      href: "/rooms/bathroom",
      icon: "bathroom",
      primary: "Bathroom",
    },
    {
      href: "/rooms/garage",
      icon: "garage",
      primary: "Garage",
    },
    {
      href: "/rooms/dining",
      icon: "dining",
      primary: "Dining room",
    },
    {
      href: "/rooms/living",
      icon: "living",
      primary: "Living room",
    },
    {
      href: "/rooms/laundry",
      icon: "local_laundry_service",
      primary: "Laundry room",
    },
    {
      href: "/rooms/storage",
      icon: "inventory_2",
      primary: "Storage room",
    },
    {
      href: "/rooms/garden",
      icon: "yard",
      primary: "Garden",
    },
    {
      href: "/rooms/camping",
      icon: "camping",
      primary: "Camping",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Head>
        <title>Items</title>
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
          background: {
            sm: session.user.darkMode
              ? "hsl(240,11%,7%)"
              : session.user.darkMode
              ? "hsl(240,11%,7%)"
              : "hsl(240,11%,95%)",
          },
          ml: { sm: -1 },
        }}
      >
        <Box
          sx={{
            my: 4,
            px: { xs: 1.5, sm: 0 },
            borderRadius: "15px!important",
          }}
        >
          <Typography variant="h4" className="font-heading" sx={{ mb: 2 }}>
            {session.property.profile.type === "study group"
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
            {session.property.profile.type === "study group" ? (
              <Action
                mutationUrl={url}
                href="/rooms/backpack"
                icon="backpack"
                primary="Backpack"
                count={data}
              />
            ) : (
              <>
                {actions.map((action: any) => (
                  <Action
                    key={action.primary}
                    {...action}
                    mutationUrl={url}
                    count={data}
                  />
                ))}
              </>
            )}
            <Divider sx={{ my: 1.5, opacity: 0.7 }} />
            <Rooms data={dataRooms} error={error} mutationUrl={url} />
            <CreateRoom mutationUrl={url} />
            <Divider sx={{ my: 1.5, opacity: 0.7 }} />
            <Action
              href="/starred"
              mutationUrl={url}
              icon="star"
              primary="Starred"
              count={{
                byRoom: { starred: -3 },
              }}
            />
            <Action
              href="/trash"
              icon="delete"
              mutationUrl={url}
              primary="Trash"
              count={{
                byRoom: { trash: -3 },
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
            maxHeight: { sm: "100vh" },
            minHeight: { sm: "100vh" },
            height: { sm: "100vh" },
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
            height: "100vh",
            width: "100%",
            color:
              colors[session?.themeColor || "grey"][
                session.user.darkMode ? 50 : 800
              ],
          }}
        >
          <Typography variant="h6">No room selected</Typography>
        </Box>
      )}
    </Box>
  );
}
