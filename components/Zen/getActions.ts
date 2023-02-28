import router from "next/router";
import { capitalizeFirstLetter } from "../ItemPopup";

export const getActions = (type) => {
  return {
    goals: [
      { key: "study_plan", primary: "Create a study plan", icon: "school" },
      { key: "set_goal", primary: "Set a goal", icon: "mindfulness" },
    ],
    inventory: [
      {
        key: "starred",
        primary: "Starred",
        icon: "star",
        onClick: () => router.push(`/starred`),
      },
      { key: "scan", primary: "Scan items", icon: "view_in_ar" },

      ...(type !== "study group"
        ? [
            "kitchen",
            "bedroom",
            "bathroom",
            "garage",
            "living room",
            "dining room",
            "laundry room",
            "storage room",
            "garden",
            "camping",
          ]
        : ["backpack"]
      ).map((room) => {
        return {
          key: room,
          primary: capitalizeFirstLetter(room),
          icon: "inventory_2",
          onClick: () => router.push(`/rooms/${room.replaceAll(" ", "-")}`),
        };
      }),
    ],
    settings: [
      {
        key: "settings",
        primary: "Settings",
        icon: "settings",
        onClick: () => document.getElementById("settingsTrigger")?.click(),
      },
    ],
    groups: [
      {
        key: "trigger",
        primary: "Switch groups",
        icon: "swap_horiz",
        onClick: () => document.getElementById("houseProfileTrigger")?.click(),
      },
      {
        key: "group_info",
        primary: "Group info",
        icon: "home",
        onClick: () => document.getElementById("activeProperty")?.click(),
      },
    ],
  };
};
