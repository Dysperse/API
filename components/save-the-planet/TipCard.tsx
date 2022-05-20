import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import { green } from "@mui/material/colors";
export function TipCard({
  name,
  funFact,
  tipOfTheDay = false,
  icon = "lightbulb"
}: {
  name: string;
  funFact: string;
  tipOfTheDay: boolean;
  icon: string;
}) {
  return (
    <Tab
      icon={
        <>
          {tipOfTheDay && (
            <div
              style={{
                fontSize: "13px",
                display: "inline-flex",
                alignItems: "center",
                position: "absolute",
                top: "15px",
                right: "15px",
                justifyContent: "center",
                gap: "10px",
                background: green["A700"],
                color: "white",
                borderRadius: "99px",
                fontWeight: "500",
                padding: "3px 10px"
              }}
            >
              <span
                className="material-symbols-rounded"
                style={{ fontSize: "14px", color: "white" }}
              >
                tips_and_updates
              </span>{" "}
              Tip of the day
            </div>
          )}
          <Typography sx={{ float: "left", fontWeight: "800" }} variant="h6">
            <span
              className="material-symbols-rounded"
              style={{
                fontSize: "28px",
                display: "block",
                marginTop: "10px",
                marginBottom: "10px"
              }}
            >
              {icon}
            </span>
            {name}
          </Typography>
        </>
      }
      label={
        <Typography
          variant="body2"
          sx={{
            fontSize: "12px",
            fontWeight: "600"
          }}
        >
          {funFact}
        </Typography>
      }
      disableRipple
      sx={{
        mr: 1,
        px: 3,
        py: 1,
        pb: 2,
        textAlign: "left!important",
        alignItems: "start",
        width: "90vw",
        opacity: 1,
        "& *": {
          opacity: 1,
          color: "#303030"
        },
        background: tipOfTheDay ? green["A100"] : "rgba(200,200,200,.3)",
        transition: "color .2s",
        "&:active": {
          opacity: 1,
          background: tipOfTheDay ? green["A200"] : "rgba(200,200,200,.5)",
          "& *": {
            opacity: 1,
            color: "#000"
          }
        },
        textTransform: "none",
        borderRadius: 5
      }}
    />
  );
}
