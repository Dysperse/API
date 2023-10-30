import { fetchRawApi } from "@/lib/client/useApi";
import { Chip, CircularProgress, Icon, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { BoardContext } from ".";

const IntegrationChip = ({ integration, boardId, session }) => {
  const { mutateData } = useContext(BoardContext);

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
              user: session.user.identifier,
              boardId: boardId,
              offset: dayjs().utcOffset(),
              timeZone: session.user.timeZone,
              vanishingTasks: session.space.info.vanishingTasks
                ? "true"
                : "false",
            }
          );
          await mutateData();
          resolve(response);
          setLoading(false);
        } catch (e: any) {
          reject(e);
          setLoading(false);
        }
      }),
      {
        loading: "Syncing to " + integration.name + "...",
        success: "Up to date!",
        error: (e) => e.message,
      }
    );
    setLoading(true);
  };

  return (
    <Tooltip title={`Last synced ${dayjs(integration.lastSynced).fromNow()} `}>
      <Chip
        id="syncChip"
        onClick={handleIntegrationClick}
        disabled={session.permission === "read-only" || isLoading}
        label={isLoading ? "Syncing..." : "Sync now"}
        sx={{
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
    </Tooltip>
  );
};

export default IntegrationChip;
