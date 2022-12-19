import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  CardActionArea,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import BoringAvatar from "boring-avatars";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import React, { useCallback } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import type { ApiResponse } from "../../types/client";
import type { Member as MemberType } from "../../types/houseProfile";
import { ErrorHandler } from "../Error";
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
function Member({
  color,
  setOpen,
  member,
  mutationUrl,
}: {
  color: string;
  setOpen: (open: boolean) => void;
  member: MemberType;
  mutationUrl: any;
}): JSX.Element {
  const [deleted, setDeleted] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              disabled={member.permission == "read-only"}
              onClick={() => {
                fetchApiWithoutHook("property/members/modifyPermissions", {
                  id: member.id,
                  permission: "read-only",
                  changerName: global.user.name,
                  affectedName: member.user.name,
                  timestamp: new Date().toISOString(),
                }).then(() => {
                  mutate(mutationUrl);
                  handleClose();
                  toast.success("Updated permissions!");
                });
              }}
            >
              View only
            </MenuItem>
            <MenuItem
              disabled={member.permission == "member"}
              onClick={() => {
                fetchApiWithoutHook("property/members/modifyPermissions", {
                  id: member.id,
                  permission: "member",
                  changerName: global.user.name,
                  affectedName: member.user.name,
                  timestamp: new Date().toISOString(),
                }).then(() => {
                  mutate(mutationUrl);
                  handleClose();
                  toast.success("Updated permissions!");
                });
              }}
            >
              Member
            </MenuItem>
          </Menu>
          <CardActionArea
            onClick={handleClick}
            disabled={
              global.permission !== "owner" ||
              member.user.email === global.user.email
            }
            sx={{
              ...((global.permission !== "owner" ||
                member.user.email === global.user.email) && {
                opacity: 0.5,
                pointerEvents: "none",
              }),
              maxWidth: "100%",
              overflow: "hidden",
              fontWeight: "400",
              borderRadius: 9,
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
                ? "verified"
                : "visibility"}
            </span>
            <span
              style={{ marginTop: member.permission === "owner" ? "-4px" : "" }}
            >
              {member.permission == "member"
                ? "Member"
                : member.permission == "owner"
                ? "Owner"
                : "View-only"}
            </span>

            <span
              className="material-symbols-rounded"
              style={{ marginLeft: "auto" }}
            >
              expand_more
            </span>
          </CardActionArea>
        </Box>
      </Box>
      {global.property.permission !== "owner" ? null : (
        <LoadingButton
          loading={loading}
          variant="outlined"
          sx={{
            "&:not(.MuiLoadingButton-loading, .Mui-disabled)": {
              borderColor: `${colors[color][900]}!important`,
            },
            borderWidth: "2px!important",
            width: "100%",
            mt: 1.5,
            color: colors[color][900],
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
                removerName: global.user.name,
                removeeName: member.user.name,
                timestamp: new Date().toISOString(),
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

export function MemberList({
  color,
  setOpen,
}: {
  color: string;
  setOpen: (open: boolean) => void;
}): JSX.Element {
  const { error, loading, data, url }: ApiResponse = useApi("property/members");
  const trigger = useMediaQuery("(max-width: 600px)");
  const images = data
    ? [
        ...[
          ...new Map(data.map((item) => [item.user.email, item])).values(),
        ].map((member: any) => {
          return {
            content: (
              <Member
                color={color}
                setOpen={setOpen}
                member={member}
                mutationUrl={url}
              />
            ),
          };
        }),
      ]
    : [
        {
          content: <Box>Loading...</Box>,
        },
      ];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
      containScroll: "trimSnaps",
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
      <Box sx={{ width: "100%", display: "flex", marginTop: "-40px" }}>
        <AddPersonModal
          color={color}
          members={loading ? [] : data.map((member) => member.user.email)}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          width: "100%",
          alignItems: "center",
        }}
      >
        <div className="embla" ref={emblaRef} style={{ width: "100%" }}>
          <div className="embla__container" style={{ width: "100%" }}>
            {images.map((step, index) => (
              <Box
                key={Math.random().toString()}
                sx={{
                  pr: 2,
                  flex: "0 0 auto",
                  maxWidth: "350px",
                  minWidth: "350px",
                  width: "350px",
                  overflow: "hidden",
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
