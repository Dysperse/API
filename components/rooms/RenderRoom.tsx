import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { decode } from "js-base64";
import { useRouter } from "next/router";
import { useState } from "react";
import { Toolbar } from "./Toolbar";
import { Header } from "./Header";
import { Suggestions } from "./Suggestions";
import { ItemList } from "./ItemList";

export function RenderRoom({ data, index }: any) {
  const router = useRouter();
  const [items, setItems] = useState(data.data);
  const [updateBanner, setUpdateBanner] = useState(false);
  global.setUpdateBanner = setUpdateBanner;

  return (
    <Container key={index} sx={{ mt: 4 }}>
      <Header
        room={index}
        itemCount={data.data.length}
        useAlias={router.query.custom}
      />
      <Toolbar
        room={router.query.custom ? decode(index).split(",")[0] : index}
        alias={router.query.custom ? decode(index).split(",")[1] : index}
        items={items}
        setItems={setItems}
        data={data.data}
      />
      {updateBanner ===
        (router.query.custom ? decode(index).split(",")[0] : index) && (
        <Box
          sx={{
            background:
              global.theme === "dark"
                ? "hsl(240, 11%, 15%)"
                : "rgba(200,200,200,.4)",
            borderRadius: 5,
            p: 3,
            mb: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography>New items have been added to this room.</Typography>
          <Button
            sx={{ ml: "auto", borderWidth: "2px!important", borderRadius: 4 }}
            variant="outlined"
            onClick={() => {
              setUpdateBanner(false);
              fetch(
                "/api/inventory?" +
                  new URLSearchParams({
                    propertyToken: global.session.property.propertyToken,
                    accessToken: global.session.property.accessToken,
                    room: router.query.custom
                      ? decode(index).split(",")[0]
                      : index,
                  }),
                {
                  method: "POST",
                }
              )
                .then((res) => res.json())
                .then((res) => {
                  setItems([]);
                  setTimeout(() => {
                    setItems(res.data);
                  }, 10);
                });
            }}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;Show&nbsp;changes&nbsp;&nbsp;&nbsp;&nbsp;
          </Button>
        </Box>
      )}
      <ItemList items={items} />
    </Container>
  );
}
