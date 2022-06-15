import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import * as colors from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

function Action({icon, primary, secondary}) {
    return (
        <ListItem
        button
        sx={{
          transiton: "none!important",
          "& *": { transiton: "none!important" },
          borderRadius: 4,
          mb: 1,
        }}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              color: global.theme === "dark" ? "#fff" : "#000",
              borderRadius: 4,
              background:
                global.theme === "dark"
                  ? "hsl(240,11%,17%)"
                  : colors[themeColor][100],
            }}
          >
            <span
              style={{ fontSize: "20px" }}
              className="material-symbols-rounded"
            >
              {icon}
            </span>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography sx={{ fontWeight: "400" }}>{primary}</Typography>
          }
          secondary={secondary}
        />
      </ListItem>
    )
}

export function QuickActions() {
    return (
        <Card 
            sx={{
                mt: 4,
                borderRadius: "28px",
                background: global.theme === "dark" ? "hsl(240, 11%, 13%)" : "#eee",
                boxShadow: 0,
                p: 1
            }}
        >
            <CardContent sx={{"& *": {transition:"none"}}}>
                <Action primary="Review expenses" secondary={null} icon="payments"/>
                <Action primary="Report" secondary={null} icon="summarize"/>
                <Action primary="Liabilities" secondary={null} icon="savings"/>
                <Action primary="Options" secondary={null} icon="more_horiz"/>
            </CardContent>
        </Card>
    )
}