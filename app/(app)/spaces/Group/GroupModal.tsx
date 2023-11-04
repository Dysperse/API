import { PropertyButton } from "@/components/Layout/Navigation/SpaceSwitcher";
import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { vibrate } from "@/lib/client/vibration";
import {
  Box,
  Chip,
  Icon,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cloneElement, useState } from "react";
import useSWR from "swr";

export function GroupModal({
  defaultPalette,
  children,
  list = false,
  useRightClick = true,
  onSuccess = () => {},
}: any) {
  const { session } = useSession();
  const [showMore, setShowMore] = useState(false);
  const [showInvitations, setShowInvitations] = useState(false);

  const { data } = useSWR(!showMore ? null : ["user/spaces"]);

  const personPalette = useColor(
    defaultPalette || session.themeColor,
    useDarkMode(session.darkMode)
  );
  const palette = useColor(
    session?.property?.profile?.color,
    useDarkMode(session.darkMode)
  );

  const properties = (data || [])
    .filter((group) => group)
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  const drawer = (
    <SwipeableDrawer
      onKeyDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      anchor="bottom"
      open={showMore}
      onClose={() => setShowMore(false)}
      PaperProps={{
        sx: { px: 1.5, pb: 3 },
      }}
    >
      <Puller showOnDesktop />
      <AnimatePresence mode="wait">
        <motion.div
          key={showInvitations ? "1" : "0"}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <Typography
            variant="h4"
            className="font-heading"
            sx={{ textAlign: "center" }}
            gutterBottom
          >
            {showInvitations ? "Invitations" : "Groups"}
          </Typography>
          {properties
            .filter((p) => (showInvitations ? !p.accepted : p.accepted))
            .map((group: any, index) => (
              <PropertyButton
                defaultPalette={defaultPalette}
                key={index}
                list={list}
                handleClose={() => setShowMore(false)}
                group={group}
                onSuccess={onSuccess}
              />
            ))}
          {showInvitations &&
            properties.filter((p) => !p.accepted).length == 0 && (
              <Box
                sx={{
                  background: personPalette[2],
                  p: 2,
                  borderRadius: 5,
                  mb: 2,
                }}
              >
                <Typography>
                  Groups you&apos;re invited to will appear here
                </Typography>
              </Box>
            )}
          <ListItemButton
            sx={{
              gap: 2,
              borderRadius: 99,
              transition: "transform .2s",
              background: "transparent!important",
              "&:active": {
                transform: { sm: "scale(0.97)" },
              },
              "& *": {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
              "&:hover": {
                background: { sm: personPalette[2] + "!important" },
              },
            }}
            onClick={() => {
              setShowInvitations(!showInvitations);
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                background: personPalette[2],
                color: personPalette[9],
                borderRadius: 99,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon>
                {showInvitations ? "arrow_back_ios_new" : "person_add"}
              </Icon>
            </Box>
            <ListItemText
              primary={showInvitations ? "Groups" : "Invitations"}
              sx={{ color: personPalette[12] }}
              secondary={
                showInvitations
                  ? null
                  : properties.filter((p) => !p.accepted).length + " new"
              }
            />
            <ListItemIcon sx={{ minWidth: "unset" }}>
              <Icon>{showInvitations ? "" : "arrow_forward_ios"}</Icon>
            </ListItemIcon>
          </ListItemButton>
        </motion.div>
      </AnimatePresence>
    </SwipeableDrawer>
  );

  const router = useRouter();

  if (children) {
    const trigger = cloneElement(children, {
      [useRightClick ? "onContextMenu" : "onClick"]: (e) => {
        e.stopPropagation();
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
        label={session.space.info.name}
        onDelete={() => setShowMore(true)}
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/groups/${session.space.info.id}`);
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
