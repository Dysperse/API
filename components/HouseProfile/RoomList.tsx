import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as colors from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";
import toast from "react-hot-toast";
import SwipeableViews from "react-swipeable-views";
import useSWR from "swr";

function Room({ room }: any) {
  const [deleted, setDeleted] = React.useState<boolean>(false);
  return deleted ? (
    <>This room has been deleted</>
  ) : (
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
        disabled={global.property.role === "read-only"}
        onClick={() => {
          if (
            confirm(
              "Delete this room including the items in it? This action is irreversible."
            )
          ) {
            setDeleted(true);
            fetch(
              "/api/rooms/delete?" +
                new URLSearchParams({
                  id: room.id,
                  property: global.property.propertyId,
                  accessToken: global.property.accessToken,
                }),
              {
                method: "POST",
              }
            )
              .then(() => toast.success("Room deleted!"))
              .catch(() => {
                toast.error("Failed to delete room");
                setDeleted(false);
              });
          }
        }}
      >
        Delete
      </Button>
    </>
  );
}
export function RoomList() {
  const url =
    "/api/property/rooms?" +
    new URLSearchParams({
      property: global.property.propertyId,
      accessToken: global.property.accessToken,
    });
  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );

  const images = data
    ? [
        ...data.map((room) => {
          return {
            content: <Room room={room} />,
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
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 1,
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
          resistance
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          style={{
            borderRadius: "28px",
            width: "100%",
            padding: "0 30px",
          }}
          slideStyle={{
            padding: "0 10px",
            paddingLeft: 0,
          }}
        >
          {images.length === 0 ? (
            <Box
              sx={{
                p: 2,
                userSelect: "none",
                px: 2.5,
                borderRadius: 5,
                background: colors[themeColor][100],
              }}
            >
              You haven&apos;t created any rooms yet
            </Box>
          ) : (
            images.map((step, index) => (
              <Box key={index.toString()}>
                <Box
                  sx={{
                    p: 2,
                    userSelect: "none",
                    px: 2.5,
                    borderRadius: 5,
                    background:
                      global.theme === "dark"
                        ? "hsl(240, 11%, 30%)"
                        : colors[themeColor][100],
                  }}
                >
                  {step.content}
                </Box>
              </Box>
            ))
          )}
        </SwipeableViews>
      </Box>
    </>
  );
}
