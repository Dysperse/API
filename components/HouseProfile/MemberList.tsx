import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import BoringAvatar from "boring-avatars";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import React, { useCallback } from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import type { ApiResponse } from "../../types/client";
import { ErrorHandler } from "../ErrorHandler";
import { AddPersonModal } from "./AddPersonModal";

/**
 * Check if a string is a valid email address
 * @param email Original email string
 * @returns Is the email valid? True/False
 */
export function isEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

/**
 * Member card
 * @param {any} {member}
 * @returns {any}
 */
function Member({ setOpen, member }): any {
  const [deleted, setDeleted] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  return deleted ? (
    <>This user no longer has access to your home</>
  ) : (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box>
          <BoringAvatar
            size={35}
            name={member.user.name}
            variant="beam"
            colors={["#801245", "#F4F4DD", "#DCDBAF", "#5D5C49", "#3D3D34"]}
          />
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: "600",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {member.user.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {member.user.email}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              maxWidth: "100%",
              overflow: "hidden",
              mx: "auto",
              textOverflow: "ellipsis",
              display: "flex",
              mt: 0.5,
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span className="material-symbols-rounded">
              {member.permission === "member"
                ? "group"
                : member.permission == "owner"
                ? "productivity"
                : "visibility"}
            </span>
            <span
              style={{ marginTop: member.permission === "owner" ? "-4px" : "" }}
            >
              {member.permission == "member"
                ? "Member"
                : member.permission == "owner"
                ? "Owner"
                : "Read-only access"}
            </span>
          </Typography>
        </Box>
      </Box>
      {global.property.permission !== "owner" ? null : (
        <LoadingButton
          loading={loading}
          variant="outlined"
          sx={{
            borderWidth: "2px!important",
            width: "100%",
            mt: 1.5,
            color: colors.red[900],
            "&:not(.MuiLoadingButton-loading, .Mui-disabled)": {
              borderColor: `${colors.red[900]}!important`,
            },
            borderRadius: 4,
          }}
          onClick={() => {
            if (member.permission === "owner") {
              document.getElementById("settingsTrigger")?.click();
              setOpen(false);
              return;
            }
            if (
              confirm(
                "Remove member from your home? This person cannot join unless you invite them again."
              )
            ) {
              setLoading(true);
              fetchApiWithoutHook("property/members/remove", {
                id: member.id,
              }).then(() => {
                toast.success("Removed person from your home");
                setLoading(false);
                setDeleted(true);
              });
            }
          }}
        >
          {member.permission === "owner" ? "My account" : "Remove"}
        </LoadingButton>
      )}
    </Box>
  );
}

/**
 * Member list
 * @param {any} {color}
 * @returns {JSX.Element}
 */

export function MemberList({ color, setOpen }: any): JSX.Element {
  const { error, loading, data }: ApiResponse = useApi("property/members");
  const trigger = useMediaQuery("(max-width: 600px)");
  const images = data
    ? [
        ...data.map((member) => {
          return {
            content: <Member setOpen={setOpen} member={member} />,
          };
        }),
      ]
    : [];

  const [emblaRef, emblaApi]: any = useEmblaCarousel(
    {
      dragFree: true,
    },
    [WheelGesturesPlugin()]
  );
  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );

  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  React.useEffect(() => {
    if (emblaApi) {
      setTimeout(() => {
        emblaApi.reInit();
      }, 1000);
    }
  }, [emblaApi]);

  return error ? (
    <ErrorHandler
      error={"An error occured while trying to fetch your members"}
    />
  ) : (
    <>
      <Box style={{ width: "100%", display: "flex", marginTop: "-40px" }}>
        <AddPersonModal
          color={color}
          members={loading ? [] : data.map((member) => member.user.email)}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        {!trigger && (
          <IconButton
            onClick={scrollPrev}
            sx={{
              background: `${colors[color][100]}!important`,
              color: `${colors[color][900]}!important`,
            }}
          >
            <span className="material-symbols-rounded">chevron_left</span>
          </IconButton>
        )}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {images.map((step, index) => (
              <Box
                key={Math.random().toString()}
                className="embla__slide"
                sx={{
                  pl: index == 0 ? 0 : 2,
                  flex: "0 0 100%",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    userSelect: "none",
                    px: 2.5,
                    borderRadius: 5,
                    background: global.user.darkMode
                      ? "hsl(240, 11%, 30%)"
                      : colors[color][100],
                  }}
                >
                  {step.content}
                </Box>
              </Box>
            ))}
          </div>
        </div>
        {!trigger && (
          <IconButton
            onClick={scrollNext}
            sx={{
              background: `${colors[color][100]}!important`,
              color: `${colors[color][900]}!important`,
            }}
          >
            <span className="material-symbols-rounded">chevron_right</span>
          </IconButton>
        )}
      </Box>
    </>
  );
}
