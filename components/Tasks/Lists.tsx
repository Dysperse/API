import { Calendar } from "@mantine/dates";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Confetti from "react-dom-confetti";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { ErrorHandler } from "../error";
import { Puller } from "../Puller";
import dayjs from "dayjs";
import { CreateListModal } from "./CreateListModal";
import { CreateListItemModal } from "./CreateListItemModal";

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [month, day, year].join("-");
}

export const SelectDateModal = ({ styles, date, setDate }) => {
  const [open, setOpen] = React.useState(false);
  const today = formatDate(new Date());

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          elevation: 0,
          sx: {
            maxWidth: { sm: "350px" },
            mb: { sm: 10 },
            mx: "auto",
            background: colors[themeColor][50],
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
          },
        }}
      >
        <Box
          sx={{
            display: { sm: "none" },
          }}
        >
          <Puller />
        </Box>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Calendar
            value={date}
            firstDayOfWeek="sunday"
            onChange={(e) => {
              setDate(e);
              setOpen(false);
            }}
            fullWidth
            styles={(theme) => ({
              // Weekend color
              day: {
                borderRadius: 19,
                transition: "border-radius .2s",
                "&:hover": {
                  background: colors[themeColor][100],
                },
                color: colors[themeColor][500],
                "&[data-outside]": {
                  color:
                    (theme.colorScheme === "dark"
                      ? theme.colors.dark[3]
                      : theme.colors.gray[5]) + "!important",
                },
                "&[data-selected]": {
                  backgroundColor: colors[themeColor][900],
                  color: "#fff!important",
                  borderRadius: 9,
                  position: "relative",
                },

                "&[data-weekend]": {
                  color: colors[themeColor][500],
                },
              },
            })}
          />
        </Box>
      </SwipeableDrawer>
      <Button
        sx={{ ...styles, gap: 1, borderRadius: 9999 }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <span className="material-symbols-rounded">today</span>
        <span style={{ fontSize: "15px" }}>
          {today === formatDate(date) && "Today"}
          {dayjs(date).format("MMM D") === "Invalid Date"
            ? ""
            : today !== formatDate(date) && dayjs(date).format("MMM D")}
        </span>
      </Button>
    </>
  );
};

