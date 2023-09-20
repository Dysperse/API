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
    if (time < 12) return "Good morning";
    else if (time < 17) return "Good afternoon";
    else if (time < 20) return "Good evening";
    else return "Good night";
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
      {...(isMobile
        ? {
            onTouchStart: open,
            onTouchEnd: close,
          }
        : {
            onMouseEnter: open,
            onMouseLeave: close,
          })}
      sx={{
        fontSize: {
          xs: "15vw",
          sm: "80px",
        },
        background: `linear-gradient(${palette[11]}, ${palette[5]})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        userSelect: "none",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        display: "inline-flex",
        border: `2px solid transparent`,
        borderRadius: 4,
        px: { sm: 2 },
        "&:hover": {
          border: { sm: `2px solid ${palette[3]}` },
        },
      }}
      variant="h4"
    >
      {isHover ? currentTime : greeting}
    </Typography>
  );
};
