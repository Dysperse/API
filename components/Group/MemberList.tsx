import {
  Box,
  CardActionArea,
  Icon,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import { toastStyles } from "../../lib/useCustomTheme";
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
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
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
    <>
      <Box>
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
          >
            <MenuItem
              disabled={member.permission === "read-only"}
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
                  toast.success("Updated permissions!", toastStyles);
                });
              }}
            >
              View only
            </MenuItem>
            <MenuItem
              disabled={member.permission === "member"}
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
                  toast.success("Updated permissions!", toastStyles);
                });
              }}
            >
              Member
            </MenuItem>

            {global.property.permission !== "owner" ||
            member.permission === "owner" ? null : (
              <MenuItem
                sx={{
                  color:
                    colors.red[global.user.darkMode ? "A200" : "A400"] +
                    "!important",
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
                      toast.success(
                        "Removed person from your home",
                        toastStyles
                      );
                      setLoading(false);
                      setDeleted(true);
                    });
                  }
                }}
              >
                {"Remove"}
              </MenuItem>
            )}
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
                pointerEvents: "none",
              }),
              width: "100%",
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
            <Icon>
              {member.permission === "member"
                ? "group"
                : member.permission === "owner"
                ? "verified"
                : "visibility"}
            </Icon>
            <span
              style={{ marginTop: member.permission === "owner" ? "-4px" : "" }}
            >
              {member.permission === "member"
                ? "Member"
                : member.permission === "owner"
                ? "Owner"
                : "View-only"}
            </span>

            <span
              className="material-symbols-rounded"
              style={{
                marginLeft: "auto",
                opacity:
                  global.permission !== "owner" ||
                  member.user.email === global.user.email
                    ? "0"
                    : "1",
              }}
            >
              expand_more
            </span>
          </CardActionArea>
        </Box>
      </Box>
    </>
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
  propertyId,
  accessToken,
}: {
  color: string;
  setOpen: (open: boolean) => void;
  propertyId: string;
  accessToken: string;
}): JSX.Element {
  const { error, loading, data, url }: ApiResponse = useApi(
    "property/members",
    {
      propertyId: propertyId,
      propertyAccessToken: accessToken,
    }
  );

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
          content: (
            <Box>
              <Skeleton animation="wave" />
            </Box>
          ),
        },
      ];

  return error ? (
    <ErrorHandler
      error={"An error occured while trying to fetch your members"}
    />
  ) : (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          mt: 4,
          alignItems: "center",
          mb: 3,
          px: 1,
        }}
      >
        <Typography variant="h6">Members</Typography>
        <AddPersonModal
          color={color}
          members={loading ? [] : data.map((member) => member.user.email)}
        />
      </Box>
      {images.map((step, index) => (
        <Box
          key={index}
          sx={{
            p: 2,
            mb: 2,
            userSelect: "none",
            px: 2.5,
            borderRadius: 5,
            background: global.user.darkMode
              ? "hsl(240,11%,20%)"
              : colors[color][100],
          }}
        >
          {step.content}
        </Box>
      ))}
    </>
  );
}
