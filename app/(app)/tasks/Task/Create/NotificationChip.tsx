import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Chip,
  Icon,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";

export function NotificationChip({ titleRef, data, setData, chipStyles }) {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        style={{ display: "inline-block" }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Chip
          onClick={() => setOpen(true)}
          sx={chipStyles(data.notifications.length > 0)}
          icon={<Icon>notifications</Icon>}
          label={
            data.notifications.length === 0
              ? "Notify me"
              : data.notifications.length === 1
              ? `${data.notifications[0]} minutes before`
              : `${data.notifications.length} notifications`
          }
        />
      </motion.div>

      <SwipeableDrawer
        open={open}
        onClose={() => {
          setOpen(false);
          titleRef?.current?.focus();
        }}
        anchor="bottom"
      >
        <Puller showOnDesktop />
        <Box sx={{ p: 2, pt: 0 }}>
          {[5, 10, 15, 20, 25, 30, 60].map((minutes) => (
            <ListItemButton
              key={minutes}
              sx={{ mb: 0.3 }}
              selected={
                data.notifications.includes(minutes) &&
                data.notifications.length !== 9
              }
              onClick={() => {
                setData((d) => {
                  if (d.notifications.includes(minutes)) {
                    return {
                      ...d,
                      notifications: d.notifications.filter(
                        (m) => m !== minutes
                      ),
                    };
                  } else {
                    return {
                      ...d,
                      notifications: [...d.notifications, minutes],
                    };
                  }
                });
              }}
            >
              <ListItemText primary={`${minutes} minutes before`} />
              {data.notifications.includes(minutes) &&
                data.notifications.length !== 9 && (
                  <Icon sx={{ ml: "auto" }}>check</Icon>
                )}
            </ListItemButton>
          ))}
          <Box sx={{ display: "flex", gap: 2 }}>
            <ListItemButton
              sx={{ background: palette[2], width: "100%" }}
              onClick={() => {
                setData((d) => ({
                  ...d,
                  notifications:
                    data.notifications.length !== 9
                      ? [5, 10, 15, 20, 25, 30, 40, 50, 60]
                      : [],
                }));
              }}
              selected={data.notifications.length === 9}
            >
              <ListItemText primary="Bother me" />
              {data.notifications.length === 9 && (
                <Icon sx={{ ml: "auto" }}>check</Icon>
              )}
            </ListItemButton>
            <ListItemButton
              sx={{ background: palette[2], width: "100%" }}
              onClick={() => setOpen(false)}
            >
              <ListItemText
                primary={data.notifications.length === 0 ? "Close" : "Done"}
              />
              <Icon>arrow_forward_ios</Icon>
            </ListItemButton>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
