import { fetchRawApi } from "@/lib/client/useApi";
import { toastStyles } from "@/lib/client/useTheme";
import useWindowDimensions from "@/lib/client/useWindowDimensions";
import { colors } from "@/lib/colors";
import {
  Backdrop,
  Box,
  Button,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import Confetti from "react-confetti";
import toast from "react-hot-toast";
import { mutate } from "swr";

export function TrophyModal({ goal, mutationUrl }) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [stepTwoOpen, setStepTwoOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (open) {
      const trophy: any = document.getElementById("trophy");
      const slideIn: any = document.getElementById("slide-in-bottom");
      trophy.style.display = "none";
      slideIn.style.display = "none";
      setTimeout(() => {
        trophy.style.display = "";
        slideIn.style.display = "";
      }, 500);
    } else {
      const trophy: any = document.getElementById("trophy");
      const slideIn: any = document.getElementById("slide-in-bottom");
      trophy.style.display = "none";
      slideIn.style.display = "none";
    }
  }, [open]);

  return (
    <>
      <Dialog
        open={stepTwoOpen}
        onClose={() => setStepTwoOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 5,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Are you satisfied with how Dysperse Coach helped you achieve this
            goal?
          </Typography>
          <Typography>
            To claim your trophy, rate your experience below!
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {[
              "sentiment_dissatisfied",
              "sentiment_neutral",
              "sentiment_satisfied",
            ].map((icon) => (
              <IconButton
                key={icon}
                onClick={() => {
                  setLoading(true);
                  fetchRawApi("user/coach/goals/complete", {
                    daysLeft: goal.durationDays - goal.progress,
                    feedback: icon,
                    id: goal.id,
                  })
                    .then(async () => {
                      try {
                        await mutate(mutationUrl);
                        setStepTwoOpen(false);
                        toast.success(
                          "You earned a trophy! Thanks for your feedback!",
                          { ...toastStyles, icon: "🎉" }
                        );
                      } catch (e) {
                        toast.error(
                          "An error occurred. Please try again later.",
                          toastStyles
                        );
                      }
                      setLoading(false);
                    })
                    .catch(() => {
                      setLoading(false);
                      toast.error(
                        "An error occurred. Please try again later.",
                        toastStyles
                      );
                    });
                }}
                disabled={loading}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "50px",
                  }}
                >
                  {icon}
                </span>
              </IconButton>
            ))}
          </Box>
        </Box>
      </Dialog>
      <Backdrop
        open={open}
        onClick={() => {
          setOpen(false);
          setStepTwoOpen(true);
        }}
        sx={{
          zIndex: 999999,
          cursor: "pointer",
        }}
      >
        <Confetti width={width} height={height} style={{ zIndex: 1 }} />
        <picture>
          <img
            alt="trophy"
            src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3c6.png"
            className="animate-trophy"
            id="trophy"
            style={{
              zIndex: 999999,
            }}
          />
        </picture>
        <Box
          sx={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            background: "rgba(0,0,0,0.7)",
            p: 2,
            px: 3,
            color: "#fff",
            zIndex: 999999999,
            borderRadius: 5,
            width: "calc(100% - 20px)",
            mb: "20px",
            backdropFilter: "blur(20px)",
          }}
          className="slide-in-bottom"
          id="slide-in-bottom"
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "900", textDecoration: "underline" }}
          >
            Congratulations!
          </Typography>
          <Typography variant="body1" sx={{ mt: "4px" }}>
            After spending{" "}
            <b>
              <u>{goal.durationDays} days</u>
            </b>{" "}
            working hard towards this goal, you finally achieved it! Pat
            yourself on the back!
          </Typography>
          <Button
            sx={{
              boxShadow: 0,
              borderRadius: 9999,
              background: "#fff!important",
              color: "#000",
              mt: 1,
              width: "100%",
            }}
            variant="contained"
            onClick={() => setOpen(false)}
          >
            Next
          </Button>
        </Box>
      </Backdrop>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          background: colors.deepOrange["100"],
          borderRadius: 5,
          mb: 5,
          cursor: "pointer",
          transition: "all .1s",
          userSelect: "none",
          color: "#000",
          "&:active": {
            transform: "scale(0.98)",
            transition: "none",
          },
          gap: 3,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Box>
          <Typography variant="h6">You&apos;ve completed this goal!</Typography>
          <Typography variant="body1">
            All that hard work paid off! Tap to claim your trophy!
          </Typography>
        </Box>
        <picture>
          <img
            src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3c6.png"
            alt="trophy"
            width={"100px"}
          />
        </picture>
      </Box>
    </>
  );
}
