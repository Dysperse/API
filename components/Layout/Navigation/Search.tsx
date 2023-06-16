import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Box,
  Chip,
  Icon,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import Router from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { Virtuoso } from "react-virtuoso";
import { mutate } from "swr";
import { updateSettings } from "../../../lib/client/updateSettings";
import { debounce } from "../../EmojiPicker";
import { Puller } from "../../Puller";

export let openSpotlight = () => {};

export let getSpotlightActions = async (roomData, boardData, session) => {
  const router = Router;

  return [
    {
      title: "Days",
      onTrigger: () => router.push("/tasks/agenda/day"),
      icon: "calendar_today",
    },
    {
      title: "Weeks",
      onTrigger: () => router.push("/tasks/agenda/week"),
      icon: "view_week",
      badge: "Agenda",
    },
    {
      title: "Months",
      onTrigger: () => router.push("/tasks#/agenda/month"),
      icon: "calendar_view_month",
      badge: "Agenda",
    },
    {
      title: "Years",
      onTrigger: () => router.push("/tasks#/agenda/year"),
      icon: "calendar_month",
      badge: "Agenda",
    },
    {
      title: "Backlog",
      onTrigger: () => router.push("/tasks#/agenda/backlog"),
      icon: "auto_mode",
      badge: "Agenda",
    },
    {
      title: "Coach",
      onTrigger: () => router.push("/coach"),
      icon: "rocket_launch",
    },
    {
      title: "Items",
      onTrigger: () => router.push("/items"),
      icon: "category",
    },
    {
      title: "Start",
      onTrigger: () => router.push("/"),
      icon: "change_history",
    },
    {
      title: "Light theme",
      onTrigger: () => {
        mutate("/api/session");
        updateSettings("darkMode", "false");
      },
      icon: "light_mode",
    },
    {
      title: "Dark theme",
      onTrigger: () => {
        updateSettings("darkMode", "true");
      },
      icon: "dark_mode",
    },

    ...["week", "month", "year"].map((e) => {
      return {
        title: capitalizeFirstLetter(e),
        onTrigger: () => router.push(`/tasks/#/agenda/${e}`),
        icon: "today",
        badge: "agenda",
      };
    }),
    ...(roomData
      ? roomData.map((room: any) => {
          return {
            title: room.name,
            onTrigger: () => router.push(`/rooms/${room.id}`),
            icon: "category",
            badge: "Room",
          };
        })
      : []),

    ...(boardData
      ? boardData.map((room: any) => {
          return {
            title: room.name,
            onTrigger: () => router.push(`/tasks#${room.id}`),
            icon: (
              <Icon className="outlined">
                {room.type === "board" ? "view_kanban" : "task_alt"}
              </Icon>
            ),
            badge: room.type === "board" ? "Board" : "Checklist",
          };
        })
      : []),

    ...(session?.user && session.properties
      ? session.properties.map((property: any) => {
          return {
            title: property.profile.name,
            onTrigger: () => {
              router.push("/tasks/agenda/week");
              fetchRawApi("property/switch", {
                email: session.user.email,
                accessToken1: property.accessToken,
              }).then((res) => {
                toast.success(
                  <span>
                    Switched to &nbsp;<u>{res.profile.name}</u>
                  </span>,
                  toastStyles
                );
                mutate("/api/session");
              });
            },
            icon: "tag",
            badge: "Group",
          };
        })
      : []),

    {
      title: "Sign out",
      onTrigger: () => {
        toast.promise(
          fetchRawApi("auth/logout").then(() => mutate("/api/session")),
          {
            loading: "Signing you out",
            error: "Oh no! An error occured while trying to sign you out.",
            success: "Redirecting you...",
          },
          toastStyles
        );
      },
      icon: "logout",
    },
    {
      title: "Feedback center",
      onTrigger: () => {
        router.push("/feedback");
      },
      icon: "chat_bubble",
    },
    {
      title: "Discord",
      onTrigger: () => {
        window.open("https://discord.gg/fvngmDzh77");
      },
      icon: "chat_bubble",
    },
  ];
};

