import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Icon,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { Twemoji } from "react-emoji-render";
import { useApi } from "../../lib/client/useApi";
import { useSession } from "../../lib/client/useSession";
import { colors } from "../../lib/colors";
import { CreateTask } from "../Boards/Board/Column/Task/Create";
import { TaskDrawer } from "../Boards/Board/Column/Task/TaskDrawer";

export function RecentItems() {
  const trigger = useMediaQuery("(min-width: 600px)");

  const { data, url } = useApi("property/boards/recent", {
    take: trigger ? 12 : 6,
  });

  const session = useSession();

  return (
    <>
      {data && data.length == 0 && (
        <Box sx={{ px: { xs: 2, sm: 4 } }}>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "rgba(200,200,200,.3)",
              overflow: "hidden",
              borderRadius: 5,
              p: { sm: 2 },
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
          ...(data && data.length === 0 && { display: "none" }),
          userSelect: "none",
          px: { xs: 3, sm: 4 },
        }}
      >
        Recently edited
      </Typography>
      <Box
        sx={{
          px: { xs: 2, sm: 3.5 },
          width: "100%",
          whiteSpace: "nowrap",
          overflowX: "scroll",
          scrollSnapType: "x mandatory",
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
                  scrollSnapAlign: "center",
                  border: "1px solid",
                  borderColor: session.user.darkMode
                    ? "hsl(240, 11%, 20%)"
                    : "rgba(200, 200, 200, 0.3)",
                  width: "100%",
                  flex: { xs: "0 0 90%", sm: "0 0 20%" },
                  borderRadius: 5,
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
                        sx={{ mb: 0.5, mr: 0.5 }}
                        icon={<Icon>priority_high</Icon>}
                        label={"Urgent"}
                      />
                    )}
                    {item.lastUpdated && (
                      <Chip
                        size="small"
                        sx={{ mb: 0.5 }}
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
