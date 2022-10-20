import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useApi } from "../../hooks/useApi";
import { ErrorHandler } from "../ErrorHandler";

const ListItem = ({ parent, data }) => {
  return (
    <Card
      sx={{
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
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          pt: 3,
        }}
      >
        <span className="material-symbols-outlined">circle</span>
        <Box sx={{ flexGrow: 1 }}>
          <Typography>{data.name}</Typography>
          <Typography variant="body2">{data.details}</Typography>
        </Box>
        <Box sx={{ ml: "auto" }}>
          <IconButton>
            <span className="material-symbols-outlined">more_vert</span>
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

const RenderLists = ({ data, error }) => {
  const [value, setValue] = React.useState(data[0].id);

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
                label="+ &nbsp; Create new list"
                onClick={(e) => {
                  alert("Coming soon!");
                }}
                sx={{
                  textTransform: "none",
                  borderRadius: 5,
                }}
              />
            </Tabs>
          )}
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
  return !data ? <></> : <RenderLists data={data} error={error} />;
}
