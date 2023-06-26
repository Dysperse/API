import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import {
  Box,
  Chip,
  Icon,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { CreateItemModal } from "./CreateItem/modal";

/**
 * Header component for the room
 * @param useAlias
 * @param room
 * @param itemCount
 */
export function Header({
  mutationUrl,
  room,
  itemCount,
}: {
  mutationUrl: string;
  room: any;
  itemCount: number;
}) {
  const router = useRouter();
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);

  const palette = useColor(session.themeColor, isDark);

  return (
    <ListItem
      sx={{
        transition: "transform .2s !important",
        overflow: "hidden",
        background: { sm: palette[2] },
        position: { sm: "sticky" },
        top: 0,
        mb: 2,
        zIndex: 99,
        backdropFilter: "blur(10px)",
        py: 3,
        pt: 1,
        "&:focus": {
          background: isDark ? "hsl(240,11%,27%)" : "hsla(240,11%,97%, 0.8)",
        },
      }}
    >
      <Head>
        <title>{capitalizeFirstLetter(room.name) || "Items"} &bull; Room</title>
      </Head>
      <Box
        sx={{
          zIndex: 9,
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <ListItemText
          sx={{
            my: 1.4,
            ml: { md: 2 },
          }}
          primary={
            <Typography
              sx={{
                textDecoration: "underline",
                fontSize: {
                  xs: "50px",
                  md: "55px",
                },
              }}
              gutterBottom
              variant="h4"
              className="font-heading"
            >
              {capitalizeFirstLetter(room.name)}
            </Typography>
          }
          secondary={
            <Typography
              sx={{
                color: "inherit",
                mt: -0.5,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Chip
                label={`${itemCount} item${itemCount !== 1 ? "s" : ""}`}
                size="small"
              />
              {room.private && (
                <Chip label="Only you" size="small" icon={<Icon>lock</Icon>} />
              )}
            </Typography>
          }
        />
      </Box>
      <ListItemAvatar
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <CreateItemModal room={room.id || room.name} mutationUrl={mutationUrl}>
          <IconButton
            sx={{
              background: "transparent",
              display: "none",
            }}
            id="createItemTrigger"
            disabled={session.permission === "read-only"}
          >
            <Icon className="outlined">add_circle</Icon>
          </IconButton>
        </CreateItemModal>
        <IconButton
          onClick={() => router.push("/items")}
          sx={{ display: { xs: "none", md: "inline-flex" } }}
        >
          <Icon className="outlined">close</Icon>
        </IconButton>
      </ListItemAvatar>
    </ListItem>
  );
}
