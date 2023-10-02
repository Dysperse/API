import { Button, Icon } from "@mui/material";
import { useRouter } from "next/router";

export function SearchFriend({ mutate }) {
  const router = useRouter();
  return (
    <Button
      id="addFriendTrigger"
      variant="contained"
      onClick={() => router.push("/users/add")}
    >
      <Icon className="outlined">person_add</Icon>
    </Button>
  );
}
