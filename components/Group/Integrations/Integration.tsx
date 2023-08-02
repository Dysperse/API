import { useSession } from "@/lib/client/session";
import { Avatar, ListItemButton, ListItemText } from "@mui/material";
import { useRouter } from "next/router";

export function Integration({ closeParent, integration }) {
  const router = useRouter();
  const session = useSession();

  return (
    <>
      <ListItemButton
        sx={{ mb: 1, gap: 2 }}
        onClick={() => {
          closeParent();
          setTimeout(() => {
            router.push(
              `/integrations/${integration.name
                .toLowerCase()
                .replaceAll(" ", "-")}`
            );
          }, 400);
        }}
      >
        <Avatar src={integration.image} sx={{ borderRadius: 3 }} />
        <ListItemText
          primary={integration.name}
          secondary={integration.description}
        />
      </ListItemButton>
    </>
  );
}
