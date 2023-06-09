import { fetchRawApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { colors } from "@/lib/colors";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { mutate } from "swr";

export function Color({
  task,
  mutationUrl,
  color,
  setTaskData,
}: {
  task;
  mutationUrl;
  color: string;
  setTaskData: any;
}) {
  const session = useSession();

  return (
    <Box
      sx={{
        width: "30px",
        flex: "0 0 30px",
        borderRadius: 9,
        height: "30px",
        display: "flex",
        ...(task.color === color && {
          boxShadow: `0 0 0 2px ${
            session.user.darkMode ? "hsl(240,11%,20%)" : "#fff"
          } inset`,
        }),
        transition: "box-shadow .4s",
        alignItems: "center",
        justifyContent: "center",
        color: "#000",
        background: `${colors[color]["400"]}!important`,
        border: "2px solid",
        borderColor: `${colors[color]["400"]}!important`,
        "&:hover": {
          borderColor: `${colors[color]["500"]}!important`,
          background: `${colors[color]["500"]}!important`,
        },
      }}
      onClick={() => {
        setTaskData((item) => ({ ...item, color }));
        fetchRawApi("property/boards/column/task/edit", {
          color: color,
          date: dayjs().toISOString(),
          id: task.id,
        }).then(() => {
          mutate(mutationUrl);
        });
      }}
    />
  );
}
