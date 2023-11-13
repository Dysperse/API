import { useSession } from "@/lib/client/session";
import { Box, Icon } from "@mui/material";
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
    // <Badge
    //   badgeContent={data?.length || 0}
    //   color="error"
    //   sx={{
    //     "& .MuiBadge-badge": {
    //       mt: 0.5,
    //       ml: -0.5,
    //     },
    //     width: "100%",
    //   }}
    //   className="button"
    // >
    <Box
      className="button"
      id="addFriendTrigger"
      onClick={() => router.push("/users/add")}
    >
      <Icon className="outlined" sx={{ mt: -0.3, mb: 0.3 }}>
        groups_2
      </Icon>
    </Box>
    // </Badge>
  );
}
