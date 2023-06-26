import { ErrorHandler } from "@/components/Error";
import { PropertyInfo } from "@/components/Group";
import { Changelog } from "@/components/Group/Changelog";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  Icon,
  IconButton,
  Toolbar,
} from "@mui/material";
import { Property } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { mutate } from "swr";

function Group({ group, handleMutate }) {
  const session = useSession();
  const router = useRouter();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(
    group ? group.profile.color : session.themeColor,
    isDark
  );

  return (
    <Box>
      <AppBar
        position="sticky"
        sx={{
          background: addHslAlpha(palette[1], 0.5),
          borderColor: "transparent",
        }}
      >
        <Toolbar sx={{ gap: { xs: 1, sm: 2 } }}>
          <IconButton onClick={() => router.push("/users")}>
            <Icon>west</Icon>
          </IconButton>
          {group && (
            <Changelog
              disabled={group.profile.id !== session.property.propertyId}
            />
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 2 }}>
        {group ? (
          <PropertyInfo
            color={group.profile.color}
            mutatePropertyData={handleMutate}
            propertyData={group as Property}
            accessToken={group.accessToken}
            handleClose={() => {}}
          />
        ) : (
          <Box></Box>
        )}
      </Container>
    </Box>
  );
}

export default function Page() {
  const session = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [color, setColor] = useState(session.themeColor);
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(color, isDark);

  const accessToken = session.properties.find(
    (property) => property.propertyId == id
  )?.accessToken;

  const { data, url, error } = useApi("property", {
    id,
    propertyAccessToken: accessToken,
  });

  useEffect(() => {
    if (data) {
      setColor(data.profile.color);
      document
        .getElementById(`meta-theme-color`)
        ?.setAttribute("content", palette[1]);
    }
  }, [data, palette]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: palette[1],
        zIndex: 999,
        overflow: "auto",
      }}
    >
      {error && (
        <ErrorHandler error="Yikes! We couldn't load this group! Please try again later" />
      )}
      {data ? (
        <Group handleMutate={() => mutate(url)} group={data} />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
