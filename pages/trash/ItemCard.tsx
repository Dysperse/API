import * as React from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import ItemPopup from "../ItemPopup";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";

export function ItemCard({ item }: any) {
  return (
    <Card>
      <ItemPopup data={item}>
        <CardActionArea>
          <CardContent>
            <Typography>{item.title}</Typography>
            <Typography sx={{ opacity: 0.7 }}>{item.amount}</Typography>
          </CardContent>
        </CardActionArea>
      </ItemPopup>

      <CardActions>
        <Button size="small">Restore</Button>
        <Button size="small">Delete</Button>
      </CardActions>
    </Card>
  );
}
