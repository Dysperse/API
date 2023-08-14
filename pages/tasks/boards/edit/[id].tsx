import Integrations from "@/components/Group/Integrations";
import { ShareBoard } from "@/components/Tasks/Board/Share";
import { TasksLayout } from "@/components/Tasks/Layout";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  AppBar,
  Box,
  Button,
  Icon,
  IconButton,
  SxProps,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";

function BoardAppearanceSettings({ data, styles }) {
  return (
    <Box sx={{ maxWidth: "500px", p: 2, pt: 0 }}>
      <Typography sx={styles.subheader}>Board name</Typography>
      <TextField
        defaultValue={data.name}
        placeholder="Enter a name..."
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: styles.input,
        }}
      />

      <Typography sx={styles.subheader}>Description</Typography>
      <TextField
        defaultValue={data.description}
        multiline
        minRows={4}
        variant="standard"
        placeholder="What's this board about?"
        InputProps={{
          disableUnderline: true,
          sx: styles.input,
        }}
      />

      <Typography sx={styles.subheader}>Categories</Typography>
      <TextField
        disabled
        placeholder="Coming soon"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: styles.input,
        }}
      />
    </Box>
  );
}

function EditLayout({ id, data, url }) {
  const session = useSession();
  const [view, setView] = useState("Appearance");

  const palette = useColor(
    session.themeColor,
    useDarkMode(session.user.darkMode)
  );

  const styles: {
    [key: string]: SxProps;
  } = {
    subheader: {
      textTransform: "uppercase",
      color: palette[11],
      fontWeight: 900,
      fontSize: 14,
      mt: 4,
      mb: 1,
    },
    input: {
      px: 2,
      py: 1,
      background: palette[2],
      "&:focus-within": {
        background: palette[3],
        color: palette[11],
      },
      borderRadius: 3,
    },
  };

  return (
    <Box>
      <AppBar sx={{ border: 0 }}>
        <Toolbar>
          <IconButton sx={{ background: palette[3] }}>
            <Icon>close</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Box sx={{ p: 2, background: palette[2], borderRadius: 5 }}>
          {["Appearance", "Permissions", "Integrations"].map((button) => (
            <Button
              sx={{ px: 2 }}
              onClick={() => setView(button)}
              variant={view === button ? "contained" : "text"}
              key={button}
            >
              {button}
            </Button>
          ))}
        </Box>
        {view === "Appearance" && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <BoardAppearanceSettings data={data} styles={styles} />
          </motion.div>
        )}
        {view === "Permissions" && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <ShareBoard isShared board={data} mutationUrls={{}}>
              <Box>open</Box>
            </ShareBoard>
          </motion.div>
        )}
        {view === "Integrations" && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Box
              sx={{
                background: palette[2],
                mt: 2,
                p: 2,
                py: 10,
                borderRadius: 4,
                textAlign: "center",
              }}
            >
              <Typography variant="h3" sx={{ mb: 1 }} className="font-heading">
                Seamlessly integrate your favorite platforms
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Easily import your data from other applications you love
              </Typography>
              <Box sx={{ maxWidth: "500px", mx: "auto" }}>
                <Integrations handleClose={() => {}} board={data.id} />
              </Box>
            </Box>
          </motion.div>
        )}
      </Box>
    </Box>
  );
}

const Dashboard = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const [open, setOpen] = useState(false);

  const { data, url, error } = useApi("property/boards", {
    id,
    shareToken: "",
  });

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      {data && data[0] && id && <EditLayout id={id} data={data[0]} url={url} />}
    </TasksLayout>
  );
};

export default Dashboard;
