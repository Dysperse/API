import {
  AppBar,
  Box,
  CircularProgress,
  Drawer,
  Icon,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Property } from "@prisma/client";
import { cloneElement, useCallback, useState } from "react";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import { ErrorHandler } from "../Error";
import { MemberList } from "./MemberList";
import { Storage } from "./Storage";

function PropertyInfo({
  handleClose,
  accessToken,
  propertyData,
}: {
  handleClose: any;
  accessToken: string;
  propertyData: any;
}) {
  return (
    <Box>
      <AppBar
        elevation={0}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9,
          background: global.user.darkMode
            ? "hsla(240,11%,15%, 0.5)"
            : "rgba(255,255,255,.5)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid transparent",
          borderColor: global.user.darkMode
            ? "hsla(240,11%,30%, .5)"
            : "rgba(200,200,200,.3)",
          color: global.user.darkMode ? "#fff" : "#000",
        }}
      >
        <Toolbar>
          <IconButton onClick={handleClose} sx={{ mr: "auto" }}>
            <Icon>close</Icon>
          </IconButton>
          <Typography>Group info</Typography>
          <IconButton onClick={handleClose} sx={{ ml: "auto", opacity: 0 }}>
            <Icon>close</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box
        sx={{
          p: 4,
          pt: 14,
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(45deg, ${
              colors[propertyData.profile.color]["A200"]
            }, ${colors[propertyData.profile.color]["A700"]})`,
            borderRadius: 5,
            p: 2.5,
            userSelect: "none",
            position: "relative",
            px: 4,
            color: "#000",
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              color: "inherit",
              top: 0,
              right: 0,
              m: 2,
            }}
          >
            <Icon className="outlined">edit</Icon>
          </IconButton>
          <Typography
            variant="h4"
            sx={{ mt: 15, mb: 0.5, fontSize: "40px" }}
            className="font-heading"
          >
            {propertyData.profile.name}
          </Typography>
          <Typography>{propertyData.profile.members.length} members</Typography>
        </Box>
        <Storage
          color={propertyData.profile.color}
          propertyId={propertyData.propertyId}
          accessToken={accessToken}
        />
        <MemberList
          color={propertyData.profile.color}
          setOpen={() => {}}
          propertyId={propertyData.propertyId}
          accessToken={accessToken}
        />
      </Box>
    </Box>
  );
}

export default function Group({
  data,
  children,
  handleClose,
}: {
  data: {
    id: string;
    accessToken: string;
  };
  children: JSX.Element;
  handleClose: () => unknown;
}) {
  const [propertyData, setPropertyData] = useState<null | Property>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = useCallback(
    async (e) => {
      e.stopPropagation();
      setOpen(true);
      try {
        setError(null);
        const res = await fetchApiWithoutHook("property", {
          id: data.id,
          propertyAccessToken: data.accessToken,
        });
        setPropertyData(res);
        setLoading(false);
      } catch (e: any) {
        setLoading(false);
        setError(e.message);
      }
    },
    [open]
  );

  const handleDrawerClose = () => setOpen(false);

  const trigger = cloneElement(children, {
    onClick: handleOpen,
  });

  return (
    <>
      <Drawer
        onClose={handleDrawerClose}
        open={open}
        anchor="bottom"
        PaperProps={{
          sx: {
            background: global.user.darkMode ? "" : "#fff",
            height: error ? "auto" : "100vh",
            borderRadius: !error ? 0 : "20px 20px 0 0",
          },
        }}
      >
        {propertyData && (
          <PropertyInfo
            propertyData={propertyData as Property}
            accessToken={data.accessToken}
            handleClose={handleDrawerClose}
          />
        )}
        <Box
          sx={{
            p: 4,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            error && (
              <ErrorHandler error="An error occured while trying to load your group" />
            )
          )}
        </Box>
      </Drawer>
      {trigger}
    </>
  );
}
