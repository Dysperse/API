import { green, orange } from "@mui/material/colors";

export function Badge({ tipOfTheDay, highlySuggested }: any) {
  return (
    <>
      {tipOfTheDay && (
        <div
          className="badge"
          style={{
            fontSize: "13px",
            display: "inline-flex",
            alignItems: "center",
            position: "absolute",
            top: "15px",
            right: "15px",
            justifyContent: "center",
            gap: "10px",
            background: green["A700"],
            color: "white",
            borderRadius: "99px",
            fontWeight: "500",
            padding: "3px 10px",
          }}
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "14px", color: "white" }}
          >
            tips_and_updates
          </span>{" "}
          Tip of the day
        </div>
      )}
      {highlySuggested && (
        <div
          className="badge"
          style={{
            fontSize: "13px",
            display: "inline-flex",
            alignItems: "center",
            position: "absolute",
            top: "15px",
            right: "15px",
            justifyContent: "center",
            gap: "10px",
            background: orange["A700"],
            color: "white",
            borderRadius: "99px",
            fontWeight: "500",
            padding: "3px 10px",
          }}
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "14px", color: "white" }}
          >
            auto_awesome
          </span>{" "}
          Highly suggested
        </div>
      )}
    </>
  );
}
