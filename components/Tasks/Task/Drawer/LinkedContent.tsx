import {
  Box,
  Icon,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React from "react";

export const LinkedContent = React.memo(function LinkedContent({
  data,
  styles,
}: any) {
  const router = useRouter();

  return (
    <Box sx={styles.section}>
      {data.id.includes("-event-assignment") && (
        <ListItem className="item" sx={{ gap: 1.5 }}>
          <Box
            sx={{
              background: "linear-gradient(45deg, #ff0f7b, #f89b29)!important",
              color: "#000!important",
              width: 13,
              height: 13,
              borderRadius: 999,
            }}
          />
          <ListItemText primary={`Imported from Canvas LMS`} />
        </ListItem>
      )}
      <ListItem className="item">
        <ListItemText
          primary={`Edited  ${dayjs(data.lastUpdated).fromNow()}`}
          sx={{ fontStyle: "italic" }}
        />
      </ListItem>
      <ListItemButton
        className="item"
        onClick={() => router.push(`/groups/${data.property.id}`)}
      >
        <ListItemText
          primary={
            !(data?.column?.board?.public === false)
              ? data.property.name
              : "Only visible to you"
          }
          secondary={
            !(data?.column?.board?.public === false)
              ? "Visible to group"
              : `Not visible to others in "${data.property.name}"`
          }
        />
        <Icon sx={{ ml: "auto" }} className="outlined">
          {!(data?.column?.board?.public === false) ? "group" : "lock"}
        </Icon>
      </ListItemButton>
      {data.column && (
        <ListItemButton
          className="item"
          onClick={() => router.push(`/tasks/boards/${data.column.board.id}`)}
        >
          <ListItemText
            secondary={data.column.name}
            primary={`Found in "${data.column.board.name}"`}
          />
          <Icon sx={{ ml: "auto" }} className="outlined">
            view_kanban
          </Icon>
        </ListItemButton>
      )}
    </Box>
  );
});
