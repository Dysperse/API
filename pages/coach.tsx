import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import { colors } from "../lib/colors";
import { Calendar } from "../components/Coach/Calendar";
import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ExploreGoals() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-scrollButtons.Mui-disabled": {
              opacity: 0.3,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              minWidth: 72,
            },
            "& .MuiTabs-indicator": {},
          }}
        >
          {[
            "All",
            "Education",
            "Health",
            "Career",
            "Finance",
            "Relationships",
            "Hobbies",
            "Travel",
            "Personal Growth",
            "Mental health",
          ].map((tab, index) => (
            <Tab label={tab} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
}

function MyGoals() {
  return (
    <Box>
      <CardActionArea
        sx={{
          background: colors[themeColor][50],
          color: colors[themeColor][900],
          p: 2,
          my: 4,
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          maxWidth: "500px",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: "600" }} className="font-secondary">
            Finish today&apos;s goals
          </Typography>
          <Typography variant="body2">7 tasks remaining</Typography>
        </Box>
        <span
          className="material-symbols-rounded"
          style={{
            marginLeft: "auto",
          }}
        >
          arrow_forward
        </span>
      </CardActionArea>

      <Typography variant="h6" className="font-secondary">
        Explore
      </Typography>

      <ExploreGoals />
    </Box>
  );
}

export default function Render() {
  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            background: "linear-gradient(-45deg, #715DF2 0%, #001122 50%)",
            p: 3,
            mt: 3,
            borderRadius: 5,
            color: "#fff",
          }}
        >
          <Typography variant="h6">
            Reach big goals with small steps.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              maxWidth: 500,
            }}
          >
            Carbon coach helps you to reach your goals by breaking them down
            into small steps. Enrich your daily routine with new knowledge and
            skills to accelerate your growth.
          </Typography>
        </Box>
      </Box>
      <Calendar />
      <Box sx={{ px: 3 }}>
        <MyGoals />
      </Box>
    </>
  );
}
