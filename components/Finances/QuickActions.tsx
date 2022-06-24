import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import * as colors from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Chip from "@mui/material/Chip";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ReviewExpenses from "./ReviewExpenses/index";

function Action({ icon, primary, secondary, onClick = () => {} }: any) {
  return (
    <ListItem
      button
      onClick={onClick}
      sx={{
        transiton: "none!important",
        borderRadius: 4,
        ...(theme === "dark" && {
          "&:hover .avatar": {
            background: "hsl(240,11%,27%)",
          },
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar
          className="avatar"
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
        primary={<Typography sx={{ fontWeight: "400" }}>{primary}</Typography>}
        secondary={secondary}
      />
    </ListItem>
  );
}

export function QuickActions({ transactions }: any) {
  return (
    <Card
      sx={{
        mt: 2,
        borderRadius: "28px",
        background: global.theme === "dark" ? "hsl(240, 11%, 13%)" : "#eee",
        boxShadow: 0,
        p: 1,
      }}
    >
      <CardContent sx={{ "& *": { transition: "none!important" } }}>
        <ReviewExpenses transactions={transactions}>
          <Action
            primary="Review expenses"
            secondary={
              <Chip
                label="NEW"
                sx={{
                  fontSize: "10px",
                  py: 0.4,
                  px: 1,
                  height: "auto",
                  background: colors["red"][900],
                  color: "#fff",
                }}
              />
            }
            icon="payments"
          />
        </ReviewExpenses>
        <Action primary="Report" secondary={null} icon="summarize" />
        <Action primary="Liabilities" secondary={null} icon="savings" />
        <Action
          onClick={() =>
            document.getElementById("financeSettingsTrigger")!.click()
          }
          primary="Options"
          secondary={null}
          icon="more_horiz"
        />
      </CardContent>
    </Card>
  );
}
