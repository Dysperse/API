import { fetchRawApi } from "@/lib/client/useApi";
import { toastStyles } from "@/lib/client/useTheme";
import { Chip, Icon } from "@mui/material";
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
        loading: "Syncing... (This might take a while)",
        success: "Synced!",
        error: "An error occurred while syncing",
      },
      toastStyles
    );
    setLoading(true);
  };

  return (
    <Chip
      onClick={handleIntegrationClick}
      disabled={session.permission === "read-only" || isLoading}
      label={`Sync to ${integration.name}`}
      sx={{
        mr: 1,
        mb: 1,
        ...(!(session.permission === "read-only" || isLoading) && {
          background:
            "linear-gradient(45deg, #FF0080 0%, #FF8C00 100%) !important",
          color: "#000",
          "& .MuiChip-icon": {
            color: "#000!important",
          },
        }),
      }}
      icon={<Icon>refresh</Icon>}
    />
  );
};

export default IntegrationChip;
