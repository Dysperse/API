import { ErrorHandler } from "@/components/Error";
import { Color } from "@/components/Group/Color";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Icon,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import * as colors from "@radix-ui/colors";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import useSWR, { mutate } from "swr";
import SpacesLayout from ".";

export default function Page() {
  const { session } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const accessToken = session.properties.find(
    (property) => property.propertyId == id
  )?.accessToken;

  const {
    error,
    mutate: mutateData,
    data,
  } = useSWR([
    "property",
    {
      propertyId: id,
      propertyAccessToken: accessToken,
    },
  ]);

  const [name, setName] = useState(
    session.property.profile.name || "Untitled space"
  );
  const [vanishingTasks, setVanishingTasks] = useState(
    Boolean(data?.profile?.vanishingTasks)
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );
  const handleCloseMenu = useCallback(
    async (type) => {
      await updateSettings(["type", type], { session, type: "property" });
      await mutate("/api/session");
      setAnchorEl(null);
    },
    [session, mutate]
  );

  const handleUpdateName = useCallback(async () => {
    if (name !== data?.profile?.name) {
      await updateSettings(["name", name], { session, type: "property" });
      mutate("/api/session");
    }
  }, [session, name, data]);

  return (
    <SpacesLayout title="Edit">
      {error && <ErrorHandler />}
      {data ? (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Group name"
              fullWidth
              onKeyDown={(e: any) => {
                e.key === "Enter" && e.target.blur();
              }}
              InputProps={{
                endAdornment: session.property.profile.name !== name &&
                  name.trim() !== "" && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleUpdateName}>
                        <Icon>check</Icon>
                      </IconButton>
                    </InputAdornment>
                  ),
              }}
              placeholder="My space"
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              sx={{ mb: 2, opacity: 0.7, color: "#fff" }}
            >
              Color
            </Typography>
            {...Object.keys(colors)
              .filter((color) => !color.includes("Dark"))
              .filter((color) => !color.endsWith("A"))
              .filter((color) => !color.endsWith("P3"))
              .filter(
                (color) =>
                  ![
                    "bronze",
                    "gold",
                    "sand",
                    "olive",
                    "slate",
                    "mauve",
                    "gray",
                  ].includes(color)
              )
              .map((item, index) => (
                <Color
                  s={data?.profile?.color}
                  color={item}
                  key={index}
                  mutatePropertyData={mutate}
                />
              ))}
          </Box>

          <Typography
            variant="body2"
            sx={{ mt: 4, opacity: 0.7, color: "#fff" }}
          >
            Space type
          </Typography>
          <Button
            variant="outlined"
            sx={{
              my: 2,
              px: 2,
            }}
            disabled={data.permission === "read-only"}
            onClick={handleClick}
            onMouseDown={handleClick}
          >
            <Typography
              sx={{
                textTransform: "capitalize",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Icon className="outlined">
                {data?.profile?.type === "dorm"
                  ? "cottage"
                  : data?.profile?.type === "apartment"
                  ? "location_city"
                  : data?.profile?.type === "study group"
                  ? "school"
                  : "home"}
              </Icon>
              {data?.profile?.type}
            </Typography>
          </Button>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Heads up! Changing your space type may cause data loss. Change this
            setting with caution.
          </Alert>

          <Typography
            variant="body2"
            sx={{ mt: 4, opacity: 0.7, color: "#fff" }}
          >
            Other
          </Typography>
          <List>
            <ListItem sx={{ px: 0 }}>
              <ListItemText
                primary="Vanishing tasks"
                secondary="Delete completed tasks more than 14 days old"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={vanishingTasks}
                  onChange={async (_, newValue) => {
                    setVanishingTasks(newValue);
                    await updateSettings(["vanishingTasks", newValue], {
                      session,
                      type: "property",
                    });
                    mutateData();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {["house", "apartment", "dorm", "study group"].map((type) => (
              <MenuItem
                onClick={() => handleCloseMenu(type)}
                value={type}
                disabled={type == data.profile.type}
                key={type}
              >
                {capitalizeFirstLetter(type)}
              </MenuItem>
            ))}
          </Menu>
        </>
      ) : (
        <CircularProgress />
      )}
      {data?.length === 0 && <Box>No changes made yet!</Box>}
    </SpacesLayout>
  );
}
