import { Box } from "@mui/material";

export function Label({ code, sx = {} }: any) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 3,
        ...sx,
      }}
    >
      <picture>
        <img
          src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${code}.png`}
          alt=""
          width={35}
        />
      </picture>
    </Box>
  );
}
