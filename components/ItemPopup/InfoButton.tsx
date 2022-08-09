import MenuItem from "@mui/material/MenuItem";

export function InfoButton({ setOpenInfo }): JSX.Element {
  return (
    <>
      <MenuItem disableRipple onClick={() => setOpenInfo(true)}>
        <span
          style={{ marginRight: "15px" }}
          className="material-symbols-rounded"
        >
          info
        </span>
        View details
      </MenuItem>
    </>
  );
}
