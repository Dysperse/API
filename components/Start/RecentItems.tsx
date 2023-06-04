import { useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { colors } from "@/lib/colors";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Icon,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { Twemoji } from "react-emoji-render";
import { CreateTask } from "../Boards/Board/Column/Task/Create";
import { TaskDrawer } from "../Boards/Board/Column/Task/TaskDrawer";

export function RecentItems() {
  const trigger = useMediaQuery("(min-width: 600px)");

  const { data, url } = useApi("property/tasks/recent", {
    take: trigger ? 12 : 6,
  });

  const session = useSession();

  return (
    <>
      {data?.length == 0 && (
        <Box sx={{ px: { xs: 2, sm: 4 } }}>
          <Box
            sx={{
              border: "1px solid",
              borderColor: `hsl(240,11%,${session.user.darkMode ? 20 : 95}%)`,
              overflow: "hidden",
              borderRadius: 5,
              p: { sm: 2 },
              mt: 3,
            }}
          >
            <Box sx={{ p: { xs: 3, sm: 1.5 }, pb: { xs: 0, sm: 0 }, mb: -1 }}>
              <Typography sx={{ fontWeight: 700 }}>Recently edited</Typography>
              <Typography gutterBottom>
                You don&apos;t have any unfinished tasks!
              </Typography>
            </Box>
            <CreateTask
              closeOnCreate
              column={{ id: "-1", name: "" }}
              defaultDate={new Date()}
              label="Set a goal"
              placeholder="Create a task..."
              mutationUrl={url}
              boardId={1}
            />
          </Box>
        </Box>
      )}
      <Typography
        sx={{
          fontWeight: 700,
          mt: 3,
          ml: 0,
          mb: 1.5,
          userSelect: "none",
          px: { xs: 3, sm: 4 },
          display: "flex",
          ...(data?.length === 0 && { display: "none" }),
          alignItems: "center",
        }}
      >
        Recently edited
        <Tooltip title="Create a task" placement="left">
          <IconButton
            size="small"
            sx={{ ml: "auto" }}
            onClick={() => {
              const e: any = document.querySelector("#createTask");
              e.click();
            }}
          >
            <Icon>add</Icon>
          </IconButton>
        </Tooltip>
        <Box sx={{ display: "none" }}>
          <CreateTask
            closeOnCreate
            column={{ id: "-1", name: "" }}
            defaultDate={new Date()}
            label="Set a goal"
            placeholder="Create a task..."
            mutationUrl={url}
            boardId={1}
          />
        </Box>
      </Typography>
      <Box
        sx={{
          px: { xs: 2, sm: 3.5 },
          width: "100%",
          whiteSpace: "nowrap",
          overflowX: "scroll",
          scrollSnapType: { xs: "x mandatory", sm: "none" },
          display: "flex",
          overflowY: "visible",
          mb: 2,
          gap: 2,
          pb: 0,
        }}
      >
        {!data && (
          <>
            {[...new Array(6)].map((_, index) => (
              <Skeleton
                variant="rectangular"
                height={94}
                animation="wave"
                sx={{
                  borderRadius: 5,
                  flex: { xs: "0 0 90%", sm: "0 0 20%" },
                }}
                key={index}
              />
            ))}
          </>
        )}
        {data &&
          data.map((item) => (
            <TaskDrawer id={item.id} mutationUrl={url} key={item.id}>
              <Card
                variant="outlined"
                className="cursor-unset"
                sx={{
                  transition: "transform .2s",
                  "&:active": {
                    transform: "scale(.98)",
                  },
                  scrollSnapAlign: "center",
                  border: "1px solid",
                  borderColor: session.user.darkMode
                    ? "hsl(240, 11%, 20%)"
                    : "rgba(200, 200, 200, 0.3)",
                  width: "100%",
                  flex: { xs: "0 0 90%", sm: "0 0 20%" },
                  borderRadius: 5,
                  "& *": { transition: "none" },
                }}
              >
                <CardActionArea sx={{ height: "100%" }}>
                  <CardContent sx={{ height: "100%" }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        "& span img": {
                          display: "inline-flex !important",
                          width: "23px!important",
                          height: "23px!important",
                          verticalAlign: "top !important",
                        },
                        color:
                          colors[item.color][
                            session.user.darkMode ? "A400" : 900
                          ],
                      }}
                    >
                      <span>
                        <Twemoji>{item.name || " "}</Twemoji>
                      </span>
                    </Typography>
                    {item.pinned && (
                      <Chip
                        size="small"
                        sx={{ mb: 0.5, mr: 0.5, pointerEvents: "none" }}
                        icon={<Icon>priority_high</Icon>}
                        label={"Urgent"}
                      />
                    )}
                    {item.lastUpdated && (
                      <Chip
                        size="small"
                        sx={{ mb: 0.5, pointerEvents: "none" }}
                        icon={<Icon>history</Icon>}
                        label={dayjs(item.lastUpdated).fromNow()}
                      />
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </TaskDrawer>
          ))}
      </Box>
    </>
  );
}
