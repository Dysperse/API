import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { ErrorHandler } from "../ErrorHandler";
import { Button, SwipeableDrawer, TextField } from "@mui/material";
import { colors } from "../../lib/colors";
import { Puller } from "../Puller";
import { useFormik } from "formik";

const CreateListModal = ({ open, setOpen }) => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchApiWithoutHook("property/lists/createList", {
      name,
      description,
    });
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
            value={name}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              mt: 2,
            }}
            label="Add a description..."
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, borderRadius: 999 }}
            size="large"
            disableElevation
          >
            Create
          </Button>
        </form>
      </Box>
    </SwipeableDrawer>
  );
};
const ListItem = ({ parent, data }) => {
  return (
    <Card
      sx={{
        maxWidth: "calc(100vw - 32.5px)",
        mb: 2,
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
          py: 1,
          with: "300px",
        }}
      >
        <span className="material-symbols-outlined">circle</span>
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
            }}
          >
            {data.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {data.details}
          </Typography>
        </Box>
        <Box sx={{ ml: "auto" }}>
          <IconButton>
            <span className="material-symbols-outlined">more_vert</span>
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

const RenderLists = ({ data, error }) => {
  const [value, setValue] = React.useState(data[0].id);
  const [open, setOpen] = React.useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue !== "CREATE_LIST") setValue(newValue);
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
                  height: "100%",
                  opacity: 0.2,
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
                value={"CREATE_LIST"}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <span className="material-symbols-rounded">add</span>
                    Create
                  </Box>
                }
                onClick={(e) => setOpen(true)}
                sx={{
                  textTransform: "none",
                  borderRadius: 5,
                }}
              />
            </Tabs>
          )}

          <CreateListModal open={open} setOpen={setOpen} />
          <Card
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
                py: 2,
              }}
            >
              <span className="material-symbols-outlined">add_circle</span>
              <Box sx={{ flexGrow: 1 }}>
                <Typography>Create task...</Typography>
              </Box>
            </Box>
          </Card>

          {data
            .filter((list) => list.id === value)[0]
            .items.map((item) => (
              <ListItem
                data={item}
                parent={data.filter((list) => list.id === value)[0]}
              />
            ))}
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              mt: { sm: 10 },
              mb: 4,
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
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <CircularProgress
                    variant="determinate"
                    value={69}
                    size={100}
                    thickness={4}
                    sx={{
                      zIndex: 9999,
                      [`& .MuiCircularProgress-circle`]: {
                        strokeLinecap: "round",
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
                    >{`69%`}</Typography>
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Today&apos;s tasks
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  5 tasks remaining
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export function Lists() {
  const { data, error } = useApi("property/lists");
  return !data ? (
    <>
      <CircularProgress />
    </>
  ) : (
    <RenderLists data={data} error={error} />
  );
}
