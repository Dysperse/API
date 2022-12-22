import { Command } from "cmdk";
import hexToRgba from "hex-to-rgba";
import { useRouter } from "next/router";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { useApi } from "../../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../../hooks/useBackButton";
import { useStatusBar } from "../../../hooks/useStatusBar";
import { colors } from "../../../lib/colors";
import type { ApiResponse } from "../../../types/client";
import { Puller } from "../../Puller";
import { updateSettings } from "../../Settings/updateSettings";

import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  SwipeableDrawer,
  Tooltip,
  Typography,
} from "@mui/material";

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
      {["Appearance", "Two-factor auth", "Account", "Sign out"].map(
        (setting: string) => (
          <Item key={setting.toString()}>{setting}</Item>
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
      <Item onSelect={() => onLink("/spaces")}>
        Spaces
        <Icon icon="view_agenda" />
      </Item>
      <Command.Group heading="Rooms">
        {(global.property.profile.type === "study group"
          ? [{ name: "Backpack", icon: "backpack" }]
          : [
              { name: "Kitchen", icon: "blender" },
              { name: "Bedroom", icon: "bedroom_parent" },
              { name: "Bathroom", icon: "bathroom" },
              { name: "Garage", icon: "garage" },
              { name: "Dining room", icon: "local_dining" },
              { name: "Living room", icon: "living" },
              { name: "Laundry room", icon: "local_laundry_service" },
              { name: "Storage room", icon: "inventory_2" },
              { name: "Garden", icon: "yard" },
            ]
        ).map((room: { name: string; icon: string }) => (
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
      if ((e.key === "k" && e.ctrlKey) || (e.key === "k" && e.metaKey)) {
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
        disabled={!window.navigator.onLine}
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
              background: global.user.darkMode
                ? "hsl(240,11%,20%)"
                : colors[themeColor][100],
            }}
          >
            ctrl
          </span>{" "}
          <span
            style={{
              padding: "2px 5px",
              borderRadius: "5px",
              background: global.user.darkMode
                ? "hsl(240,11%,20%)"
                : colors[themeColor][100],
            }}
          >
            k
          </span>
        </span>
      </Button>
      <Tooltip
        title="Jump to"
        PopperProps={{
          sx: { mt: "-5px!important" },
        }}
      >
        <IconButton
          disabled={!window.navigator.onLine}
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
              xs: global.theme == "dark" ? "hsl(240,11%,95%)" : "#606060",
            },
            transition: "all .2s",
            "&:active": {
              opacity: 0.5,
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
        sx={{
          height: { sm: "100vh" },
          display: { sm: "flex" },
          alignItems: { sm: "center" },
          justifyContent: { sm: "center" },
        }}
        PaperProps={{
          sx: {
            pt: { sm: 3 },
            width: {
              sm: "50vw",
            },
            bottom: { sm: "unset!important" },
            maxWidth: "650px",
            maxHeight: "95vh",
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
            "& input": {
              background: "transparent!important",
            },
          },
        }}
      >
        <Box sx={{ display: { sm: "none" } }}>
          <Puller />
        </Box>
        <Box className="carbon">
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
                    width: "100%",
                    borderRadius: 4,
                    textAlign: "center",
                    my: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 4 }}>
                    No results found
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
              <Box>
                <Box
                  style={{
                    padding: "10px",
                  }}
                ></Box>
              </Box>
            </Command.List>
          </Command>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
