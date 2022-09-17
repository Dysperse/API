import Box from "@mui/material/Box";
import { colors } from "../../lib/colors";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Command } from "cmdk";
import React from "react";
import ReactDOMServer from "react-dom/server";
import useSWR from "swr";
import { Puller } from "../Puller";
import { useRouter } from "next/router";
import { updateSettings } from "../Settings/updateSettings";

/**
 * @param children Children to render
 * @returns void
 */
function Item({
  children,
  shortcut,
  onSelect = () => {},
}: {
  children: React.ReactNode;
  shortcut?: string;
  onSelect?: (value: string) => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      value={ReactDOMServer.renderToStaticMarkup(children)}
    >
      {children}
      {shortcut && (
        <div className="cmdk-vercel-shortcuts">
          {shortcut.split(" ").map((key) => {
            return <kbd key={key}>{key}</kbd>;
          })}
        </div>
      )}
    </Command.Item>
  );
}

export function SearchPopup() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [pages, setPages] = React.useState<string[]>(["home"]);
  const activePage = pages[pages.length - 1];
  const isHome = activePage === "home";
  const router = useRouter();

  /**
   * @param href Link
   * @returns void
   */
  const onLink = (href: string): void => {
    router.push(href);
    setOpen(false);
  };

  React.useEffect(() => {
    /**
     * @param e Event passed by the browser
     * @returns void
     */
    const down = (e) => {
      if (
        (e.key === "k" && e.ctrlKey) ||
        (e.key === "k" && e.metaKey) ||
        (e.key === "f" && e.ctrlKey) ||
        (e.key === "f" && e.metaKey) ||
        (e.key === "/" && e.metaKey) ||
        (e.key === "/" && e.ctrlKey)
      ) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const popPage = React.useCallback(() => {
    setPages((pages) => {
      const x = [...pages];
      x.splice(-1, 1);
      return x;
    });
  }, []);

  function bounce() {
    if (ref.current) {
      ref.current.style.transform = "scale(0.96)";
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = "";
          setInputValue("");
        }
      }, 100);
    }
  }

  return (
    <Box
      sx={{
        ...(global.theme === "dark" && {
          "& *": {
            color: "#fff!important",
          },
        }),
      }}
    >
      <Tooltip title="Jump to">
        <IconButton
          onClick={() => {
            setOpen(true);
          }}
          color="inherit"
          disableRipple
          sx={{
            borderRadius: 3,
            mr: 1,
            transition: "none",
            color: global.theme === "dark" ? "hsl(240, 11%, 90%)" : "#606060",
            "&:hover": {
              background: "rgba(200,200,200,.3)",
              color: global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
            },
            "&:focus-within": {
              background:
                (global.theme === "dark"
                  ? colors[themeColor]["900"]
                  : colors[themeColor]["50"]) + "!important",
              color: global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
            },
          }}
        >
          <span className="material-symbols-outlined">search</span>
        </IconButton>
      </Tooltip>
      <SwipeableDrawer
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onOpen={() => {}}
        disableSwipeToOpen
        anchor="bottom"
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: "650px",
            maxHeight: "95vh",
            borderRadius: "30px 30px 0 0",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
      >
        <Puller />
        <div className="vercel">
          <Command
            ref={ref}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter") {
                bounce();
              }

              if (isHome || inputValue.length) {
                return;
              }

              if (e.key === "Backspace") {
                e.preventDefault();
                popPage();
                bounce();
              }
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              {pages
                .filter((p) => p.toLowerCase() !== "home")
                .map((p) => (
                  <div className="cmdk-vercel-badge" key={p}>
                    {p}
                  </div>
                ))}
            </div>
            <Command.Input
              autoFocus
              placeholder="What do you need?"
              value={inputValue}
              onValueChange={(value) => {
                setInputValue(value);
              }}
            />
            <Command.List>
              <Command.Empty
                style={{
                  height: "auto",
                }}
              >
                <Box
                  sx={{
                    p: 0,
                    background: "rgba(0,0,0,0.1)",
                    width: "100%",
                    borderRadius: 4,
                    my: 3,
                    textAlign: "center",
                  }}
                >
                  <picture>
                    <img
                      src="https://ouch-cdn2.icons8.com/fHRe88-d9LBnpryw16-EHoo5JpQnusQ3FKQS6pZ2MXQ/rs:fit:256:256/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMzUv/NTliOGVkOGItMjFj/YS00YmFjLWI4YjIt/MDE2YTg3NDk4ODYy/LnN2Zw.png"
                      alt="No results found"
                    />
                  </picture>
                  <Typography variant="h6" sx={{ mt: -5, mb: 4 }}>
                    No results found.
                  </Typography>
                </Box>
              </Command.Empty>
              {activePage === "home" && (
                <Home
                  onLink={onLink}
                  searchSettings={() => {
                    setPages([...pages, "Settings"]);
                    setInputValue("");
                  }}
                />
              )}
              {activePage === "Settings" && <Settings />}
            </Command.List>
          </Command>
        </div>
      </SwipeableDrawer>
    </Box>
  );
}

