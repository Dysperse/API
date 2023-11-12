import { vibrate } from "@/lib/client/vibration";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

export const HeadingComponent = ({ palette, isMobile }) => {
  const [isHover, setIsHover] = useState(false);
  const time = new Date().getHours();

  const open = () => {
    vibrate(50);
    setIsHover(true);
  };
  const close = () => {
    vibrate(50);
    setIsHover(false);
  };

  const [currentTime, setCurrentTime] = useState(dayjs().format("hh:mm:ss A"));

  useEffect(() => {
    if (isHover) {
      setCurrentTime(dayjs().format("hh:mm:ss A"));
      const interval = setInterval(() => {
        setCurrentTime(dayjs().format("hh:mm:ss A"));
      });
      return () => clearInterval(interval);
    }
  }, [isHover]);

  const getGreeting = useMemo(() => {
    if (time < 12) return "morning";
    else if (time < 17) return "afternoon";
    else if (time < 20) return "evening";
    else return "night";
  }, [time]);

  const [greeting, setGreeting] = useState(getGreeting);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting);
    }, 1000 * 60 * 60);
    return () => clearInterval(interval);
  });

  return (
    <Typography
      className="font-heading"
      sx={{
        fontSize: {
          xs: "55px",
          sm: "60px",
          md: "65px",
          lg: "67px",
          xl: "70px",
        },
        mb: 1,
        mt: 1,
        background: `linear-gradient(${palette[12]}, ${palette[11]})`,
        textShadow: `0 0 40px ${palette[9]}`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        userSelect: "none",
        overflow: "visible",
        textOverflow: "ellipsis",
        lineHeight: "1",
        whiteSpace: "nowrap",
        display: "inline-flex",
        borderRadius: 4,
      }}
      variant="h4"
    >
      Good {greeting}.
    </Typography>
  );
};
