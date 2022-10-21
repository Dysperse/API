import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import { SwipeableDrawer, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { ErrorHandler } from "../ErrorHandler";
import { Puller } from "../Puller";
import Collapse from "@mui/material/Collapse";
import Confetti from "react-dom-confetti";

const CreateListItemModal = ({
  parent,
  listData,
  setListData,
  mutationUrl,
}) => {
  const [open, setOpen] = React.useState(false);
  const [showDescription, setShowDescription] = React.useState(false);
  useStatusBar(open);
  const styles = {
    color: colors[themeColor][800],
    borderRadius: 3,
    transition: "none",
  };

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [pinned, setPinned] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchApiWithoutHook("property/lists/createItem", {
      name: title,
      details: description,
      pinned: pinned ? "true" : "false",
      list: parent.id,
    }).then((res) => {
      setListData(
        listData.map((list) => {
          if (list.id === parent.id) {
            return {
              ...list,
              items: [...list.items, res],
            };
          }
          return list;
        })
      );
      setTitle("");
      setDescription("");
      setDate(new Date());
      setPinned(false);
      setOpen(false);
    });
  };

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          elevation: 0,
          sx: {
            maxWidth: "600px",
            mb: { sm: 5 },
            mx: "auto",
            background: colors[themeColor][50],
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
          },
        }}
      >
        <Box sx={{ display: { sm: "none" } }}>
          <Puller />
        </Box>
        <Box sx={{ p: { xs: 3, sm: 3 }, pt: { xs: 0, sm: 3 } }}>
          <form onSubmit={handleSubmit}>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              fullWidth
              variant="standard"
              placeholder="Clean the gutters"
              InputProps={{
                className: "font-secondary",
                disableUnderline: true,
                sx: { fontSize: 19 },
              }}
            />
            <Collapse in={showDescription}>
              <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                variant="standard"
                placeholder="Add a description"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 15, mt: 0.5, mb: 1 },
                }}
              />
            </Collapse>
            <Box sx={{ display: "flex", mt: 1 }}>
              <IconButton
                disableRipple
                onClick={() => setPinned(!pinned)}
                sx={{
                  ...styles,
                  background: pinned && colors[themeColor][100],
                }}
              >
                <span
                  style={{ transform: "rotate(-45deg)" }}
                  className="material-symbols-rounded"
                >
                  push_pin
                </span>
              </IconButton>
              <IconButton disableRipple sx={{ ...styles, mx: 1 }}>
                <span className="material-symbols-rounded">today</span>
              </IconButton>
              <IconButton
                disableRipple
                onClick={() => setShowDescription(!showDescription)}
                sx={{
                  ...styles,
                  background: showDescription && colors[themeColor][100],
                }}
              >
                <span className="material-symbols-rounded">notes</span>
              </IconButton>
              <Button
                type="submit"
                sx={{ ml: "auto", borderRadius: 5, px: 3 }}
                variant="contained"
                disableElevation
              >
                Create
              </Button>
            </Box>
          </form>
        </Box>
      </SwipeableDrawer>
      <Card
        onClick={() => setOpen(true)}
        sx={{
          mb: 2,
          background: "#eee",
          border: "2px solid #ddd",
          boxShadow: "3px 5px #ddd",
          borderRadius: 5,
          transition: "none",
          cursor: "pointer",
          "&:hover": {
            boxShadow: "3px 5px #ccc",
            borderColor: "#ccc",
            background: "#ddd",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 3,
            userSelect: "none",
            py: 2,
          }}
        >
          <span className="material-symbols-outlined">add_circle</span>
          <Box sx={{ flexGrow: 1 }}>
            <Typography>Create task...</Typography>
          </Box>
        </Box>
      </Card>
    </>
  );
};

