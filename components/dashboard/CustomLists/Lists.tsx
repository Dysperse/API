import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useState } from "react";
import useSWR from "swr";
import { CreateListCard } from "./CreateListCard";
import { List } from "./List";
import SwipeableViews from "react-swipeable-views";

export const stopPropagationForTab = (event: any) => {
  if (event.key !== "Esc") {
    event.stopPropagation();
  }
};

function RenderLists({ mobile, data }: any) {
  const [lists, setLists] = useState(data);
  return (
    <>
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        {lists.map((list: any, index: number) => (
          <List
            setLists={setLists}
            lists={lists}
            key={index.toString()}
            mobile={mobile}
            title={list.title}
            description={list.description}
            id={list.id}
          />
        ))}
      </Box>
      <Box sx={{ display: { sm: "none" } }}>
        <SwipeableViews
          resistance
          style={{
            maxWidth: "calc(100vw - 32.5px)",
            padding: "0 30px",
            paddingLeft: 0,
          }}
          slideStyle={{
            padding: "0px",
          }}
        >
          {lists.map((list: any, index: number) => (
            <List
              setLists={setLists}
              lists={lists}
              key={index.toString()}
              mobile={mobile}
              title={list.title}
              description={list.description}
              id={list.id}
            />
          ))}
          {lists.length < 5 && (
            <CreateListCard mobile={mobile} setLists={setLists} lists={lists} />
          )}
        </SwipeableViews>
      </Box>
    </>
  );
}

export function Lists({ mobile = false }: { mobile?: boolean }) {
  const url =
    "/api/lists/fetch-custom-lists?" +
    new URLSearchParams({
      propertyToken: global.session.property.propertyToken,
      accessToken: global.session.property.accessToken,
    });

  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );
  if (error) return <div>An error has occured, please try again later</div>;
  if (!data)
    return (
      <>
        {[...new Array(5)].map(() => (
          <Skeleton
            key={Math.random().toExponential()}
            variant="rectangular"
            height={110}
            animation="wave"
            sx={{ mb: 2, borderRadius: "28px" }}
          />
        ))}
      </>
    );

  return <RenderLists data={data.data} mobile={mobile} />;
}
