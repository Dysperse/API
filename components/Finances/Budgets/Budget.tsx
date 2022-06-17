import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useState } from "react"

export function Budget({
  category,
  amount,
  type,
}: {
  category: string,
  amount: string,
  type: "weekly" | "monthly",
}) {
const [open, setOpen] = useState<boolean>(false)
  return (
    <ListItem sx={{ px: 2, mt: 1, pr:0, 
    borderRadius: {sm: 5} }}>
      <ListItemText
        primary={
          <>
            <Typography variant="body2" sx={{ float: "right" }}>
              50 / ${amount}
            </Typography>
            <Typography>{category}</Typography>
            <LinearProgress
              variant="determinate"
              value={(50 / parseInt(amount)) * 100}
              sx={{ width: "100%", borderRadius: "4px", my: 1, height: 10,}}
            />
            
          </>
        }
      />
      <ListItemIcon sx={{ml:2,mr:-2}}>
        <IconButton onClick={() => setOpen(true)} edge="end" aria-label="next">
          <span className="material-symbols-rounded">chevron_right</span>
        </IconButton>
        
      </ListItemIcon>
    </ListItem>
  );
}
