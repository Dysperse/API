import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { useState } from "react"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import { Puller } from "../../Puller"

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
  return (<>
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
        <IconButton onClick={() => setOpen(true)} edge="end" aria-label="next" sx={{ borderRadius: 4, "&, & *": {transition: "none!important"} }}>
          <span className="material-symbols-rounded">chevron_right</span>
        </IconButton>
        
      </ListItemIcon>
    </ListItem>
     <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        onOpen={() => setOpen(true)}
        open={open}
        sx={{
          display: "flex",
          alignItems: { xs: "end", sm: "center" },
          height: "100vh",
          justifyContent: "center"
        }}
        PaperProps={{
          sx: {
            borderRadius: "28px",
            borderBottomLeftRadius: { xs: 0, sm: "28px!important" },
            borderBottomRightRadius: { xs: 0, sm: "28px!important" },
            position: "unset",
            mx: "auto",
            ...global.theme==="dark" && {
                background: "hsl(240, 11%, 17%)"
            },
            maxWidth: { sm: "70vw", xs: "100vw" },
            overflow: "hidden"
          }
        }}
        onClose={() => setOpen(false)}
      >
          <Box sx={{ p: 1, display: {sm: "none"} }}>
           <Puller />
          </Box>
          <Box sx={{p:4}}>
            <Typography variant="h4" gutterBottom sx={{fontWeight:"800"}}>{category}</Typography>
            <Typography variant="h5" sx={{mb:2}}>
              50 / ${amount}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(50 / parseInt(amount)) * 100}
              sx={{ width: "100%", borderRadius: "4px", my: 1, height: 10,}}
            />
            <Typography variant="body2" sx={{mt:3}}>
              Expenses on this budget in the past month
            </Typography>
            <Box sx={{whiteSpace:"nowrap", overflowX:"scroll",mt: 2, px: 1 }}>
                {
                    [...new Array(10)].map(() => (
                        <Skeleton variant="rectangular" height={100} width={150} sx={{mr:1,display: "inline-block",borderRadius:5}} animation="wave" />
                    ))
                }
            </Box>
            <Button variant="outlined" sx={{borderWidth:"2px!important", "&, & *": {transition:"none",animationDuration: "0s!important"},mt:2,float:"right",borderRadius:5}} size="large">Delete</Button>
        </Box>
          </SwipeableDrawer>
    </>
  );
}
