import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
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
    <ListItem sx={{ px: 1,pr:0, 
        borderRadius:5,    
    ...open && {
        background: global.theme === "dark" ? "hsl(240, 11%, 20%)": "rgba(200,200,200,.2)",
        p: 2,
        py: 1,
    } }}>
      <ListItemText
      sx={{pr:8}}
        primary={
          <>
            <Typography variant="body2" sx={{ float: "right" }}>
              50 / ${amount}
            </Typography>
            <Typography>{category}</Typography>
            <LinearProgress
              variant="determinate"
              value={(50 / parseInt(amount)) * 100}
              sx={{ width: "100%", borderRadius: "4px", my: 1, height: 10,
                  position:"relative",
              
              ...open && {
                  ml: 3,
                  mt: -3,
                  transform: "scale(.4) translateY(-30px)"
              } }}
            />
            
          </>
        }
        secondary={open && (
                <>
                {...new Array(20).map(() => (
                    <>
                    </>
                ))}
                </>
            )}
      />
      <ListItemIcon sx={{ml:2,mr:-2,position:"absolute",top:19,right:4}}>
        <IconButton onClick={() => setOpen(!open)} edge="end" aria-label="next" sx={{
            transition:"none!important", 
            ...open && {
            transform: "rotate(180deg)"
        }}}>
          <span className="material-symbols-rounded">expand_more</span>
        </IconButton>
      </ListItemIcon>
    </ListItem>
  );
}
