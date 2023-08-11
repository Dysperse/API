import { Box, Icon, IconButton, TextField } from "@mui/material";
import { cloneElement, useState } from "react";

interface Note {
  value: string;
  color: "#feff9c" | "#ff65a3" | "#7afcff" | "#fff740";
  deleted: boolean;
}

export function Notes({ children }) {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = () => {
    setNotes((n) => [...n, { value: "", color: "#feff9c", deleted: false }]);
  };

  const updateNoteValue = (index, value) => {
    const updatedNotes = [...notes];
    updatedNotes[index].value = value;
    setNotes(updatedNotes);
  };

  const updateNoteColor = (index, color) => {
    const updatedNotes = [...notes];
    updatedNotes[index].color = color;
    setNotes(updatedNotes);
  };

  const deleteNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes[index].deleted = true;
    setNotes(updatedNotes);
  };

  const filteredNotes = notes.filter((note) => !note.deleted);

  return (
    <>
      {cloneElement(children, { onClick: addNote })}
      {filteredNotes.map((note, index) => (
        <Box
          key={index}
          className="drag-widget"
          sx={{
            position: "fixed",
            top: 20,
            width: 200,
            borderRadius: 5,
            left: 0,
            background: note.color,
          }}
        >
          <TextField
            placeholder="Add note..."
            multiline
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                p: 2,
                pb: 1,
                pt: 3,
                color: "#000",
                fontWeight: "900",
              },
            }}
            defaultValue={note.value}
            onBlur={(e) => updateNoteValue(index, e.target.value)}
          />
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              px: 2,
              pb: 2,
              alignItems: "center",
            }}
          >
            {["#feff9c", "#ff65a3", "#7afcff", "#fff740"].map((color) => (
              <Box
                key={color}
                onClick={() => updateNoteColor(index, color as Note["color"])}
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
            <IconButton
              sx={{ ml: "auto", color: "#000!important" }}
              onClick={() => deleteNote(index)}
            >
              <Icon>delete</Icon>
            </IconButton>
          </Box>
        </Box>
      ))}
    </>
  );
}
