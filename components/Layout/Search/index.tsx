import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Command } from "cmdk";
import { useRouter } from "next/router";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { useApi } from "../../../hooks/useApi";
import { colors } from "../../../lib/colors";
import type { ApiResponse } from "../../../types/client";
import { Puller } from "../../Puller";
import { updateSettings } from "../../Settings/updateSettings";
import { neutralizeBack, revivalBack } from "../../../hooks/useBackButton";
import { useStatusBar } from "../../../hooks/useStatusBar";
import hexToRgba from "hex-to-rgba";
/**
 * Icon function
 * @param {any} {icon}:{icon:string}
 * @returns {any}
 */
function Icon({ icon }: { icon: string }) {
  return (
    <span className="material-symbols-outlined" style={{ marginRight: "5px" }}>
      {icon}
    </span>
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

/**
 * @param children Children to render
 * @returns void
 */
function Item({
  children,
  shortcut,
  onSelect = () => null,
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
        <div className="cmdk-carbon-shortcuts">
          {shortcut.split(" ").map((key) => {
            return <kbd key={key}>{key}</kbd>;
          })}
        </div>
      )}
    </Command.Item>
  );
}
/**
 * Settings options
 */
function Settings() {
  return (
    <>
      {["Appearance", "Two-factor auth", "Account", "Sign out", "Legal"].map(
        (room: string) => (
          <Item key={room.toString()}>{room}</Item>
        )
      )}
    </>
  );
}

/**
 * @param onLink Click handler for links
 * @param searchSettings Search settings
 * @returns JSX.Element
 */
function Home({
  onLink,
  searchSettings,
}: {
  onLink: (href: string) => any;
  searchSettings: () => void;
}) {
  const { data }: ApiResponse = useApi("property/rooms");

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
        shortcut="ctrl ,"
        onSelect={() => {
          searchSettings();
        }}
      >
        Search Settings...
        <SettingsIcon />
      </Item>
      <Item
        shortcut="ctrl ,"
        onSelect={() => {
          global.setTheme("light");
          updateSettings("darkMode", "false");
        }}
      >
        Light mode
        <Icon icon="light_mode" />
      </Item>
      <Item
        shortcut="ctrl ,"
        onSelect={() => {
          global.setTheme("dark");
          updateSettings("darkMode", "true");
        }}
      >
        Dark mode
        <Icon icon="dark_mode" />
      </Item>
      <Item onSelect={() => onLink("/home")}>
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
        ].map((room: { name: string; icon: string }) => (
          <Item
            onSelect={() => onLink(`/rooms/${room.name.toLowerCase()}`)}
            key={room.name}
          >
            {room.name}
            <Icon icon={room.icon} />
          </Item>
        ))}
        {data && (
          <Box>
            {data.map((room: { name: string; icon: string; id: number }) => (
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

/**
 * Top-level page component
 */
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
    setOpen(false);
    router.push(href);
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

  /**
   * Function to pop a page
   */
  const popPage = React.useCallback(() => {
    setPages((pages) => {
      const pgs = [...pages];
      pgs.splice(-1, 1);
      return pgs;
    });
  }, []);
  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });
  useStatusBar(open);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disableFocusRipple
        sx={{
          background: global.user.darkMode
            ? "hsl(240,11%,15%)!important"
            : `${colors[themeColor][50]}!important`,
          "&:hover": {
            background: global.user.darkMode
              ? "hsl(240,11%,15%)!important"
              : `${hexToRgba(colors[themeColor][100], 0.5)}!important`,
          },
          transition: "none !important",
          "&:hover, &:active": {
            cursor: "pointer",
          },
          width: "30vw",
          justifyContent: "start",
          "& .MuiTouchRipple-rippleVisible": {
            transitionDuration: ".2s!important",
          },
          px: 2,
          ml: "auto",
          cursor: "text",
          color: global.user.darkMode
            ? "hsl(240,11%,95%)!important"
            : colors[themeColor][900],
          display: { xs: "none", sm: "flex" },
          height: "45px",
          gap: 2,
          borderRadius: 3,
          "&:hover .hover": {
            opacity: 1,
          },
        }}
        className={global.user.darkMode ? "rippleDark" : ""}
      >
        <span className="material-symbols-rounded">bolt</span>
        Jump to
        <span className="hover" style={{ marginLeft: "auto" }}>
          <span
            style={{
              padding: "2px 5px",
              borderRadius: "5px",
              background: colors[themeColor][100],
            }}
          >
            ctrl
          </span>{" "}
          <span
            style={{
              padding: "2px 5px",
              borderRadius: "5px",
              background: colors[themeColor][100],
            }}
          >
            k
          </span>
        </span>
      </Button>
      <Tooltip title="Jump to">
        <IconButton
          disableRipple
          onClick={() => {
            setOpen(true);
          }}
          color="inherit"
          sx={{
            borderRadius: 94,
            mr: 1,
            ml: 0.6,
            display: { sm: "none" },
            color: {
              xs: router.asPath === "/tidy" ? "#fff" : "#606060",
            },
            transition: "all .2s",
            "&:active": {
              opacity: 0.5,
              transform: "scale(0.95)",
              transition: "none",
            },
          }}
        >
          <span className="material-symbols-outlined">search</span>
        </IconButton>
      </Tooltip>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
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
            borderRadius: "20px 20px 0 0",
            mx: "auto",
            ...(global.user.darkMode && {
              background: "hsl(240, 11%, 25%)",
            }),
            "& input": {
              background: "transparent!important",
            },
          },
        }}
      >
        <Puller />
        <div className="carbon">
          <Command
            ref={ref}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (isHome || inputValue.length) {
                return;
              }

              if (e.key === "Backspace") {
                e.preventDefault();
                popPage();
              }
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              {pages
                .filter((p) => p.toLowerCase() !== "home")
                .map((p) => (
                  <div className="cmdk-carbon-badge" key={p}>
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
              <Command.Empty>
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
    </>
  );
}
