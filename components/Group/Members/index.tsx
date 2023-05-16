import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import { colors } from "@/lib/colors";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  CardActionArea,
  CircularProgress,
  Icon,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { ConfirmationModal } from "../../ConfirmationModal";
import { ErrorHandler } from "../../Error";
import { AddPersonModal } from "./Add";

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
  propertyId,
  member,
  mutationUrl,
}: {
  propertyId: string;
  color: string;
  member: any;
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
  const session = useSession();
  return deleted ? (
    <>This user no longer has access to your home</>
  ) : (
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
            fetchRawApi("property/members/modifyPermissions", {
              id: member.id,
              permission: "read-only",
              changerName: session.user.name,
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
            fetchRawApi("property/members/modifyPermissions", {
              id: member.id,
              permission: "member",
              changerName: session.user.name,
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

        {session.property.permission !== "owner" ||
        member.permission === "owner" ? null : (
          <ConfirmationModal
            title="Remove member from your home?"
            question="This person cannot join unless you invite them again"
            callback={() => {
              if (member.permission === "owner") {
                document.getElementById("settingsTrigger")?.click();
                return;
              }
              setLoading(true);
              fetchRawApi("property/members/remove", {
                id: member.id,
                removerName: session.user.name,
                removeeName: member.user.name,
                timestamp: new Date().toISOString(),
              }).then(() => {
                toast.success("Removed person from your home", toastStyles);
                setLoading(false);
                setDeleted(true);
              });
            }}
          >
            <MenuItem
              sx={{
                color:
                  colors.red[session.user.darkMode ? "A200" : "A400"] +
                  "!important",
              }}
            >
              Remove
              {loading && <CircularProgress sx={{ ml: "auto" }} />}
            </MenuItem>
          </ConfirmationModal>
        )}
      </Menu>
      <CardActionArea
        onClick={handleClick}
        disabled={
          propertyId !== session.property.propertyId ||
          session?.permission !== "owner" ||
          member.user.email === session.user.email
        }
        sx={{
          ...((session?.permission !== "owner" ||
            member.user.email === session.user.email) && {
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
              propertyId !== session.property.propertyId ||
              session?.permission !== "owner" ||
              member.user.email === session.user.email
                ? "0"
                : "1",
          }}
        >
          expand_more
        </span>
      </CardActionArea>
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
  propertyId,
  accessToken,
}: {
  color: string;
  propertyId: string;
  accessToken: string;
}): JSX.Element {
  const { error, loading, data, url } = useApi("property/members", {
    propertyId: propertyId,
    propertyAccessToken: accessToken,
  });
  const [leaveLoading, setLeaveLoading] = React.useState<boolean>(false);

  const session = useSession();
  const images =
    data && !data.error
      ? [
          ...[
            ...new Map(data.map((item) => [item.user.email, item])).values(),
          ].map((member: any) => {
            return {
              content: (
                <Member
                  propertyId={propertyId}
                  color={color}
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
        {data && !data.error && (
          <AddPersonModal
            color={color}
            disabled={propertyId !== session.property.propertyId}
            members={loading ? [] : data.map((member) => member.user.email)}
          />
        )}
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
            background: session.user.darkMode
              ? "hsl(240,11%,20%)"
              : colors[color][50],
          }}
        >
          {step.content}
        </Box>
      ))}
      <ConfirmationModal
        callback={async () => {
          setLeaveLoading(true);
          await fetchRawApi("property/leave", {
            otherPropertyAccessToken: session.user.properties.find(
              (m) => m.permission == "owner"
            )?.accessToken,
            id: propertyId,
          });
          setLeaveLoading(false);
        }}
        title="Are you sure you want to leave this group?"
        question="You won't be able to re-join unless you are invited again."
      >
        <LoadingButton
          loading={leaveLoading}
          disabled={
            data &&
            data.find((m) => m.user.email === session.user.email)
              ?.permission === "owner"
          }
          color="error"
          variant="contained"
        >
          Leave
        </LoadingButton>
      </ConfirmationModal>
    </>
  );
}