function Icon({ icon }: { icon: string }) {
  return (
    <span className="material-symbols-outlined" style={{ marginRight: "5px" }}>
      {icon}
    </span>
  );
}

function Home({
  onLink,
  searchSettings,
}: {
  onLink: (href: string) => any;
  searchSettings: () => void;
}) {
  const { data } = useSWR("/api/rooms", () =>
    fetch(
      "/api/property/rooms?" +
        new URLSearchParams({
          property: global.property.propertyId,
          accessToken: global.property.accessToken,
        })
    ).then((res) => res.json())
  );

  return (
    <>
      <LinearProgress
        variant={data ? "determinate" : "indeterminate"}
        sx={{
          mb: 2,
          mt: 0,
          height: 2,
          position: "sticky",
          top: 0,
          zIndex: 9999,
          borderRadius: 5,
          ...(data && {
            opacity: 0.3,
            backdropFilter: "blur(10px)",
          }),
        }}
      />{" "}
      <Item
        shortcut="CTRL ,"
        onSelect={() => {
          searchSettings();
        }}
      >
        Search Settings...
        <SettingsIcon />
      </Item>
      <Item
        shortcut="CTRL ,"
        onSelect={() => {
          global.setTheme("light");
          updateSettings("darkMode", "false");
        }}
      >
        Light mode
        <Icon icon="light_mode" />
      </Item>
      <Item
        shortcut="CTRL ,"
        onSelect={() => {
          global.setTheme("dark");
          updateSettings("darkMode", "true");
        }}
      >
        Dark mode
        <Icon icon="dark_mode" />
      </Item>
      <Item onSelect={() => onLink("/dashboard")}>
        Dashboard
        <Icon icon="layers" />
      </Item>
      <Item onSelect={() => onLink("/notes")}>
        Notes
        <Icon icon="sticky_note_2" />
      </Item>
      <Command.Group heading="Rooms">
        {[
          { name: "Kitchen", icon: "oven_gen" },
          { name: "Bedroom", icon: "bedroom_parent" },
          { name: "Bathroom", icon: "bathroom" },
          { name: "Garage", icon: "garage" },
          { name: "Dining room", icon: "local_dining" },
          { name: "Living room", icon: "living" },
          { name: "Laundry room", icon: "local_laundry_service" },
          { name: "Storage room", icon: "inventory_2" },
          { name: "Garden", icon: "yard" },
        ].map((room, index) => (
          <Item
            onSelect={() => onLink("/rooms/" + room.name.toLowerCase())}
            key={index.toString()}
          >
            {room.name}
            <Icon icon={room.icon} />
          </Item>
        ))}
        {data && (
          <Box>
            {data.map((room, index) => (
              <Item key={room.name.toLowerCase()}>
                {room.name}
                <Icon icon="label" />
              </Item>
            ))}
          </Box>
        )}
        <Item onSelect={() => onLink("/starred-items")}>
          Starred items
          <Icon icon="star" />
        </Item>
        <Item onSelect={() => onLink("/trash")}>
          Trash
          <Icon icon="delete" />
        </Item>
        <Item
          onSelect={() =>
            document.getElementById("setCreateRoomModalOpen")?.click()
          }
        >
          Create room
          <Icon icon="add" />
        </Item>
      </Command.Group>
      <Command.Group heading="Help">
        <Item onSelect={() => onLink("mailto:hello@smartlist.tech")}>
          Support (email)
          <Icon icon="help" />
        </Item>
      </Command.Group>
    </>
  );
}

function Settings() {
  return (
    <>
      {["Appearance", "Two-factor auth", "Account", "Sign out", "Legal"].map(
        (room, index) => (
          <Item key={index.toString()}>{room}</Item>
        )
      )}
    </>
  );
}

/**
 * Settings icon for search popup
 */
function SettingsIcon(): JSX.Element {
  return (
    <span className="material-symbols-outlined" style={{ marginRight: "5px" }}>
      settings
    </span>
  );
}
