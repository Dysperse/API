import { fetchRawApi } from "@/lib/client/useApi";
import { toastStyles } from "@/lib/client/useTheme";
import { colors } from "@/lib/colors";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { DurationPicker } from "./DurationPicker";

export function FeaturedRoutine({ mutationUrl, routine }) {
 
  return (<></>
);
}
