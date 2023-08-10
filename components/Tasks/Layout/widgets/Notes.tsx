import { Box, TextField } from "@mui/material";
import { cloneElement, useState } from "react";

interface Note {
  value: string;
  color: "#feff9c" | "#ff65a3" | "#7afcff" | "#fff740";
}

export function Notes({ children }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const trigger = cloneElement(children, {
    onClick: () => setNotes((n) => [...n, { value: "", color: "#feff9c" }]),
  });

  return (
    <>
      {trigger}
      {notes.map((note, index) => (
        <Box
          key={index}
          className="drag-widget"
          sx={{
            position: "fixed",
            top: 20,
            width: 200,
            borderRadius: 5,
            right: 0,
            background: note.color,
          }}
        >
          <TextField
            multiline
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                p: 2,
                color: "#000",
                fontWeight: "900",
              },
            }}
            defaultValue={note.value}
            onBlur={(e) => {
              let x = notes;
              x[index].value = e.target.value;
              setNotes(x);
            }}
          />
          <Box sx={{ display: "flex", gap: 1.5, px: 2, pb: 2 }}>
            {["#feff9c", "#ff65a3", "#7afcff", "#fff740"].map((color) => (
              <Box
                key={color}
                onClick={() => {
                  let x = notes;
                  x[index].color = color as Note["color"];
                  setNotes(x);
                }}
                sx={{
                  width: 20,
                  height: 20,
                  background: color,
                  cursor: "pointer",
                  filter: "brightness(80%)",
                  borderRadius: 99,
                }}
              />
            ))}
          </Box>
        </Box>
      ))}
    </>
  );
}
