import { Box } from "@mui/material";
import dayjs from "dayjs";
import { mutate } from "swr";
import { fetchRawApi } from "../../../../../lib/client/useApi";
import { colors } from "../../../../../lib/colors";

export function Color({
  task,
  mutationUrl,
  color,
  setTaskData,
  small = false,
}: {
  task;
  mutationUrl;
  color: string;
  setTaskData: any;
  small?: boolean;
}) {
  return (
    <Box
      sx={{
        width: small ? "20px" : "30px",
        flex: small ? "0 0 20px" : "0 0 30px",
        borderRadius: 9,
        cursor: "pointer",
        height: small ? "20px" : "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#000",
        background: `${colors[color]["400"]}!important`,
        "&:hover": {
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
    >
      <span
        className="material-symbols-rounded"
        style={{
          opacity: task.color === color ? 1 : 0,
          ...(small && {
            fontSize: "15px",
          }),
        }}
      >
        check
      </span>
    </Box>
  );
}
