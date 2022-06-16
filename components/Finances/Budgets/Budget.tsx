import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";

export function Budget({
  category,
  amount,
  type,
}: {
  category: string,
  amount: number,
  type: "weekly" | "monthly",
}) {
  return (
    <ListItem sx={{ px: 1,pr:0 }}>
      <ListItemText
        primary={
          <>
            <Typography variant="body2" sx={{ float: "right" }}>
              50 / ${amount}
            </Typography>
            <Typography>{category}</Typography>
            <LinearProgress
              variant="determinate"
              value={(50 / amount) * 100}
              sx={{ width: "100%", borderRadius: "4px", my: 1, height: 10 }}
            />
          </>
        }
        secondary={""}
      />
      <ListItemIcon sx={{ml:2,mr:-2}}>
        <IconButton edge="end" aria-label="next" sx={{transition:"none"}}>
          <span className="material-symbols-rounded">chevron_right</span>
        </IconButton>
      </ListItemIcon>
    </ListItem>
  );
}
