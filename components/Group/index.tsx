import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Icon, IconButton, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { EditProperty } from "./Edit";
import { MemberList } from "./Members";
import { Storage } from "./Storage";

const Integrations = dynamic(() => import("./Integrations"));

export function PropertyInfo({
  color,
  mutatePropertyData,
  handleClose,
  accessToken,
  propertyData,
}: {
  color: any;
  mutatePropertyData: any;
  handleClose: any;
  accessToken: string;
  propertyData: any;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(color, isDark);

  return (
    <Box>
      {propertyData.propertyId !== session.property.propertyId && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            background: palette[3],
            color: isDark ? "#fff" : "#000",
            "& *": {
              color: isDark ? "#fff" : "#000",
            },
          }}
          action={
            <LoadingButton
              loading={loading}
              sx={{
                "&:hover": {
                  background: palette[4],
                },
                color: isDark ? "#fff" : "#000",
              }}
              onClick={async () => {
                try {
                  setLoading(true);
                  const res = await fetchRawApi(session, "property/switch", {
                    email: session.user.email,
                    accessToken1: propertyData.accessToken,
                  });
                  await mutate("/api/session");
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
          Spectating group
        </Alert>
      )}
      {session.properties &&
        !session.properties.find(
          (property: any) => property.propertyId == propertyData.propertyId
        )?.accepted && (
          <Alert
            severity="info"
            sx={{
              mb: 2,
              background: !isDark ? "rgba(200,200,200,.3)" : "hsl(240,11%,15%)",
              color: isDark ? "#fff" : "#000",
              "& *": {
                color: isDark ? "#fff" : "#000",
              },
            }}
            action={
              <LoadingButton
                loading={loading}
                sx={{
                  background: palette[4],
                  "&:hover": {
                    background: palette[5],
                  },
                  color: isDark ? "#fff" : "#000",
                }}
                onClick={async () => {
                  try {
                    setLoading(true);
                    const res = await fetchRawApi(session, "property/switch", {
                      email: session.user.email,
                      accessToken1: propertyData.accessToken,
                    });
                    await mutate("/api/session");
                    toast.success(
                      <span>
                        Joined &nbsp;<u>{res.profile.name}</u>
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
                Join
              </LoadingButton>
            }
          >
            You&apos;ve been invited to this group
          </Alert>
        )}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${palette[6]}, ${palette[9]})`,
          borderRadius: 5,
          p: 2.5,
          userSelect: "none",
          position: "relative",
          px: 4,
          color: "#000",
        }}
      >
        <EditProperty
          propertyData={propertyData}
          color={propertyData.profile.color}
          mutatePropertyData={mutatePropertyData}
        >
          <IconButton
            sx={{
              position: "absolute",
              color: "#000!important",
              ...(propertyData.profile.id !== session.property.propertyId && {
                opacity: 0.3,
              }),
              top: 0,
              right: 0,
              m: 2,
            }}
            disabled={
              propertyData.profile.id !== session.property.propertyId ||
              session.permission === "read-only"
            }
          >
            <Icon className="outlined">edit</Icon>
          </IconButton>
        </EditProperty>
        <Typography
          variant="h4"
          sx={{
            mt: 15,
            fontSize: "55px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          className="font-heading"
        >
          {propertyData.profile.name}
        </Typography>
        <Typography>
          {propertyData.profile.members.length} member
          {propertyData.profile.members.length !== 1 && "s"}
        </Typography>
      </Box>
      <MemberList
        handleParentClose={handleClose}
        color={propertyData.profile.color}
        propertyId={propertyData.propertyId}
        accessToken={accessToken}
      />
    </Box>
  );
}
