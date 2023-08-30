import { Color } from "@/components/Group/Color";
import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import * as colors from "@radix-ui/colors";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import useSWR from "swr";
import SpacesLayout from ".";

export default function Page() {
  const session = useSession();
  const router = useRouter();
  const { id } = router.query;

  const accessToken = session.properties.find(
    (property) => property.propertyId == id
  )?.accessToken;

  const { error, mutate, data } = useSWR([
    "property",
    {
      propertyId: id,
      propertyAccessToken: accessToken,
    },
  ]);

  const [name, setName] = useState(data?.profile.name || "Untitled space");

  const handleUpdateName = useCallback(() => {
    if (name !== data?.profile?.name) {
      updateSettings(session, "name", name, false, null, true).then(() =>
        setTimeout(mutate, 1000)
      );
    }
  }, [session, mutate, name, data]);

  return (
    <SpacesLayout title="Edit">
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
              placeholder="My space"
            />
            <IconButton
              onClick={handleUpdateName}
              disabled={data?.profile?.name == name}
            >
              <Icon>check</Icon>
            </IconButton>
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
        </>
      ) : (
        <CircularProgress />
      )}
      {data?.length === 0 && <Box>No changes made yet!</Box>}
    </SpacesLayout>
  );
}