const ListItem = ({ listData, setListData, parent, data }) => {
  return (
    <Box sx={{ position: "relative" }}>
      <Card
        sx={{
          maxWidth: "calc(100vw - 32.5px)",
          mb: 1.5,
          opacity: data.completed ? 0.5 : 1,
          border: "2px solid #eee",
          borderRadius: 5,
          transition: "none",
          "&:hover": {
            borderColor: "#ddd",
            background: "#eee",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 2,
            py: 1.5,
            with: "300px",
          }}
        >
          <Box
            onClick={() => {
              fetchApiWithoutHook("property/lists/toggleCompleted", {
                id: data.id,
                completed: data.completed ? "true" : "false",
              });

              // alert(id);
              setListData(
                listData.map((list) => {
                  if (list.id === parent.id) {
                    return {
                      ...list,
                      items: list.items.map((item) => {
                        if (item.id === data.id) {
                          return {
                            ...item,
                            completed: !item.completed,
                          };
                        }
                        return item;
                      }),
                    };
                  }
                  return list;
                })
              );
            }}
            sx={{
              pt: 1,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                userSelect: "none",
                cursor: "pointer",
              }}
            >
              {data.completed ? "task_alt" : "circle"}
            </span>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              flex: "1 1 0",
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                mt: data.details ? 1 : 0,
              }}
            >
              {data.name}
            </Typography>
            {data.details && (
              <Typography
                variant="body2"
                sx={{
                  my: 1,
                  mt: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {data.details}
              </Typography>
            )}
            {data.due && (
              <Typography
                variant="body2"
                sx={{
                  my: 1,
                  mt: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <span className="material-symbols-rounded">today</span>
                {formatDate(data.due) === formatDate(new Date())
                  ? "Today"
                  : formatDate(data.due).replaceAll("-", "/")}
              </Typography>
            )}
          </Box>
          {/* <Box sx={{ ml: "auto" }}>
            <IconButton>
              <span className="material-symbols-outlined">delete</span>
            </IconButton>
          </Box> */}
        </Box>
      </Card>
    </Box>
  );
};

const RenderLists = ({ url, data, error }) => {
  const [value, setValue] = React.useState(data[0] ? data[0].id : -1);
  const [open, setOpen] = React.useState(false);
  const [listData, setListData] = React.useState(data);

  useStatusBar(open);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue !== "CREATE_LIST") setValue(newValue);
  };

  const percent =
    value === -1
      ? 0
      : (listData
          .filter((list) => list.id === value)[0]
          .items.filter((item) => item.completed).length /
          listData.filter((list) => list.id === value)[0].items.length) *
          100 || 0;

  const config = {
    angle: 90,
    spread: 90,
    startVelocity: 40,
    elementCount: 80,
    dragFriction: 0.13,
    duration: 3000,
    stagger: 6,
    width: "10px",
    height: "10px",
    perspective: "860px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };
  const trigger = useMediaQuery("(max-width: 600px)");
  return (
    <Box sx={{ width: "100%" }}>
      <Typography sx={{ my: 5, mb: 3, px: 1, fontWeight: "600" }} variant="h5">
        Tasks
      </Typography>
      {error && (
        <ErrorHandler error="An error occurred while trying to fetch your lists" />
      )}
      {listData && (
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={value}
          onChange={handleChange}
          aria-label="secondary tabs example"
          sx={{
            mb: { sm: 4 },
            maxWidth: "calc(100vw - 32.5px)",
            "& .MuiTabs-indicator": {
              borderRadius: 5,
              height: "100%",
              opacity: 0.1,
              zIndex: -1,
            },
          }}
        >
          {listData.map((list) => (
            <Tab
              value={list.id}
              label={list.name}
              sx={{
                minWidth: "auto",
                px: 3,
                mr: 0.5,
                transition: "all .2s!important",
                "& *": {
                  transition: "all .2s!important",
                },
                textTransform: "none",
                borderRadius: 5,
              }}
            />
          ))}
          <Tab
            disableRipple
            value={"CREATE_LIST"}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <span className="material-symbols-outlined">add_circle</span>
                Create new list
              </Box>
            }
            onClick={(e) => setOpen(true)}
            sx={{
              minWidth: "auto",
              px: 3,
              transition: "all .2s!important",
              "& *": {
                transition: "all .2s!important",
              },
              textTransform: "none",
              borderRadius: 5,
            }}
          />
        </Tabs>
      )}
      <CreateListModal
        mutateUrl={url}
        open={open}
        setValue={setValue}
        setOpen={setOpen}
        setListData={setListData}
        listData={listData}
      />
      {value !== -1 && (
        <Grid container spacing={0}>
          <Grid item xs={12} sm={8}>
            <CreateListItemModal
              mutationUrl={url}
              listData={listData}
              setListData={setListData}
              parent={data.filter((list) => list.id === value)[0]}
            />
            {listData
              .filter((list) => list.id === value)[0]
              .items.sort(function (x, y) {
                return x.completed === y.completed ? 0 : x.completed ? 1 : -1;
              })
              .map((item) => (
                <ListItem
                  listData={listData}
                  setListData={setListData}
                  data={item}
                  parent={data.filter((list) => list.id === value)[0]}
                />
              ))}

            <Box sx={{ mx: "auto" }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  // flexDirection: "column",
                }}
              >
                <Button
                  fullWidth
                  disableElevation
                  variant="contained"
                  size="large"
                  sx={{
                    background: colors[themeColor][50] + "!important",
                    color: "#000",
                    "&:hover": { color: colors[themeColor][900] },
                    borderRadius: 99,
                    transition: "none",
                    gap: 2,
                  }}
                >
                  <span className="material-symbols-rounded">share</span>
                  Share
                </Button>
                <Button
                  fullWidth
                  disableElevation
                  variant="contained"
                  size="large"
                  sx={{
                    background: colors[themeColor][50] + "!important",
                    color: "#000",
                    "&:hover": { color: colors[themeColor][900] },
                    borderRadius: 99,
                    transition: "none",
                    gap: 2,
                  }}
                  onClick={() => {
                    if (confirm("Delete list?")) {
                      fetchApiWithoutHook("property/lists/delete-list", {
                        parent: value,
                      }).then(() => {
                        setListData(
                          listData.filter((list) => list.id !== value)
                        );
                        setValue(-1);
                        // alert(value);
                      });
                    }
                  }}
                >
                  <span className="material-symbols-rounded">delete</span>
                  Delete
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              position: { xs: "sticky", sm: "unset" },
              zIndex: 99,
              top: "65px",
              py: { xs: 1, sm: 0 },
              pt: { xs: 3, sm: 0 },
              pl: { sm: 2 },
              mb: 2,
              background:
                "linear-gradient(-180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
              order: { xs: -1, sm: 1 },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: { xs: "100px", sm: "200px" },
                transform: "translateX(-50%)",
              }}
            >
              <Confetti active={percent === 100} config={config} />
            </Box>
            <Card
              sx={{
                mb: { xs: 0, sm: 3 },
                py: { sm: 2 },
                boxShadow: "0 10px 20px rgba(255,255,255,1)",
                background: "#eee",
                border: "2px solid #ddd",
                borderRadius: 5,
                transition: "none",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  py: 1,
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    display: { xs: "flex", sm: "block" },
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: colors.orange[900],
                      fontWeight: "900",
                      order: 1,
                      ml: "auto",
                      display: { xs: "flex", sm: "none" },
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <span className="material-symbols-rounded">
                      local_fire_department
                    </span>
                    7
                  </Typography>
                  <Box
                    sx={{
                      ml: 1,
                      order: 2,
                      zIndex: 0,
                      position: "relative",
                      display: "inline-flex",
                    }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={percent}
                      size={trigger ? 50 : 100}
                      thickness={4}
                      sx={{
                        zIndex: 1,
                        [`& .MuiCircularProgress-circle`]: {
                          strokeLinecap: "round",
                          ...(percent === 100 && { stroke: "#00e676" }),
                        },
                        [`& .MuiCircularProgress-svg`]: {
                          borderRadius: 999,
                        },
                      }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: { xs: "5px solid #ddd", sm: "9px solid #ddd" },
                        borderRadius: 999,
                        zIndex: 0,
                      }}
                    >
                      <Typography
                        component="div"
                        color="primary"
                        sx={{
                          fontSize: { xs: "11px", sm: "15px" },
                          mt: "1px",
                          fontWeight: percent === 0 ? "200" : "900",
                          ...(percent == 0 && {
                            color: "#aaa",
                          }),
                          ...(percent == 100 && {
                            color: "#00e676",
                          }),
                        }}
                      >
                        {Math.round(percent)}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      textAlign: { xs: "left", sm: "center" },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: { xs: "12.5px", sm: "17px" },
                        textTransform: { xs: "uppercase", sm: "none" },
                        mt: { sm: 1 },
                      }}
                    >
                      Productivity
                    </Typography>
                    <Typography
                      variant="body2"
                      className="font-secondary"
                      sx={{
                        fontSize: { xs: "16px", sm: "15px" },
                        mt: { sm: 1 },
                      }}
                    >
                      {
                        listData
                          .filter((list) => list.id === value)[0]
                          .items.filter((item) => !item.completed).length
                      }{" "}
                      tasks remaining{percent === 100 && "!"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export function Lists() {
  const { url, data, error } = useApi("property/lists");
  return !data ? (
    <Box
      sx={{
        overflow: "hidden",
        maxHeight: "calc(100vh - 169px)",
        pt: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          gap: 2,
          maxWidth: "calc(100vw - 64px)",
        }}
      >
        {[...new Array(5)].map((_, i) => (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              borderRadius: 5,
              transition: "all .2s!important",
              width: 100,
            }}
            key={Math.random().toString()}
            height={30}
          />
        ))}
      </Box>
      <Box>
        {[...new Array(15)].map((_, i) => (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              mb: i == 0 ? 4 : 2,
              borderRadius: 5,
              width: "100%",
            }}
            key={Math.random().toString()}
            height={80}
          />
        ))}
      </Box>
    </Box>
  ) : (
    <RenderLists url={url} data={data} error={error} />
  );
}
