import { CssBaseline } from "@mui/material";

export default function Page({ children }) {
  return (
    <html>
      <body>
        <CssBaseline />
        {children}
      </body>
    </html>
  );
}
