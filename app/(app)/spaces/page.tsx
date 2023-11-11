"use client";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { OptionsGroup } from "@/components/OptionsGroup";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { mutateSession, useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Alert,
  AppBar,
  AvatarGroup,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  Skeleton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";
import { containerRef } from "../container";
import { ProfilePicture } from "../users/[id]/ProfilePicture";

function SpaceButton({ editMode, mutate, invite }) {
  const router = useRouter();
  const { session, setSession } = useSession();
  const isSelected = invite.user.selectedProperty.id === invite.propertyId;
  const space = invite.profile;

  const members = [
    ...new Map(space.members.map((item) => [item.user.email, item])).values(),
  ];
  const redPalette = useColor("red", useDarkMode(session.darkMode));
  const [loading, setLoading] = useState(false);

  const handleSwitch = async () => {
    try {
      const propertyId = invite.propertyId;
      if (isSelected && invite.accepted) {
        router.push(`/spaces/${propertyId}`);
        return;
      }
      setLoading(true);
      await fetchRawApi(session, "space/switch", {
        method: "PUT",
        params: { propertyId },
      });
      await mutate();
      await mutateSession(setSession);
      router.push("/");
      toast.success(
        <Box sx={{ px: 1 }}>
          <Typography sx={{ mb: 0.5 }}>
            Switched to &quot;{space.name}&quot;!
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => router.push(`/spaces/${propertyId}`)}
          >
            View space
          </Button>
        </Box>
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error("Something went wrong. Please try again later.");
      console.log(e);
    }
  };

  const handleInvitationDecline = async () => {
    try {
      const { id, permission } = invite;
      if (permission === "owner") {
        return toast.error("Can't leave since you're the owner of this space.");
      }

      await fetchRawApi(session, "space/members", {
        method: "DELETE",
        params: {
          removerName: session.user.name,
          removeeName: "themself",
          timestamp: new Date().toISOString(),
          id: id,
        },
      });
      await mutate();
    } catch (e) {
      toast.error("Something went wrong. Please try again later");
    }
  };

  return (
    <Box sx={{ pb: 1, display: "flex", alignItems: "center" }}>
      <Collapse
        orientation="horizontal"
        in={editMode}
        sx={{
          opacity: editMode ? 1 : 0,
          transition: "all .4s",
        }}
      >
        <ConfirmationModal
          callback={handleInvitationDecline}
          title="Exit space?"
          question="You will no longer hace access to this space's tasks and items. You'll have to be invited again if you later change your mind"
        >
          <IconButton sx={{ mr: 2 }}>
            <Icon sx={{ color: redPalette[9] }}>remove_circle</Icon>
          </IconButton>
        </ConfirmationModal>
      </Collapse>
      <ListItemButton
        selected={isSelected && invite.accepted}
        onClick={() => {
          if (invite.accepted) {
            handleSwitch();
          }
        }}
        sx={{
          ...(!invite.accepted && { background: "transparent!important" }),
        }}
      >
        <ListItemText
          primary={invite.profile.name}
          secondary={`${capitalizeFirstLetter(
            space.type
          )} • ${capitalizeFirstLetter(invite.permission)} `}
        />
        <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
          <AvatarGroup max={4}>
            {members.map((member: any) => (
              <ProfilePicture
                data={member.user}
                key={member.user.email}
                size={25}
              />
            ))}
          </AvatarGroup>
          {invite.accepted ? (
            loading ? (
              <CircularProgress size={24} />
            ) : (
              <Icon className="outlined">
                {isSelected ? "arrow_forward_ios" : "trip_origin"}
              </Icon>
            )
          ) : (
            <Box>
              <Button size="small" variant="contained" onClick={handleSwitch}>
                Join
              </Button>
              <Button
                size="small"
                sx={{ minWidth: 0 }}
                onClick={handleInvitationDecline}
              >
                <Icon>close</Icon>
              </Button>
            </Box>
          )}
        </Box>
      </ListItemButton>
    </Box>
  );
}

export default function Page() {
  const router = useRouter();
  const { session } = useSession();
  const [editMode, setEditMode] = useState(false);

  const palette = useColor(
    session.themeColor,
    useDarkMode(session.user.darkMode)
  );
  const toggleEditMode = () => setEditMode((s) => !s);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [view, setView] = useState<"All" | "Invitations">("All");
  const { data, mutate, error } = useSWR(["user/spaces"]);

  useHotkeys("esc", () => setEditMode(false));

  const filteredData = data
    ?.filter((p) => (view === "Invitations" ? !p.accepted : p.accepted))
    .sort((e) => (e.propertyId === session.user.selectedPropertyId ? -1 : 0));

  return (
    <>
      <AppBar sx={{ border: 0 }}>
        <Toolbar>
          <IconButton
            sx={{ background: palette[3] }}
            onClick={() => router.push("/")}
          >
            <Icon>close</Icon>
          </IconButton>

          <Button
            sx={{
              ml: "auto",
              background: palette[editMode ? 3 : 1] + "!important",
            }}
            size="small"
            onClick={toggleEditMode}
          >
            {editMode ? "Done" : "Edit"}
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3, maxWidth: "500px", mx: "auto" }}>
        <Typography variant="h2" className="font-heading" sx={{ mb: 1 }}>
          Spaces
        </Typography>
        <OptionsGroup
          currentOption={view}
          setOption={setView}
          options={["All", "Invitations"]}
          sx={{ mb: 1 }}
        />
        {filteredData?.length === 0 && (
          <Alert severity="info" sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 900, mt: -1 }}>
              Spaces you&apos;ve been invited to will appear here
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              With Spaces, you can create a shared place for you to keep tasks
              &amp; items with your friends/family.
            </Typography>
          </Alert>
        )}
        {filteredData ? (
          <Virtuoso
            useWindowScroll
            customScrollParent={isMobile ? undefined : containerRef.current}
            totalCount={filteredData.length}
            itemContent={(index) => (
              <SpaceButton
                key={index}
                invite={filteredData[index]}
                mutate={mutate}
                editMode={editMode}
              />
            )}
          />
        ) : (
          [...new Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={72.02}
              sx={{ mb: 2 }}
            />
          ))
        )}
        {error && <ErrorHandler />}
      </Box>
    </>
  );
}
