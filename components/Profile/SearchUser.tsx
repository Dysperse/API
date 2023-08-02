import { useSession } from "@/lib/client/session";
import { useDarkMode } from "@/lib/client/useColor";
import { Button, Icon, IconButton, Popover, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export function SearchUser() {
  const router = useRouter();
  const session = useSession();
  const ref: any = useRef();
  const [email, setEmail] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isDark = useDarkMode(session.darkMode);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (ref) setTimeout(() => ref.current?.focus(), 200);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const handleSubmit = () => {
    router.push(`/users/${encodeURIComponent(email)}`);
    setAnchorEl(null);
  };

  return (
    <>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        // slotProps={{ backdrop: { sx: { opacity: "0!important" } } }}
        BackdropProps={{
          sx: { opacity: "0!important" },
        }}
        PaperProps={{
          sx: {
            p: 3,
            borderRadius: 5,
            boxShadow: 0,
            background: `hsl(240,11%,${isDark ? 15 : 95}%)`,
          },
        }}
      >
        <TextField
          size="small"
          inputRef={ref}
          value={email}
          fullWidth
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key == "Enter" && handleSubmit()}
          placeholder="Type an email or username..."
          sx={{ mb: 2 }}
        />
        <Button
          onClick={handleSubmit}
          disabled={email.trim() === ""}
          variant="contained"
          fullWidth
        >
          View profile <Icon sx={{ ml: "auto" }}>east</Icon>
        </Button>
      </Popover>
      <IconButton onClick={handleClick} sx={{ ml: "auto" }}>
        <Icon>search</Icon>
      </IconButton>
    </>
  );
}