export default function Spotlight() {
  // Primarily state management and callback functions for opening/closing the modal
  const ref: any = useRef();
  const session: any = useSession();

  const [open, setOpen] = useState<boolean>(false);
  const [results, setResults] = useState<Array<any>>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleOpen = useCallback(() => setOpen(true), []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setInputValue("");
  }, []);

  useHotkeys("ctrl+k", (e) => {
    e.preventDefault();
    setOpen(true);
  });

  useEffect(() => {
    if (open) {
      setTimeout(() => ref?.current?.focus(), 200);
    }
  }, [open]);

  openSpotlight = handleOpen;

  const { data: roomData } = useApi("property/inventory/rooms");
  const { data: boardData } = useApi("property/boards");

  const palette = useColor(session.themeColor, session.user.darkMode);

  // Input event handling
  const handleSearch = async (value) => {
    let results = await getSpotlightActions(roomData, boardData, session);

    results = results.filter((result) =>
      result.title.toLowerCase().includes(value.toLowerCase())
    );

    setResults(results);
  };

  const debouncedHandleSearch = debounce(handleSearch, 500);

  useEffect(
    () => debouncedHandleSearch(inputValue),
    [inputValue, debouncedHandleSearch]
  );

  useHotkeys(
    "enter",
    (e) => {
      if (open) {
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => {
          const tag: any = document.querySelector(`#activeSearchHighlight`);
          if (tag) tag.click();
        }, 500);
      }
    },
    {
      enableOnFormTags: true,
    }
  );

  return (
    <SwipeableDrawer
      open={open}
      onClose={handleClose}
      anchor="bottom"
      PaperProps={{
        sx: {
          minHeight: "calc(100vh - 50px)",
          height: "calc(100vh - 50px)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Puller showOnDesktop />
      <Box sx={{ px: 2 }}>
        <TextField
          type="text"
          size="small"
          variant="standard"
          sx={{ mb: 2 }}
          InputProps={{
            disableUnderline: true,
            sx: {
              px: 2,
              py: 1,
              borderRadius: 3,
              background: palette[2],
              "&:focus-within": {
                background: palette[3],
              },
            },
          }}
          autoFocus
          placeholder="Search..."
          inputRef={ref}
          onChange={(e: any) => {
            setInputValue(e.target.value);
            debouncedHandleSearch(e.target.value);
          }}
          value={inputValue}
        />
      </Box>
      <Box sx={{ mt: 1, px: 2, flexGrow: 1 }}>
        <Virtuoso
          style={{ height: "100%", maxHeight: "calc(100vh - 100px)" }}
          totalCount={results.length + 1}
          itemContent={(index) => {
            const result = results[index];
            if (!results[index]) {
              return (
                <ListItemButton
                  key={index}
                  {...(index == 0 && { id: "activeSearchHighlight" })}
                  sx={{
                    gap: 2,
                    mb: 0.2,
                    transition: "none",
                    ...(index == 0 && {
                      background: palette[2],
                      "& *": {
                        fontWeight: 700,
                      },
                    }),
                  }}
                  onClick={() => {
                    Router.push(`/tasks/search/${inputValue}`);
                    setTimeout(handleClose, 500);
                  }}
                >
                  <Icon {...(index !== 0 && { className: "outlined" })}>
                    check_circle
                  </Icon>
                  <ListItemText primary={`Search for "${inputValue}"`} />
                  <Chip size="small" label={index == 0 ? "↵ enter" : "Tasks"} />
                </ListItemButton>
              );
            }
            const handleClick = () => {
              handleClose();
              setTimeout(result.onTrigger, 500);
            };

            return (
              <ListItemButton
                key={index}
                {...(index == 0 && { id: "activeSearchHighlight" })}
                sx={{
                  gap: 2,
                  mb: 0.2,
                  transition: "none",
                  ...(index == 0 && {
                    background: palette[2],
                    "& *": {
                      fontWeight: 700,
                    },
                  }),
                }}
                onClick={handleClick}
              >
                <Icon {...(index !== 0 && { className: "outlined" })}>
                  {result.icon}
                </Icon>
                <ListItemText primary={result.title} />
                {result.badge ||
                  (index == 0 && (
                    <Chip
                      size="small"
                      label={index == 0 ? "↵ enter" : result.badge}
                    />
                  ))}
              </ListItemButton>
            );
          }}
        />
      </Box>
    </SwipeableDrawer>
  );
}
