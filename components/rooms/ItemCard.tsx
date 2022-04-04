import * as React from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ItemPopup from "../../components/ItemPopup";

export function ItemCard({ item }: any) {
  return (
    <ItemPopup data={item}>
      <Card>
        <CardActionArea>
          <CardContent>
            <Typography>{item.title}</Typography>
            <Typography sx={{ opacity: 0.7 }}>{item.amount}</Typography>
            <Stack direction="row" spacing={1}>
              {item.categories.split(",").map((category: string) => {
                if (category.trim() !== "") return <Chip label={category} />;
              })}
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </ItemPopup>
  );
}
