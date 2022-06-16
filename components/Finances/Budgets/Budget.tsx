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
    borderRadius: {sm: 5},
    ...open && {
        width: {
            xs: "calc(100% + 46px)",
            sm: "auto"
        },
        ml: {xs: "-23px", sm: 0},
        background: (global.theme === "dark" ? "hsl(240, 11%, 20%)": "rgba(200,200,200,.2)"),
    } }}>
      <ListItemText
      sx={{ pr: {}}}
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
        secondary={open && (
                <Box sx={{maxWidth:"calc(100vw - 105px)",whiteSpace:"nowrap",overflowX:"auto", ml: 0, pr:2, mr:-13, mt:3}}>
                {[...new Array(5)].map(() => (
                    <Skeleton width={200} variant="rectangular" height={100} animation="wave" sx={{borderRadius:5,display:"inline-block",mr:1}}/>
                ))}
                </Box>
            )}
      />
      <ListItemIcon sx={{ml:2,mr:-2,position:"absolute",top:19,right:4}}>
        {
            open && (
                <IconButton onClick={() => setOpen(!open)} edge="end" aria-label="next" sx={{
                    transition:"none!important", 
                    ml: -6,
                    mr: 1
                    }}>
                <span className="material-symbols-rounded">delete</span>
                </IconButton>
            )
        }
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
