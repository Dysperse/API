import { isEmail } from "@/components/Group/Members";
import { useSession } from "@/lib/client/session";
import { useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { Button, Icon, IconButton, Popover, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

export function SearchUser({ profileCardStyles, data }) {
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
    if (!isEmail(email)) {
      toast.error("Please enter an email", toastStyles);
      return;
    }
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
          placeholder="Type an email..."
          sx={{ mb: 2 }}
        />
        <Button
          onClick={handleSubmit}
          disabled={!isEmail(email)}
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
