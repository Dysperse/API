import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import type { Item as ItemType } from "@prisma/client";
import Item from "../../components/ItemPopup";
import { colors } from "../../lib/colors";
import { useSession } from "../../pages/_app";

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
          color: session.user.darkMode ? "hsl(240,11%,80%)" : "#303030",
          background: `${
            session.user.darkMode
              ? "hsl(240, 11%, 17%)"
              : "rgba(200,200,200,.3)"
          }!important`,
          "&:hover": {
            color: session.user.darkMode ? "hsl(240,11%,90%)" : "#000",
            background: `${
              session.user.darkMode
                ? "hsl(240, 11%, 20%)"
                : "rgba(200,200,200,.4)"
            }!important`,
          },
          "&:active": {
            color: session.user.darkMode ? "hsl(240,11%,95%)" : "#000",
            background: `${
              session.user.darkMode
                ? "hsl(240, 11%, 23%)"
                : "rgba(200,200,200,.6)"
            }!important`,
          },
          mb: { xs: 2, sm: 0 },
          border: "2px solid transparent",
          ...(item.starred && {
            borderColor: colors.orange[session.user.darkMode ? "A400" : 900],
          }),
          "& *:not(.MuiTouchRipple-root *, .override *)": {
            background: "transparent",
          },
        }}
      >
        <CardActionArea
          disableRipple
          sx={{
            cursor: "unset!important",
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
                            mr: 1,
                            color: "inherit",
                            background: session.user.darkMode
                              ? "hsla(240,11%,40%,.3)"
                              : "rgba(200,200,200,.3)",
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
