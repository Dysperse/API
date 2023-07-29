import { PropertyButton } from "@/components/Layout/Navigation/PropertyButton";
import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { vibrate } from "@/lib/client/vibration";
import {
  Box,
  Chip,
  Icon,
  IconButton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { cloneElement, useState } from "react";
import { preload } from "swr";

export function GroupModal({
  children,
  list = false,
  useRightClick = true,
}: any) {
  const session = useSession();
  const { data, fetcher, url, error } = useApi("user/properties");
  const [showMore, setShowMore] = useState(false);

  const palette = useColor(
    session?.property?.profile?.color,
    useDarkMode(session.darkMode)
  );

  const properties = [...session.properties, ...(data || [])]
    .filter((group) => group)
    .reduce((acc, curr) => {
      if (!acc.find((property) => property.propertyId === curr.propertyId)) {
        acc.push(curr);
      }
      return acc;
    }, [])
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  preload(url, fetcher);

  const drawer = (
    <SwipeableDrawer
      onClick={(e) => e.stopPropagation()}
      anchor="bottom"
      open={showMore}
      onClose={() => setShowMore(false)}
      PaperProps={{
        sx: { px: 1.5 },
      }}
    >
      <Puller showOnDesktop />
      <Typography
        variant="h4"
        className="font-heading"
        sx={{ textAlign: "center" }}
        gutterBottom
      >
        Groups
      </Typography>
      {properties.map((group: any) => (
        <PropertyButton
          list={list}
          handleClose={() => setShowMore(false)}
          key={group.id}
          group={group}
        />
      ))}
    </SwipeableDrawer>
  );

  const router = useRouter();

  if (children) {
    const trigger = cloneElement(children, {
      [useRightClick ? "onContextMenu" : "onClick"]: () => {
        vibrate(50);
        setShowMore(true);
      },
    });
    return (
      <>
        {trigger}
        {drawer}
      </>
    );
  }

  return (
    <>
      <Chip
        sx={{ mt: 1 }}
        label={session.property.profile.name}
        onDelete={() => setShowMore(true)}
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/groups/${session.property.propertyId}`);
        }}
        avatar={
          <Box
            sx={{
              width: 24,
              height: 24,
              background: `linear-gradient(${palette[9]}, ${palette[11]})`,
              borderRadius: 5,
            }}
          />
        }
        deleteIcon={
          <IconButton size="small">
            <Icon sx={{ color: "#fff!important" }}>sync_alt</Icon>
          </IconButton>
        }
      />
      {drawer}
    </>
  );
}
