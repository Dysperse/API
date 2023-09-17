import { useSession } from "@/lib/client/session";
import { Icon, IconButton, Tooltip } from "@mui/material";
import { useRouter } from "next/router";

export default function BoardSettings({ id }) {
  const router = useRouter();
  const { session } = useSession();

  return (
    <Tooltip title="Board settings">
      <IconButton
        onClick={() => router.push("/tasks/boards/edit/" + id)}
        size="large"
        disabled={session.permission === "read-only"}
      >
        <Icon className="outlined">settings</Icon>
      </IconButton>
    </Tooltip>
  );
}
