import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import * as colors from "@mui/material/colors";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
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
            primary={
              <>
                Review expenses
                <Chip
                  label=""
                  sx={{
                    ml: 2,
                    mt: "-2px",
                    width: "10px",
                    height: "10px",
                    background: colors["red"][900],
                    color: "#fff",
                  }}
                />
              </>
            }
            icon="payments"
          />
        </ReviewExpenses>
        <Action primary="Report" secondary={"Coming soon"} icon="summarize" />
        <Action
          primary="Liabilities"
          secondary={"Coming soon"}
          icon="local_mall"
        />
        <Action primary="Lessons" secondary={"Coming soon"} icon="school" />
        <Action
          onClick={() =>
            document.getElementById("financeSettingsTrigger")!.click()
          }
          primary="Options"
          secondary={"Action required"}
          icon="more_horiz"
        />
      </CardContent>
    </Card>
  );
}
