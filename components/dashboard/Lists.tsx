import { ListItems } from "./ListItems";
import useSWR from "swr";
import Box from "@mui/material/Box";
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";

function Render({ data }: any) {
  const [lists, setLists] = React.useState<any>(data.lists);

  return (
    <>
      {lists.map((list) => (
        <ListItems
          data={data.items.filter(
            (item) => item.parent.toString() === list.id.toString()
          )}
          key={list.id}
          emptyText="You haven't added any items to this list yet."
          emptyImage="https://ouch-cdn2.icons8.com/Gmb2VDsK_0vYJN8H8Q_-pj5cJEKjFQY6buBtji7rJGo/rs:fit:256:171/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMzkz/L2E5OTFhYjE3LTNh/MDktNGM2My1iNjhi/LTk1ZDA1NmRhYzNk/MS5zdmc.png"
          title={list.title}
          description={list.description}
          parent={parseInt(list.id)}
        />
      ))}
      <Card
        sx={{
          borderRadius: 5,
          background:
            global.theme == "dark"
              ? "hsl(240, 11%, 13%)"
              : "rgba(200,200,200,.1)",
        }}
      >
        <CardActionArea>
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              py: 3,
              px: 3.5,
              fontWeight: "600",
            }}
          >
            <span className="material-symbols-outlined">add_circle</span>Create
            list
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}

export function Lists() {
  const url =
    "/api/lists/items?" +
    new URLSearchParams({
      propertyToken: global.session.property.propertyToken,
      accessToken: global.session.property.accessToken,
    });

  const { data, error }: any = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );
  return <>{data ? <Render data={data} /> : <Box>Loading...</Box>}</>;
}
