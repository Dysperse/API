"use client";

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
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";
import { containerRef } from "../container";
import { ProfilePicture } from "../users/[id]/ProfilePicture";

function SpaceButton({ invite, mutate }) {
  const router = useRouter();
  const { session, setSession } = useSession();
  const isSelected = invite.user.selectedProperty.id === invite.propertyId;
  const space = invite.profile;

  const members = [
    ...new Map(space.members.map((item) => [item.user.email, item])).values(),
  ];

  const [loading, setLoading] = useState(false);

  const handleSwitch = async () => {
    try {
      setLoading(true);
      const propertyId = invite.propertyId;
      await fetchRawApi(session, "space/switch", {
        method: "PUT",
        params: { propertyId },
      });
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

  return (
    <Box sx={{ pb: 1 }}>
      <ListItemButton selected={isSelected} onClick={handleSwitch}>
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
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Icon className="outlined">
              {isSelected ? "arrow_forward_ios" : "trip_origin"}
            </Icon>
          )}
        </Box>
      </ListItemButton>
    </Box>
  );
}

export default function Page() {
  const { session } = useSession();
  const palette = useColor(
    session.themeColor,
    useDarkMode(session.user.darkMode)
  );
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [view, setView] = useState<"Spaces" | "Invitations">("Spaces");
  const { data, mutate, error } = useSWR(["user/spaces"]);

  const filteredData = data?.filter((p) =>
    view === "Invitations" ? !p.accepted : p.accepted
  );

  return (
    <>
      <AppBar sx={{ border: 0 }}>
        <Toolbar>
          <IconButton sx={{ background: palette[3] }}>
            <Icon>close</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3, maxWidth: "700px", mx: "auto" }}>
        <OptionsGroup
          currentOption={view}
          setOption={setView}
          options={["Spaces", "Invitations"]}
          sx={{ mb: 2 }}
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
                mutate={mutate}
                key={index}
                invite={filteredData[index]}
              />
            )}
          />
        ) : (
          <CircularProgress />
        )}
        {error && <ErrorHandler />}
      </Box>
    </>
  );
}
