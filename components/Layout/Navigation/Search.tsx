import {
  Box,
  Chip,
  Icon,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import Router, { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";
import { mutate } from "swr";
import { capitalizeFirstLetter } from "../../../lib/client/capitalizeFirstLetter";
import { fetchRawApi, useApi } from "../../../lib/client/useApi";
import { useSession } from "../../../lib/client/useSession";
import { toastStyles } from "../../../lib/client/useTheme";
import { debounce } from "../../EmojiPicker";
import { Puller } from "../../Puller";
import { updateSettings } from "../../Settings/updateSettings";

export let openSpotlight = () => {};

export let getSpotlightActions = async (roomData, boardData, session) => {
  const router = Router;

  return [
    {
      title: "Boards",
      onTrigger: () => router.push("/tasks"),
      icon: "verified",
    },
    {
      title: "Weekly agenda",
      onTrigger: () => router.push("/tasks#/agenda/week"),
      icon: "view_week",
      badge: "Agenda",
    },
    {
      title: "Monthly agenda",
      onTrigger: () => router.push("/tasks#/agenda/month"),
      icon: "calendar_view_month",
      badge: "Agenda",
    },
    {
      title: "Yearly agenda",
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
      onTrigger: () => router.push("/zen"),
      icon: "change_history",
    },
    {
      title: "Light theme",
      onTrigger: () => {
        mutate("/api/user");
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

    ...(session?.user && session.user.properties
      ? session.user.properties.map((property: any) => {
          return {
            title: property.profile.name,
            onTrigger: () => {
              router.push("/tasks");
              fetchRawApi("property/join", {
                email: session.user.email,
                accessToken1: property.accessToken,
              }).then((res) => {
                toast.success(
                  <span>
                    Switched to &nbsp;<u>{res.profile.name}</u>
                  </span>,
                  toastStyles
                );
                mutate("/api/user");
              });
            },
            icon: "home",
            badge: "Group",
          };
        })
      : []),

    {
      title: "Sign out",
      onTrigger: () => {
        toast.promise(
          fetchRawApi("auth/logout").then(() => mutate("/api/user")),
          {
            loading: "Signing you out",
            error: "Oh no! An error occured while trying to sign you out.",
            success: "Redirecting you...",
          }
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
  const router = useRouter();
  const session: any = useSession();

  const [open, setOpen] = useState<boolean>(false);
  const [results, setResults] = useState<Array<any>>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      ref?.current?.focus();
    }
  }, [open]);

  openSpotlight = handleOpen;

  const { data: roomData } = useApi("property/rooms");
  const { data: boardData } = useApi("property/boards");

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

  return (
    <SwipeableDrawer
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      anchor="bottom"
      disableSwipeToOpen
    >
      <Puller showOnDesktop />
      <Box sx={{ px: 2 }}>
        <TextField
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              setOpen(false);
              setTimeout(() => {
                const tag: any = document.querySelector(
                  `#activeSearchHighlight`
                );
                if (tag) tag.click();
              }, 500);
            }
          }}
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
              background: "rgba(200, 200, 200, .3)",
              "&:focus": {
                background: "rgba(200, 200, 200, .4)",
              },
            },
          }}
          autoFocus
          placeholder="Jump to..."
          inputRef={ref}
          onChange={(e: any) => {
            setInputValue(e.target.value);
            debouncedHandleSearch(e.target.value);
          }}
          value={inputValue}
        />

        <Virtuoso
          style={{ height: "400px", maxHeight: "calc(100vh - 40px)" }}
          totalCount={results.length === 0 ? 1 : results.length}
          itemContent={(index) => {
            if (results.length === 0) {
              return (
                <Box
                  sx={{
                    height: "400px",
                    maxHeight: "calc(100vh - 40px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <picture>
                    <img
                      src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f62d.png"
                      alt="Crying emoji"
                    />
                  </picture>
                  <Typography sx={{ mt: 2 }} variant="h6">
                    No results found
                  </Typography>
                </Box>
              );
            }
            const result = results[index];
            return (
              <ListItemButton
                key={index}
                {...(index == 0 && { id: "activeSearchHighlight" })}
                sx={{
                  gap: 2,
                  mb: 0.2,
                  transition: "none",
                  ...(index == 0 && {
                    background: session.user.darkMode
                      ? "hsl(240,11%,15%)"
                      : "#eee",
                    "& *": {
                      fontWeight: 700,
                    },
                  }),
                }}
                onClick={() => {
                  handleClose();
                  setTimeout(() => {
                    result.onTrigger();
                  }, 500);
                }}
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
