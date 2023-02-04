/**
 * @param {string} error Error text
 * @returns {JSX.Element} JSX element
 */
import { Alert, Icon, IconButton } from "@mui/material";

export function ErrorHandler({ error }: { error: string }): JSX.Element {
  /**
   * Reload the page
   */
  const reloadWindow = () => {
    window.location.reload();
  };

  return (
    <Alert
      severity="error"
      sx={{
        borderRadius: 5,
        display: "flex",
        userSelect: "none",
        gap: 2,
        alignItems: "center",
      }}
      action={
        <IconButton
          color="inherit"
          size="small"
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
      }
    >
      {error}
    </Alert>
  );
}
