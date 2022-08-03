import Skeleton from "@mui/material/Skeleton";
import { useState } from "react";
import useSWR from "swr";
import { CreateListCard } from "./CreateListCard";
import { List } from "./List";

export const stopPropagationForTab = (event: any) => {
  if (event.key !== "Esc") {
    event.stopPropagation();
  }
};

function RenderLists({ data }: any) {
  const [lists, setLists] = useState(data);
  return (
    <>
      {lists.map((list: any) => (
        <List
          setLists={setLists}
          lists={lists}
          key={Math.random().toString()}
          title={list.title}
          description={list.description}
          id={list.id}
        />
      ))}
      {lists.length < 5 && <CreateListCard setLists={setLists} lists={lists} />}
    </>
  );
}

export function Lists() {
  const url =
    "/api/lists/fetch-custom-lists?" +
    new URLSearchParams({
      token:
        global.session &&
        (global.session.account.SyncToken ||
          global.session.property.accessToken),
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

  return <RenderLists data={data.data} />;
}
