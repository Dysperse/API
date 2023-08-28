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
      {filteredNotes.map((note, index) => {
        return (
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
              "& .toolbar": {
                display: "none",
              },
              "&:hover .toolbar": {
                display: "flex",
              },
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
                  color: "#000",
                  fontWeight: "900",
                },
              }}
              defaultValue={note.value}
              onBlur={(e) => updateNoteValue(index, e.target.value)}
            />
            <Box
              className="toolbar"
              sx={{
                display: "flex",
                gap: 1.5,
                px: 2,
                py: 1,
                alignItems: "center",
                background: "rgba(0,0,0,0.1)",
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
        );
      })}
    </>
  );
}
