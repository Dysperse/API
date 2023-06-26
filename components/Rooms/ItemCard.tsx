import Item from "@/components/ItemPopup";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { colors } from "@/lib/colors";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import type { Item as ItemType } from "@prisma/client";

/**
 * Item card
 */
export function ItemCard({
  mutationUrl,
  item,
}: {
  mutationUrl: string;
  item: ItemType;
}) {
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);

  const palette = useColor(session.themeColor, isDark);

  return (
    <Item id={item.id as any} mutationUrl={mutationUrl}>
      <Card
        sx={{
          boxShadow: "0",
          display: "block",
          my: { sm: 1 },
          width: "100%",
          maxWidth: "calc(100vw - 32.5px)",
          userSelect: "none",
          borderRadius: 5,
          color: palette[12],
          background: palette[2],
          "&:hover": {
            color: palette[12],
            background: palette[3],
          },
          "&:active": {
            background: palette[4],
          },
          mb: { xs: 2, sm: 0 },
          border: "2px solid transparent",
          ...(item.starred && {
            borderColor: colors.orange[isDark ? "A400" : 900],
          }),
          "& *:not(.MuiTouchRipple-root *, .override *)": {
            background: "transparent",
          },
        }}
      >
        <CardActionArea
          disableRipple
          sx={{
            flex: "0 0 100%",
            transition: "none!important",
            "&:focus-within": {
              background: "transparent!important",
            },
            background: "transparent!important",
            borderRadius: 5,
            "&:active": {
              transition: "none",
              boxShadow: "none!important",
            },
          }}
        >
          <CardContent sx={{ px: 3, py: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 0.2,
                    display: "block",
                  }}
                >
                  {item.name.substring(0, 18) || "(no title)"}
                  {item.name.length > 18 && "..."}
                </Typography>
                <div className="override">
                  {[item.room, ...JSON.parse(item.category)].map(
                    (category: string, index) => {
                      return (
                        <Chip
                          disabled={session?.permission === "read-only"}
                          size="small"
                          key={index}
                          label={category}
                          sx={{
                            pointerEvents: "none",
                            px: 1,
                            m: 0.5,
                            ml: 0,
                            color: "inherit",
                            background: palette[5],
                            textTransform: "capitalize",
                          }}
                        />
                      );
                    }
                  )}
                </div>
              </Box>
              <Typography variant="body1" sx={{ ml: "auto", flexShrink: 0 }}>
                {item.quantity.substring(0, 18) || ""}
                {item.quantity.length > 18 && "..."}
                {!item.quantity || (!item.quantity.includes(" ") && " pcs.")}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Item>
  );
}
