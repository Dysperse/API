import { useSession } from "@/lib/client/session";
import { useColor } from "@/lib/client/useColor";
import { Badge, Button, Icon } from "@mui/material";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export function FriendsTrigger() {
  const { session } = useSession();

  const { data } = useSWR([
    "user/friends/request/requests",
    { email: session.user.email, basic: true },
  ]);
  const router = useRouter();

  return (
    <Badge
      badgeContent={data?.length || 0}
      color="error"
      sx={{
        "& .MuiBadge-badge": {
          mt: 0.5,
          ml: -0.5,
        },
      }}
    >
      <Button
        id="addFriendTrigger"
        variant="contained"
        onClick={() => router.push("/users/add")}
      >
        <Icon className="outlined">&#xe7fe;</Icon>
      </Button>
    </Badge>
  );
}
