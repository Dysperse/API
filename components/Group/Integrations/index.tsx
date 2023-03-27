import { Chip, Typography } from "@mui/material";
import { Integration } from "./Integration";

export default function Integrations() {
  const integrations = [
    {
      name: "Canvas LMS",
      description: "Sync your Canvas Calendar to your boards",
      image:
        "https://www.instructure.com/sites/default/files/image/2021-12/canvas_reversed_logo.png",
      type: "board",
      params: [
        {
          type: "url",
          placeholder: "https://****/feeds/calendars/****.ics",
          name: "Canvas feed URL",
          helperText:
            'You can find your Canvas feed URL by visiting "Calendar → Calendar feed" (web only)',
          required: true,
        },
      ],
    },
  ];
  return (
    <>
      <Typography variant="h6" sx={{ mt: 5, px: 1 }}>
        Integrations
        <Chip
          size="small"
          label="ALPHA"
          sx={{
            ml: 1,
            background: "linear-gradient(45deg, #ff0f7b, #f89b29)",
            color: "#000",
          }}
        />
      </Typography>
      {integrations.map((integration) => (
        <Integration integration={integration} key={integration.name} />
      ))}
    </>
  );
}
