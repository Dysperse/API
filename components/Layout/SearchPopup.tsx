import { useRouter } from "next/router";
import React, { useState } from "react";
import CommandPalette from "react-command-palette";
import { useHotkeys } from "react-hotkeys-hook";

function atomCommand(suggestion: any) {
  const { name, shortcut } = suggestion;
  return (
    <div className="atom-item">
      <span>{name}</span>
      {shortcut && <kbd className="atom-shortcut">{shortcut}</kbd>}
    </div>
  );
}

export function SearchPopup({ content }: any) {
  const router = useRouter();
  const [ready, setReady] = useState<boolean>(false);
  useHotkeys("ctrl+/", (e) => {
    e.preventDefault();
    document.getElementById("searchTrigger1")!.click();
  });
  useHotkeys("ctrl+k", (e) => {
    e.preventDefault();
    document.getElementById("searchTrigger1")!.click();
  });
  useHotkeys("ctrl+f", (e) => {
    e.preventDefault();
    document.getElementById("searchTrigger1")!.click();
  });

  const [commands, setCommands] = useState([
    {
      name: "Dashboard",
      command: () => router.push("/dashboard"),
    },
    {
      command: () => router.push("/finances"),
      name: "Finances",
    },
    {
      command: () => router.push("/dashboard"),
      name: "Settings",
    },
    {
      command: () => router.push("/rooms/kitchen"),
      name: "Notifications ",
    },
    {
      command: () => router.push("/trash"),
      name: "Trash",
    },
    {
      command: () => router.push("/dashboard"),
      name: "Starred",
    },
    {
      command: () => router.push("/rooms/kitchen"),
      name: "Kitchen",
      shortcut: "Rooms",
    },
    {
      command: () => router.push("/rooms/bedroom"),
      name: "Bedroom",
      shortcut: "Rooms",
    },
    {
      command: () => router.push("/rooms/bathroom"),
      name: "Bathroom",
      shortcut: "Rooms",
    },
    {
      command: () => router.push("/rooms/garage"),
      name: "Garage",
      shortcut: "Rooms",
    },
    {
      command: () => router.push("/rooms/living-room"),
      name: "Living room",
      shortcut: "Rooms",
    },
    {
      command: () => router.push("/rooms/dining-room"),
      name: "Dining room",
      shortcut: "Rooms",
    },
    {
      command: () => router.push("/rooms/laundry-room"),
      name: "Laundry room",
      shortcut: "Rooms",
    },
    {
      command: () => router.push("/rooms/storage"),
      name: "Storage room",
      shortcut: "Rooms",
    },
    {
      command: () => router.push("/rooms/garden"),
      name: "Garden",
      shortcut: "Rooms",
    },
    {
      command: () => router.push("/rooms/camping"),
      name: "Camping",
      shortcut: "Rooms",
    },
  ]);
  if (!ready) {
    fetch(
      "/api/rooms?" +
        new URLSearchParams({
          propertyToken: global.session.property.propertyToken,
          accessToken: global.session.property.accessToken,
        }),
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setCommands([
          ...commands,
          ...res.data.map((room) => {
            return {
              command: () => router.push("/rooms/" + room.id),
              name: room.name,
              shortcut: "Rooms",
            };
          }),
        ]);
        setReady(true);
      });
  }
  return !ready ? (
    React.cloneElement(content, {
      style: {
        pointerEvents: "none",
        opacity: 0.7,
      },
    })
  ) : (
    <CommandPalette
      closeOnSelect
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
