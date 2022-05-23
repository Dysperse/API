import { useState } from "react";
import CommandPalette from "react-command-palette";

function atomCommand(suggestion: any) {
  const { name, highlight, shortcut } = suggestion;
  return (
    <div className="atom-item">
      <span>{name}</span>
      {shortcut && <kbd className="atom-shortcut">{shortcut}</kbd>}
    </div>
  );
}

export function SearchPopup({ content }: any) {
  const [commands, setCommands] = useState([
    {
      name: "Dashboard",
      command() {},
    },
    {
      command: () => {},
      name: "Finances",
    },
    {
      command: () => {},
      name: "Meals",
    },
    {
      command: () => {},
      name: "Settings",
    },
    {
      command: () => {},
      name: "Notifications ",
    },
    {
      command: () => {},
      name: "Trash",
    },
    {
      command: () => {},
      name: "Starred",
    },
    {
      command: () => {},
      name: "Home maintenance",
    },
    {
      command: () => {},
      name: "Create list",
    },
    {
      command: () => {},
      name: "Kitchen",
      shortcut: "Rooms",
    },
    {
      command: () => {},
      name: "Bedroom",
      shortcut: "Rooms",
    },
    {
      command: () => {},
      name: "Bathroom",
      shortcut: "Rooms",
    },
    {
      command: () => {},
      name: "Garage",
      shortcut: "Rooms",
    },
    {
      command: () => {},
      name: "Living room",
      shortcut: "Rooms",
    },
    {
      command: () => {},
      name: "Dining room",
      shortcut: "Rooms",
    },
    {
      command: () => {},
      name: "Laundry room",
      shortcut: "Rooms",
    },
    {
      command: () => {},
      name: "Storage room",
      shortcut: "Rooms",
    },
    {
      command: () => {},
      name: "Garden",
      shortcut: "Rooms",
    },
    {
      command: () => {},
      name: "Camping",
      shortcut: "Rooms",
    },
    {
      command: () => {},
      name: "Appearance",
      shortcut: "Settings",
    },
    {
      command: () => {},
      name: "Finances",
      shortcut: "Settings",
    },
    {
      command: () => {},
      name: "Account",
      shortcut: "Settings",
    },
    {
      command: () => {},
      name: "Third-party apps",
      shortcut: "Settings",
    },
    {
      command: () => {},
      name: "Notifications",
      shortcut: "Settings",
    },
    {
      command: () => {},
      name: "Developer",
      shortcut: "Settings",
    },
    {
      command: () => {},
      name: "App",
      shortcut: "Settings",
    },
    {
      command: () => {},
      name: "Sessions",
      shortcut: "Settings",
    },
    {
      command: () => {},
      name: "Rooms",
      shortcut: "Settings",
    },
    {
      command: () => {},
      name: "Sync",
      shortcut: "Settings",
    },
    {
      command: () => {},
      name: "Finance plan",
      shortcut: "Settings > Finances",
    },
    {
      command: () => {},
      name: "Sign out",
      shortcut: "Settings",
    },
    {
      command: () => {},
      name: "Legals",
      shortcut: "Settings",
    },
  ]);
  // fetch("https://api.smartlist.tech/v2/rooms/", {
  //   method: "POST",
  //   body: new URLSearchParams({
  //     token: global.session.accessToken
  //   })
  // })
  //   .then((res) => res.json())
  //   .then((res) => {
  //     setCommands([
  //       ...commands,
  //       ...res.data.map((room) => {
  //         return {
  //           command: () => {},
  //           name: room.name,
  //           shortcut: "Rooms"
  //         };
  //       })
  //     ]);
  //   });
  return (
    <CommandPalette
      placeholder="Jump to"
      trigger={content}
      renderCommand={atomCommand}
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
            width: "100%",
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
                padding: "2px 4px",
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
                padding: "2px 4px",
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
                padding: "2px 4px",
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
        threshold: -Infinity,
      }}
      reactModalParentSelector="body"
      hotKeys="/"
      commands={commands}
    />
  );
}
