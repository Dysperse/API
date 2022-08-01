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
    "/api/account/sync/member-list?" +
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
        {
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
                {global.session.user.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {global.session.user.email}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  border: "2px solid transparent !important",
                  boxShadow: 0,
                  borderRadius: 4,
                  width: "100%",
                  mt: 1.5,
                }}
              >
                Account&nbsp;settings
              </Button>
            </>
          ),
        },
        ...data.data
          .filter((e: any) => e.email !== global.session.user.email)
          .map((member) => {
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
                    {member.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {member.email}
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
                    Remove
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

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
        "& [data-swipeable]": {
          width: "250px !important",
        },
      }}
    >
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {images.map((step, index) => (
          <Box sx={{ p: 1 }}>
            <Box
              sx={{
                p: 2,
                userSelect: "none",
                px: 2.5,
                borderRadius: 5,
                background: "rgba(200,200,200,.3)",
              }}
              key={index.toString()}
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
