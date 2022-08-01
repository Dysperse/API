import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import useSWR from "swr";

export function RoomList() {
  const url =
    "/api/rooms?" +
    new URLSearchParams({
      token:
        global.session &&
        (global.session.user.SyncToken || global.session.accessToken),
    });
  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );

  const images = data
    ? [
        ...data.data.map((room) => {
          return {
            content: (
              <>
                <Typography
                  sx={{
                    fontWeight: "600",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {room.name}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderWidth: "2px!important",
                    width: "100%",
                    mt: 1.5,
                    borderRadius: 4,
                  }}
                >
                  Delete
                </Button>
              </>
            ),
          };
        }),
      ]
    : [];

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        "& *": {
          overscrollBehavior: "auto!important",
        },
        // "& [data-swipeable]": {
        //   width: "90% !important",
        // },
      }}
    >
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {images.map((step, index) => (
          <Box key={index.toString()} sx={{ p: 1 }}>
            <Box
              sx={{
                p: 2,
                userSelect: "none",
                px: 2.5,
                borderRadius: 5,
                background: "rgba(200,200,200,.3)",
              }}
            >
              {step.content}
            </Box>
          </Box>
        ))}
      </SwipeableViews>

      <Box>
        <IconButton
          disabled={activeStep === maxSteps - 1}
          onClick={handleNext}
          sx={{
            color: colors[themeColor][900],
            background: colors[themeColor][200] + "!important",
            backdropFilter: "blur(10px)",
            zIndex: 99,
          }}
        >
          <span className="material-symbols-rounded">chevron_right</span>
        </IconButton>
      </Box>
    </Box>
  );
}
