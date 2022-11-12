import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import useSWR from "swr";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";

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
        <Box sx={{ py: 3 }}>
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

function CategoryList() {
  const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
  const { error, data } = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );

  const [emblaRef] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
    },
    [WheelGesturesPlugin()]
  );

  return (
    <Box sx={{ mt: 0 }}>
      {error && <div>failed to load categories</div>}
      <div ref={emblaRef} className="embla">
        <div className="embla__container">
          {data &&
            data.categories.map((category) => (
              <Chip
                onClick={() => {
                  // alert(category.idCategory);
                }}
                key={category.idCategory}
                label={category.strCategory}
                sx={{ ml: 1 }}
              />
            ))}
        </div>
      </div>
    </Box>
  );
}

function AreaList() {
  const url = "https://www.themealdb.com/api/json/v1/1/list.php?a=list";
  const { error, data } = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );

  const [emblaRef] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
    },
    [WheelGesturesPlugin()]
  );

  return (
    <Box sx={{ mt: 0 }}>
      {error && <div>failed to load meal types</div>}
      <div ref={emblaRef} className="embla">
        <div className="embla__container">
          {data &&
            data.meals.map((category) => (
              <Chip
                onClick={() => {
                  // alert(category.strArea);
                }}
                key={category.strArea}
                label={category.strArea}
                sx={{ ml: 1 }}
              />
            ))}
        </div>
      </div>
    </Box>
  );
}

function IngredientList() {
  const url = "https://www.themealdb.com/api/json/v1/1/list.php?i=list";
  const { error, data } = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );

  const [emblaRef] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
    },
    [WheelGesturesPlugin()]
  );

  return (
    <Box sx={{ mt: 0 }}>
      {error && <div>failed to load meal types</div>}
      <div ref={emblaRef} className="embla">
        <div className="embla__container">
          {data &&
            data.meals.map((category) => (
              <Chip
                onClick={() => {
                  // alert(category.idIngredient);
                }}
                key={category.idIngredient}
                label={category.strIngredient}
                sx={{ ml: 1 }}
              />
            ))}
        </div>
      </div>
    </Box>
  );
}

function AzList() {
  const [emblaRef] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
    },
    [WheelGesturesPlugin()]
  );

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return (
    <Box sx={{ mt: 0 }}>
      <div ref={emblaRef} className="embla">
        <div className="embla__container">
          {alphabet.map((letter) => (
            <Chip
              onClick={() => {
                // alert(letter);
              }}
              key={letter}
              label={letter}
              sx={{ ml: 1 }}
            />
          ))}
        </div>
      </div>
    </Box>
  );
}

export default function Explore() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const tabStyles = {
    borderRadius: 3,
    textTransform: "none",
    minWidth: "auto",
  };

  return (
    <Box sx={{ p: 3, maxWidth: "100vw" }}>
      <Box
        sx={{
          background: "rgba(200,200,200,.3)",
          p: 2,
          width: "100%",
          py: 1,
          mt: 1,
          borderRadius: 5,
        }}
      >
        <Tabs
          sx={{
            mt: 1,
            // Indicator
            "& .MuiTabs-indicator": {
              height: "100%",
              borderRadius: 3,
              opacity: 0.3,
            },
          }}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            disableRipple
            sx={tabStyles}
            label="Category"
            {...a11yProps(0)}
          />
          <Tab disableRipple sx={tabStyles} label="Area" {...a11yProps(1)} />
          <Tab
            disableRipple
            sx={tabStyles}
            label="Ingredient"
            {...a11yProps(2)}
          />
          <Tab
            disableRipple
            sx={tabStyles}
            label="By first letter"
            {...a11yProps(3)}
          />
        </Tabs>

        <TabPanel value={value} index={0}>
          <CategoryList />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AreaList />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <IngredientList />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <AzList />
        </TabPanel>
      </Box>
    </Box>
  );
}
