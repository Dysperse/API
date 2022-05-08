import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import * as colors from "@mui/material/colors";

function MenuPlan({ day, selected = false, menu = [] }: any) {
  return (
    <TimelineItem>
      <TimelineOppositeContent color="text.secondary">
        {day}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            ...(selected && {
              background: colors[themeColor][800],
              borderColor: colors[themeColor][800]
            })
          }}
          variant="outlined"
        />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Typography>
          {menu.map((food) => (
            <div>{food}</div>
          ))}
          {menu.length === 0 && (
            <div style={{ opacity: 0.4 }}>Nothing planned for this day</div>
          )}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

export default function Meals() {
  return (
    <Box sx={{ p: 3 }}>
      <Timeline>
        <MenuPlan
          selected
          day="Today"
          menu={["Pancakes", "Burger", "Chicken dinner"]}
        />
        <MenuPlan day="Tomorrow" />
        <MenuPlan day="May 10, 2022" />
        <MenuPlan day="May 11, 2022" />
        <MenuPlan day="May 12, 2022" />
        <MenuPlan day="May 13, 2022" />
        <MenuPlan day="May 14, 2022" />
        <MenuPlan day="May 15, 2022" />
      </Timeline>
    </Box>
  );
}
