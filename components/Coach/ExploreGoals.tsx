import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import React from "react";
import { goals, categories } from "./goalTemplates";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ px: 1, py: 1 }}>{children}</Box>}
    </div>
  );
}

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function ExploreGoals() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        background: "rgba(200,200,200,.3)",
        borderRadius: 5,
        p: 4,
        my: 3,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "900" }}>
        Explore Goals
      </Typography>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 0,
            height: "auto",
            "& .MuiTabs-scrollButtons.Mui-disabled": {
              opacity: 0.3,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              minWidth: 72,
              borderRadius: 3,
              minHeight: 20,
              maxHeight: 20,
              height: 20,
              py: 2,
            },
            "& .MuiTabs-indicator": {
              height: "100%",
              borderRadius: 3,
              opacity: 0.1,
            },
          }}
        >
          {categories.map((tab, index) => (
            <Tab disableRipple label={tab} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {categories.map((tab, index) => (
        <TabPanel value={value} index={index}>
          {goals
            .filter((goal) => goal.category === tab)
            .map((goal) => (
              <Box
                sx={{
                  background: "rgba(200,200,200,.3)",
                  borderRadius: 5,
                  p: 2,
                  my: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    sx={{ fontWeight: "600" }}
                    className="font-secondary"
                  >
                    {goal.name}
                  </Typography>
                  <Typography variant="body2">{goal.description}</Typography>
                </Box>
                <span
                  className="material-symbols-rounded"
                  style={{
                    marginLeft: "auto",
                  }}
                >
                  arrow_forward
                </span>
              </Box>
            ))}
        </TabPanel>
      ))}

      <Button
        href="https://my.smartlist.tech/canny-auth?companyID=6306f3586e9c6244c28c1d1e&redirect=https%3A%2F%2Ffeedback.smartlist.tech%2F"
        target="_blank"
        sx={{ gap: 2, transition: "none" }}
        size="small"
        disableRipple
      >
        Have a goal in mind? Suggest it!
        <span className="material-symbols-rounded">arrow_forward</span>
      </Button>
    </Box>
  );
}
