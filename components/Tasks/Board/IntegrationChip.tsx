import { fetchRawApi } from "@/lib/client/useApi";
import { toastStyles } from "@/lib/client/useTheme";
import { Chip, CircularProgress, Icon } from "@mui/material";
import { useState } from "react";
import { toast } from "react-hot-toast";

const IntegrationChip = ({
  mutationUrls,
  integration,
  boardId,
  session,
  mutate,
}) => {
  const [isLoading, setLoading] = useState(false);

  const handleIntegrationClick = async () => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        setLoading(true);
        try {
          const integrationType = integration.name
            .toLowerCase()
            .replace(" ", "-");

          const response = await fetchRawApi(
            session,
            `property/integrations/run/${integrationType}`,
            {
              boardId: boardId,
              timeZone: session.user.timeZone,
              vanishingTasks: session.property.profile.vanishingTasks
                ? "true"
                : "false",
            }
          );
          await mutate(mutationUrls.tasks);
          resolve(response);
          setLoading(false);
        } catch (e: any) {
          reject(e);
          setLoading(false);
        }
      }),
      {
        loading: "Syncing to " + integration.name,
        success: "Up to date!",
        error: "An error occurred while syncing",
      },
      toastStyles
    );
    setLoading(true);
  };

  return (
    <Chip
      id="syncChip"
      onClick={handleIntegrationClick}
      disabled={session.permission === "read-only" || isLoading}
      label="Sync now"
      sx={{
        mr: 1,
        mb: 1,
        ...(!(session.permission === "read-only" || isLoading) && {
          "&, &:hover": {
            background:
              "linear-gradient(45deg, #FF0080 0%, #FF8C00 100%) !important",
            color: "#000",
            "& .MuiChip-icon": {
              color: "#000!important",
            },
          },
        }),
      }}
      icon={
        isLoading ? (
          <CircularProgress
            size={20}
            disableShrink={false}
            thickness={3}
            sx={{
              animationDuration: "1s!important",
            }}
          />
        ) : (
          <Icon>refresh</Icon>
        )
      }
    />
  );
};

export default IntegrationChip;
