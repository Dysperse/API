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
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useEffect } from "react";
import { Twemoji } from "react-emoji-render";
import { useApi } from "../../lib/client/useApi";
import { colors } from "../../lib/colors";
import { useSession } from "../../pages/_app";
import { TaskDrawer } from "../Boards/Board/Column/Task/TaskDrawer";

export function RecentItems() {
  const trigger = useMediaQuery("(min-width: 600px)");

  const { data, url } = useApi("property/boards/recent", {
    take: trigger ? 12 : 6,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      dragFree: trigger,
      align: "start",
      containScroll: "trimSnaps",
      loop: false,
    },
    [WheelGesturesPlugin()]
  );

  useEffect(() => {
    emblaApi && emblaApi?.reInit();
  }, [data, emblaApi]);
  const session = useSession();

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          mt: 3,
          ml: 0,
          mb: 1.5,
          ...(data && data.length === 0 && { display: "none" }),
        }}
        className="select-none px-4 sm:px-7"
      >
        Recently edited
      </Typography>
      <Box
        className="embla px-4 sm:px-7"
        ref={emblaRef}
        sx={{
          width: "100%",
          whiteSpace: "nowrap",
          overflowX: "scroll",
          overflowY: "visible",
          mb: 2,
        }}
      >
        <div
          className="embla__container"
          style={{ gap: "15px", paddingBottom: "10px" }}
        >
          {!data && (
            <>
              {[...new Array(6)].map((_, index) => (
                <Skeleton
                  variant="rectangular"
                  height={120}
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
                  className="shadow-sm"
                  sx={{
                    border: "1px solid",
                    borderColor: session.user.darkMode
                      ? "hsl(240, 11%, 20%)"
                      : "rgba(200, 200, 200, 0.3)",
                    width: "100%",
                    flex: { xs: "0 0 90%", sm: "0 0 20%" },
                    borderRadius: 5,
                  }}
                  variant="outlined"
                >
                  <CardActionArea sx={{ height: "100%" }}>
                    <CardContent sx={{ height: "100%" }}>
                      <Icon
                        sx={{
                          color:
                            colors[item.color][
                              session.user.darkMode ? "A400" : 700
                            ],
                        }}
                        {...(item.color === "grey" && {
                          className: "outlined",
                        })}
                      >
                        {item.pinned ? "push_pin" : "check_circle"}
                      </Icon>
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
                        }}
                      >
                        <span>
                          <Twemoji>{item.name || " "}</Twemoji>
                        </span>
                      </Typography>
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
        </div>
      </Box>
    </>
  );
}
