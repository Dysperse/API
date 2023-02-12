import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AppBar,
  Box,
  CircularProgress,
  Drawer,
  Icon,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Property } from "@prisma/client";
import dynamic from "next/dynamic";
import { cloneElement, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import { toastStyles } from "../../lib/useCustomTheme";
import { ErrorHandler } from "../Error";
import { Changelog } from "./Changelog";
import { EditProperty } from "./EditProperty";
import { MemberList } from "./MemberList";
import { Storage } from "./Storage";

const Integrations = dynamic(() => import("./Integrations"));

function PropertyInfo({
  handleClose,
  accessToken,
  propertyData,
}: {
  handleClose: any;
  accessToken: string;
  propertyData: any;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Box>
      <AppBar
        elevation={0}
        sx={{
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 999,
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
          <Typography sx={{ fontWeight: "700" }}>Group info</Typography>
          <Changelog
            disabled={propertyData.profile.id !== global.property.propertyId}
          />
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box
        sx={{
          p: 4,
        }}
      >
        {propertyData.propertyId !== global.property.propertyId && (
          <Alert
            severity="info"
            sx={{ mb: 2 }}
            action={
              <LoadingButton
                loading={loading}
                onClick={async () => {
                  try {
                    setLoading(true);
                    const res = await fetchApiWithoutHook("property/join", {
                      email: global.user.email,
                      accessToken1: propertyData.accessToken,
                    });
                    await mutate("/api/user");
                    toast.success(
                      <span>
                        Switched to &nbsp;<u>{res.profile.name}</u>
                      </span>,
                      toastStyles
                    );
                    setLoading(false);
                  } catch (e) {
                    toast.error(
                      "An error occured while trying to switch groups",
                      toastStyles
                    );
                  }
                }}
              >
                Switch
              </LoadingButton>
            }
          >
            You&apos;re spectating this group
          </Alert>
        )}
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
          <EditProperty
            propertyId={propertyData.propertyId}
            accessToken={accessToken}
            color={propertyData.profile.color}
          >
            <IconButton
              sx={{
                position: "absolute",
                color: "#000!important",
                ...(propertyData.profile.id !== global.property.propertyId && {
                  opacity: 0.3,
                }),
                top: 0,
                right: 0,
                m: 2,
              }}
              disabled={propertyData.profile.id !== global.property.propertyId}
            >
              <Icon className="outlined">edit</Icon>
            </IconButton>
          </EditProperty>
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
        {propertyData &&
          propertyData.profile.id == global.property.propertyId && (
            <Integrations />
          )}
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
  const [propertyData, setPropertyData] = useState<null | any>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 600px)");

  useEffect(() => {
    const tag: any = document.querySelector(`meta[name="theme-color"]`);
    if (open) {
      tag?.setAttribute(
        "content",
        global.user.darkMode ? "hsl(240,11%,15%)" : "#fff"
      );
    } else {
      tag?.setAttribute(
        "content",
        global.user.darkMode ? "hsl(240,11%,10%)" : "#fff"
      );
    }
  });

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
    [data.accessToken, data.id]
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
        anchor={isDesktop ? "right" : "bottom"}
        PaperProps={{
          sx: {
            background: global.user.darkMode ? "" : "#fff",
            height: error ? "auto" : "100vh",
            width: "100%",
            maxWidth: "600px",
            border: 0,
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
