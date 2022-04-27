import CommandPalette from "react-command-palette";
const commands = [
  {
    command: () => {},
    name: "Dashboard"
  },
  {
    command: () => {},
    name: "Finances"
  },
  {
    command: () => {},
    name: "Meals"
  },
  {
    command: () => {},
    name: "Settings"
  },
  {
    command: () => {},
    name: "Notifications"
  },
  {
    command: () => {},
    name: "Trash"
  },
  {
    command: () => {},
    name: "Starred"
  },
  {
    command: () => {},
    name: "Home maintenance"
  },
  {
    command: () => {},
    name: "Create list"
  }
];

export function SearchPopup({ content }: any) {
  return (
    <CommandPalette
      placeholder="Jump to"
      trigger={content}
      header={
        <div
          style={{
            color: "rgb(172, 172, 172)",
            padding: "10px 15px",
            background: "rgba(0,0,0,.4)",
            borderRadius: "15px",
            display: "inline-block",
            fontFamily: "arial",
            fontSize: "12px",
            marginBottom: "6px",
            width: "100%"
          }}
        >
          <span style={{ paddingRight: "32px" }}>Search for a command</span>
          <span style={{ paddingRight: "32px" }}>
            <kbd
              style={{
                backgroundColor: "rgb(23, 23, 23)",
                borderRadius: "4px",
                color: "#b9b9b9",
                fontSize: "12px",
                marginRight: "6px",
                padding: "2px 4px"
              }}
            >
              ↑↓
            </kbd>{" "}
            to navigate
          </span>
          <span style={{ paddingRight: "32px" }}>
            <kbd
              style={{
                backgroundColor: "rgb(23, 23, 23)",
                borderRadius: "4px",
                color: "#b9b9b9",
                fontSize: "12px",
                marginRight: "6px",
                padding: "2px 4px"
              }}
            >
              enter
            </kbd>{" "}
            to select
          </span>
          <span style={{ paddingRight: "32px" }}>
            <kbd
              style={{
                backgroundColor: "rgb(23, 23, 23)",
                borderRadius: "4px",
                color: "#b9b9b9",
                fontSize: "12px",
                marginRight: "6px",
                padding: "2px 4px"
              }}
            >
              esc
            </kbd>{" "}
            to dismiss
          </span>
        </div>
      }
      options={{
        allowTypo: true,
        key: "name",
        keys: ["name"],
        limit: 7,
        scoreFn: null,
        threshold: -Infinity
      }}
      renderCommand={null}
      reactModalParentSelector="body"
      hotKeys="/"
      commands={commands}
    />
  );
}
