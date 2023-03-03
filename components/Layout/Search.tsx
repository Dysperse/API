import { Badge, Group, UnstyledButton } from "@mantine/core";
import { SpotlightActionProps, SpotlightProvider } from "@mantine/spotlight";
import { Divider, Icon, Typography } from "@mui/material";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { toastStyles } from "../../lib/useCustomTheme";
import { useSession } from "../../pages/_app";
import { capitalizeFirstLetter } from "../ItemPopup";
import { updateSettings } from "../Settings/updateSettings";

function CustomAction({
  action,
  styles,
  classNames,
  hovered,
  onTrigger,
  ...others
}: SpotlightActionProps) {
  return (
    <UnstyledButton
      onMouseDown={(event) => event.preventDefault()}
      onClick={onTrigger}
      {...others}
      sx={{
        userSelect: "none",
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
            <Typography>{action.title}</Typography>
            {action.description && (
              <Typography>{action.description}</Typography>
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
  const session = useSession();

  const { data: roomData } = useApi("property/rooms");
  const { data: boardData } = useApi("property/boards");

  const actions: any = [
    {
      title: "Boards",
      onTrigger: () => router.push("/tasks"),
      icon: <Icon className="outlined">verified</Icon>,
    },
    {
      title: "Weekly agenda",
      onTrigger: () => router.push("/tasks#/agenda/week"),
      icon: <Icon className="outlined">view_week</Icon>,
      badge: "Agenda",
    },
    {
      title: "Monthly agenda",
      onTrigger: () => router.push("/tasks#/agenda/month"),
      icon: <Icon className="outlined">calendar_view_month</Icon>,
      badge: "Agenda",
    },
    {
      title: "Yearly agenda",
      onTrigger: () => router.push("/tasks#/agenda/year"),
      icon: <Icon className="outlined">calendar_month</Icon>,
      badge: "Agenda",
    },
    {
      title: "Backlog",
      onTrigger: () => router.push("/tasks#/agenda/backlog"),
      icon: <Icon className="outlined">auto_mode</Icon>,
      badge: "Agenda",
    },
    {
      title: "Coach",
      onTrigger: () => router.push("/coach"),
      icon: <Icon className="outlined">rocket_launch</Icon>,
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

    ...["week", "month", "year"].map((e) => {
      return {
        title: capitalizeFirstLetter(e),
        onTrigger: () => router.push(`/tasks/#/agenda/${e}`),
        icon: <Icon className="outlined">today</Icon>,
        badge: "agenda",
      };
    }),
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

    ...(session.user && session.user.properties
      ? session.user.properties.map((property: any) => {
          return {
            title: property.profile.name,
            onTrigger: () => {
              router.push("/tasks");
              fetchApiWithoutHook("property/join", {
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
            icon: <Icon className="outlined">home</Icon>,
            badge: "Group",
          };
        })
      : []),

    ...(session.property.profile.type !== "study group"
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
      title: "Sign out",
      onTrigger: () => {
        toast.promise(
          fetchApiWithoutHook("auth/logout").then(() => mutate("/api/user")),
          {
            loading: "Signing you out",
            error: "Oh no! An error occured while trying to sign you out.",
            success: "Redirecting you...",
          }
        );
      },
      icon: <Icon className="outlined">logout</Icon>,
    },
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
            session.user.darkMode ? "hsl(240,11%,10%)" : "#fff"
          );
      }}
      onSpotlightOpen={() => {
        if (!session.user.darkMode) {
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
