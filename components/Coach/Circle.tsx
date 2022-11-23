import Box from "@mui/material/Box";

export function Circle({ number, year }) {
  const currentMonth = new Date().getMonth();
  return (
    <Box
      sx={{
        width: "7px",
        height: "7px",
        flex: "0 0 auto",
        borderRadius: "50%",
        backgroundColor:
          year === new Date().getFullYear() && currentMonth >= number
            ? number <= currentMonth
              ? "#000"
              : "#aaa"
            : "#aaa",
      }}
    />
  );
}
