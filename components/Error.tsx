/**
 * @param {string} error Error text
 * @returns {JSX.Element} JSX element
 */
import { Box, Icon, IconButton } from "@mui/material";
import { red } from "@mui/material/colors";

export function ErrorHandler({ error }: { error: string }): JSX.Element {
  /**
   * Reload the page
   */
  const reloadWindow = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 5,
        display: "flex",
        color: red[global.user.darkMode ? 50 : 900],
        background: red[global.user.darkMode ? 900 : 50],
        border: `1px solid ${red[global.user.darkMode ? 800 : 100]}`,
        gap: 2,
        alignItems: "center",
      }}
    >
      <Icon className="outlined">error</Icon>
      {error}
      <IconButton
        color="inherit"
        onClick={reloadWindow}
        sx={{
          borderRadius: 5,
          ml: "auto",
          mr: 1,
          "@keyframes a": {
            "0%": {
              transform: "rotate(0deg)",
            },
            "100%": {
              transform: "rotate(360deg)",
            },
          },
          "&:hover": {
            animation: "a .5s forwards",
          },
        }}
      >
        <Icon>refresh</Icon>
      </IconButton>
    </Box>
  );
}
