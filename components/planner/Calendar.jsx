import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useRef } from "react";
import Box from "@mui/material/Box";

const Calendar = () => {
  const calendarRef = useRef(null);
  return (
    <Box sx={{ py: 5 }}>
      <FullCalendar
        innerRef={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        editable
        initialView="dayGridWeek"
        selectable
        height="500px"
      />
    </Box>
  );
};

export default Calendar;
