"use client";
import { ErrorHandler } from "@/components/Error";
import { CreateItem } from "@/components/Inventory/CreateItem";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Chip,
  Icon,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useSWR from "swr";
import { ItemPopup } from "./item-popup";

export function JumpBackIn() {
  const { session } = useSession();
  const router = useRouter();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  const { data, mutate, error } = useSWR(["property/inventory/recent"]);

  return (
    <>
      <Box
        sx={{
          p: 3,
          pb: 0,
          mt: 5,
          display: { sm: "none" },
        }}
      >
        <Typography
          variant="h2"
          className="font-heading"
          sx={{
            background: `linear-gradient(180deg, ${palette[11]}, ${palette[10]})`,
            WebkitBackgroundClip: "text",
            fontSize: "min(70px, 20vw)",
          }}
        >
          Inventory
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
            mt: 0.5,
            alignItems: "center",
          }}
        >
          <TextField
            variant="standard"
            placeholder="Search..."
            onClick={() => toast("Coming soon!")}
            InputProps={{
              readOnly: true,
              disableUnderline: true,
              sx: {
                background: palette[2],
                "&:focus-within": {
                  background: palette[3],
                },
                "& *::placeholder": {
                  color: palette[10] + "!important",
                },
                transition: "all .2s",
                px: 2,
                py: 0.3,
                borderRadius: 3,
              },
              startAdornment: (
                <InputAdornment position="start">
                  <Icon sx={{ color: palette[9] }}>search</Icon>
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            onClick={() => router.push("/rooms/audit")}
            sx={{
              color: palette[11],
              background: palette[2],
              "&:active": {
                background: palette[3],
              },
            }}
          >
            <Icon className="outlined">photo_camera</Icon>
          </IconButton>
          <CreateItem mutate={() => {}}>
            <IconButton
              sx={{
                color: palette[11],
                background: palette[2],
                "&:active": {
                  background: palette[3],
                },
              }}
            >
              <Icon>add</Icon>
            </IconButton>
          </CreateItem>
        </Box>
      </Box>
      <Typography
        sx={{
          my: { xs: 1, sm: 1.5 },
          mt: { xs: 1, sm: 1 },
          textTransform: "uppercase",
          fontWeight: 700,
          opacity: 0.5,
          fontSize: "13px",
          px: 4,
          pt: 2,
          color: palette[12],
          userSelect: "none",
          ...(data?.length === 0 && {
            display: "none",
          }),
        }}
      >
        Jump back in
      </Typography>
      {error && <ErrorHandler callback={mutate} />}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          px: { xs: 3, sm: 5 },
          mb: 3,
          overflowX: { xs: "scroll", sm: "unset" },
          flexWrap: { sm: "wrap" },
          justifyContent: { sm: "center" },
        }}
      >
        {data
          ? data.map((item) => (
              <ItemPopup key={item.id} item={item} mutateList={mutate}>
                <Box
                  sx={{
                    color: palette[11] + "!important",
                    borderWidth: "2px !important",
                    p: 1,
                    px: 2,
                    borderRadius: 3,
                    display: "flex",
                    background: addHslAlpha(palette[3], 0.5),
                    "&:hover": {
                      background: { sm: addHslAlpha(palette[3], 0.7) },
                    },
                    "&:active": {
                      background: palette[4],
                    },
                    alignItems: "center",
                    flexShrink: 0,
                    gap: 0.5,
                    opacity: 0.7,
                    width: 200,
                    height: 70,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        overflowX: "scroll",
                        maxWidth: "100%",
                      }}
                    >
                      {item.quantity && (
                        <Chip
                          size="small"
                          label={item.quantity + " pcs."}
                          icon={<Icon>interests</Icon>}
                        />
                      )}
                      {item.condition && (
                        <Chip
                          size="small"
                          label={item.condition}
                          icon={<Icon>question_mark</Icon>}
                        />
                      )}
                      {item.estimatedValue && (
                        <Chip
                          size="small"
                          label={item.estimatedValue}
                          icon={<Icon>attach_money</Icon>}
                        />
                      )}
                    </Box>
                  </Box>
                  <Icon sx={{ ml: "auto", flexShrink: 0 }}>
                    arrow_forward_ios
                  </Icon>
                </Box>
              </ItemPopup>
            ))
          : [...new Array(10)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={70}
                width={200}
                sx={{ flexShrink: 0 }}
              />
            ))}
      </Box>
    </>
  );
}
