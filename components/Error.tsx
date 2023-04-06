/**
 * @param {string} error Error text
 * @returns {JSX.Element} JSX element
 */
import { Alert, Icon, IconButton } from "@mui/material";
import { useState } from "react";

export function ErrorHandler({
  error,
  callback = () => window.location.reload(),
}: {
  error: string;
  callback?: () => void;
}): JSX.Element {
  const [loading, setLoading] = useState(false);

  return (
    <Alert
      severity="error"
      sx={{
        borderRadius: 5,
        display: "flex",
        userSelect: "none",
        gap: 2,
        transition: "all .2s",
        alignItems: "center",
        textAlign: "left",
        ...(loading && {
          transform: "scale(.95)",
          opacity: 0.8,
        }),
      }}
      action={
        <IconButton
          color="inherit"
          size="small"
          onClick={async () => {
            setLoading(true);
            await callback();
            setLoading(false);
          }}
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
            ...(loading && {
              animation: "a .5s forwards infinite",
            }),
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