const CreateListModal = ({ mutationUrl, open, setOpen }) => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchApiWithoutHook("property/lists/createList", {
      name,
      description,
    });
    mutate(mutationUrl);
    setOpen(false);
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      disableSwipeToOpen
      PaperProps={{
        elevation: 0,
        sx: {
          mx: "auto",
          maxWidth: "500px",
          background: colors[themeColor][50],
          borderRadius: "20px 20px 0 0",
        },
      }}
    >
      <Puller />
      <Box
        sx={{
          p: 3,
          pt: 0,
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            variant="filled"
            autoComplete="off"
            fullWidth
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              mt: 2,
            }}
            label="List name..."
            placeholder="My wishlist"
          />
          <TextField
            variant="filled"
            autoComplete="off"
            fullWidth
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              mt: 2,
            }}
            label="Add a description..."
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
          <LoadingButton
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, borderRadius: 999 }}
            size="large"
            disableElevation
          >
            Create
          </LoadingButton>
        </form>
      </Box>
    </SwipeableDrawer>
  );
};
const ListItem = ({ listData, setListData, parent, data }) => {
  return (
    <Box sx={{ position: "relative" }}>
      <Card
        sx={{
          maxWidth: "calc(100vw - 32.5px)",
          mb: 2,
          opacity: data.completed ? 0.5 : 1,
          border: "2px solid #eee",
          boxShadow: "3px 5px #eee",
          borderRadius: 5,
          transition: "none",
          "&:hover": {
            boxShadow: "3px 5px #ddd",
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
          </Box>
          <Box sx={{ ml: "auto" }}>
            <IconButton>
              <span className="material-symbols-outlined">more_vert</span>
            </IconButton>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

const RenderLists = ({ url, data, error }) => {
  const [value, setValue] = React.useState(data[0].id);
  const [open, setOpen] = React.useState(false);
  const [listData, setListData] = React.useState(data);

  useStatusBar(open);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue !== "CREATE_LIST") setValue(newValue);
  };

  const percent =
    (listData
      .filter((list) => list.id === value)[0]
      .items.filter((item) => item.completed).length /
      listData.filter((list) => list.id === value)[0].items.length) *
    100;

  const config = {
    angle: 90,
    spread: 90,
    startVelocity: 40,
    elementCount: 40,
    dragFriction: 0.13,
    duration: 3000,
    stagger: 6,
    width: "10px",
    height: "10px",
    perspective: "860px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  return (
    <Box sx={{ width: "100%" }}>
      {error && (
        <ErrorHandler error="An error occurred while trying to fetch your lists" />
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          {data && (
            <Tabs
              variant="scrollable"
              scrollButtons="auto"
              value={value}
              onChange={handleChange}
              aria-label="secondary tabs example"
              sx={{
                mb: 4,
                maxWidth: "calc(100vw - 32.5px)",
                "& .MuiTabs-indicator": {
                  borderRadius: 5,
                  height: "4px",
                  opacity: 0.8,
                  zIndex: -1,
                },
              }}
            >
              {data.map((list) => (
                <Tab
                  disableRipple
                  value={list.id}
                  label={list.name}
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
              ))}
              <Tab
                disableRipple
                value={"CREATE_LIST"}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <span className="material-symbols-outlined">
                      add_circle
                    </span>
                    Create
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

          <CreateListModal mutationUrl={url} open={open} setOpen={setOpen} />
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
        </Grid>
        <Grid item xs={12} sm={4} sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "200px",
              transform: "translateX(-50%)",
            }}
          >
            <Confetti active={percent === 100} config={config} />
          </Box>
          <Card
            sx={{
              mt: { sm: 10 },
              mb: 3,
              py: 2,
              border: "2px solid #eee",
              boxShadow: "3px 5px #eee",
              borderRadius: 5,
              transition: "none",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    zIndex: 0,
                    position: "relative",
                    display: "inline-flex",
                  }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={percent}
                    size={100}
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
                      border: "9px solid #eee",
                      borderRadius: 999,
                      zIndex: 0,
                    }}
                  >
                    <Typography
                      component="div"
                      color="primary"
                      sx={{
                        ...(percent == 0 && {
                          color: "#606060",
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
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Progress
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {
                    listData
                      .filter((list) => list.id === value)[0]
                      .items.filter((item) => !item.completed).length
                  }{" "}
                  tasks remaining
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Button
              fullWidth
              disableElevation
              variant="outlined"
              size="large"
              sx={{
                borderWidth: "2px!important",
                borderRadius: 99,
                transition: "none",
              }}
            >
              Share
            </Button>
            <Button
              fullWidth
              disableElevation
              variant="outlined"
              size="large"
              sx={{
                borderWidth: "2px!important",
                borderRadius: 99,
                transition: "none",
              }}
            >
              Delete list
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export function Lists() {
  const { url, data, error } = useApi("property/lists");
  return !data ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "calc(100vh - 200px)",
      }}
    >
      <CircularProgress
        sx={{
          [`& .MuiCircularProgress-circle`]: {
            strokeLinecap: "round",
          },
        }}
      />
    </Box>
  ) : (
    <RenderLists url={url} data={data} error={error} />
  );
}
