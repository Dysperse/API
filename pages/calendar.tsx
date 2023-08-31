import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";

export default function DemoApp() {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, listPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        end: "dayGridYear listDay dayGridMonth dayGridWeek next prev",
      }}
      height="100dvh"
    />
  );
}
