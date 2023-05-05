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
import { rooms } from "../components/Rooms/rooms";
import { useApi } from "../lib/client/useApi";
import { useSession } from "../lib/client/useSession";

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

  return (
    <Box sx={{ display: "flex" }}>
      <Head>
        <title>Items</title>
      </Head>
      <Box
        sx={{
          width: { xs: "100%", md: 300 },
          flex: { xs: "100%", md: "0 0 300px" },
          px: 1.5,
          display: { xs: children ? "none" : "block", md: "block" },
          minHeight: "100vh",
          pt: { md: 0.5 },
          height: { md: "100vh" },
          overflowY: { md: "scroll" },
          background: {
            md: session.user.darkMode
              ? "hsl(240,11%,7%)"
              : session.user.darkMode
              ? "hsl(240,11%,7%)"
              : "hsl(240,11%,95%)",
          },
          ml: { md: -1 },
        }}
      >
        <Box
          sx={{
            my: 4,
            px: { xs: 1.5, md: 0 },
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
              rooms.map((action: any) => (
                <Action
                  key={action.primary}
                  {...action}
                  mutationUrl={url}
                  count={data}
                />
              ))
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
            maxHeight: { md: "100vh" },
            minHeight: { md: "100vh" },
            height: { md: "100vh" },
            overflowY: { md: "auto" },
            flexGrow: 1,
          }}
        >
          {children}
        </Box>
      ) : (
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            height: "100vh",
            width: "100%",
            color: `hsl(240,11%,${session.user.darkMode ? 90 : 10}%)`,
          }}
        >
          <Typography variant="h6">No room selected</Typography>
        </Box>
      )}
    </Box>
  );
}
