import { SpotlightProvider } from "@mantine/spotlight";
import { Divider, Icon } from "@mui/material";
import { useRouter } from "next/router";
import { updateSettings } from "../Settings/updateSettings";

import {
  Badge,
  createStyles,
  Group,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { SpotlightActionProps } from "@mantine/spotlight";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { toastStyles } from "../../lib/useCustomTheme";

function CustomAction({
  action,
  styles,
  classNames,
  hovered,
  onTrigger,
  ...others
}: SpotlightActionProps) {
  const useStyles: any = createStyles((theme: any | null) => ({
    action: {
      position: "relative",
      display: "block",
      width: "100%",
      padding: "10px 12px",
      borderRadius: theme.radius.sm,
    },

    actionHovered: {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[1],
    },
  }));

  const { classes, cx } = useStyles(null, {
    styles,
    classNames,
    name: "Spotlight",
  });

  return (
    <UnstyledButton
      className={cx(classes.action, { [classes.actionHovered]: hovered })}
      tabIndex={-1}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onTrigger}
      {...others}
      sx={{
        "&:hover": {
          background: "#eee",
          color: "#000",
        },
        "&:active, &:focus": {
          background: "#ddd",
          color: "#000",
        },
        color: "#505050",
        fontWeight: 400,
      }}
    >
      {action.divider ? (
        <Group noWrap>
          <Divider sx={{ my: 2 }} />
        </Group>
      ) : (
        <Group noWrap>
          {action.icon}
          <div style={{ flex: 1 }}>
            <Text>{action.title}</Text>

            {action.description && (
              <Text color="dimmed" size="xs">
                {action.description}
              </Text>
            )}
          </div>

          {action.badge && <Badge>{action.badge}</Badge>}
        </Group>
      )}
    </UnstyledButton>
  );
}

export default function SearchPopup({ styles }) {
  const router = useRouter();

  const { data: roomData } = useApi("property/rooms");
  const { data: boardData } = useApi("property/boards");

  const actions: any = [
    {
      title: "Boards",
      onTrigger: () => router.push("/tasks"),
      icon: <Icon className="outlined">verified</Icon>,
    },
    {
      title: "Coach",
      onTrigger: () => router.push("/coach"),
      icon: <Icon className="outlined">routine</Icon>,
    },
    {
      title: "Items",
      onTrigger: () => router.push("/items"),
      icon: <Icon className="outlined">category</Icon>,
    },
    {
      title: "Start",
      onTrigger: () => router.push("/zen"),
      icon: <Icon className="outlined">change_history</Icon>,
    },
    {
      title: "Light theme",
      onTrigger: () => {
        mutate("/api/user");
        updateSettings("darkMode", "false");
      },
      icon: <Icon className="outlined">light_mode</Icon>,
    },
    {
      title: "Dark theme",
      onTrigger: () => {
        updateSettings("darkMode", "true");
      },
      icon: <Icon className="outlined">dark_mode</Icon>,
    },
    ...(roomData
      ? roomData.map((room: any) => {
          return {
            title: room.name,
            onTrigger: () => router.push(`/rooms/${room.id}`),
            icon: <Icon className="outlined">category</Icon>,
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

    ...(global.user && global.user.properties
      ? global.user.properties.map((property: any) => {
          return {
            title: property.profile.name,
            onTrigger: () => {
              router.push("/tasks");
              fetchApiWithoutHook("property/join", {
                email: global.user.email,
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
            icon: <Icon className="outlined">home</Icon>,
            badge: "Group",
          };
        })
      : []),

    ...(global.property.profile.type !== "study group"
      ? [
          "Kitchen:blender",
          "Bedroom:bedroom_parent",
          "Bathroom:bathroom",
          "Garage:garage",
          "Dining room:dining",
          "Living room:living",
          "Laundry room:local_laundry_service",
          "Storage room:inventory_2",
          "Garden:yard",
          "Camping:camping",
        ]
      : ["Backpack:backpack"].map((room) => {
          const [name, icon] = room.split(":");
          return {
            title: name,
            onTrigger: () =>
              router.push(`/rooms/${name.toLowerCase().replace(" ", "-")}`),
            icon: <Icon className="outlined">{icon}</Icon>,
            badge: "Room",
          };
        })),

    {
      title: "Feedback center",
      onTrigger: () => {
        router.push("/feedback");
      },
      icon: <Icon className="outlined">chat_bubble</Icon>,
    },
    {
      title: "Discord",
      onTrigger: () => {
        window.open("https://discord.gg/fvngmDzh77");
      },
      icon: <Icon className="outlined">chat_bubble</Icon>,
    },
  ];

  return (
    <SpotlightProvider
      limit={7}
      onSpotlightClose={() => {
        document
          .querySelector(`meta[name="theme-color"]`)
          ?.setAttribute(
            "content",
            global.user.darkMode ? "hsl(240,11%,10%)" : "#fff"
          );
      }}
      onSpotlightOpen={() => {
        if (!global.user.darkMode) {
          document
            .querySelector(`meta[name="theme-color"]`)
            ?.setAttribute("content", "#c0c0c0");
        }
      }}
      actions={actions}
      shortcut={["mod + K", "/"]}
      searchIcon={<Icon className="outlined">bolt</Icon>}
      searchPlaceholder="Find anything →"
      actionComponent={CustomAction}
      nothingFoundMessage="😭 Nothing found..."
    />
  );
}
