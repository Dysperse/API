import { fetchRawApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { colors } from "@/lib/colors";
import { Masonry } from "@mui/lab";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Icon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";

export default function History() {
  const session = useSession();
  const [lastBy, setLastBy] = useState(7);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(null);

  const handleFetch = useCallback(async () => {
    setData(null);
    setError(null);
    const f = await fetchRawApi("user/checkIns/count", {
      lte: dayjs().add(1, "day"),
      gte: dayjs().subtract(lastBy, "day"),
    });
    setData(f);
  }, [lastBy]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  const styles = {
    border: "1px solid",
    borderColor: `hsl(240,11%,${session.user.darkMode ? 15 : 90}%)`,
    p: 3,
    borderRadius: 5,
    "& h6": { mb: 1 },
  };

  return data ? (
    <Box sx={{ p: { xs: 3, sm: 5 } }}>
      <Head>
        <title>Mood history &bull;Mental health</title>
      </Head>
      <Link href="/zen">
        <Button size="small" variant="contained" sx={{ mb: 5 }}>
          <Icon>west</Icon>
          Back
        </Button>
      </Link>
      <Typography variant="h4" sx={{ mb: 1 }} className="font-heading">
        History
      </Typography>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        size="small"
        variant="outlined"
        sx={{ mb: 2 }}
      >
        Last {lastBy} days <Icon>expand_more</Icon>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {[7, 14, 30, 60, 90, 365].map((days) => (
          <MenuItem
            onClick={() => {
              handleClose();
              setLastBy(days);
            }}
            key={days}
          >
            {days} days
          </MenuItem>
        ))}
      </Menu>
      <Masonry columns={{ xs: 1, sm: 3 }} spacing={2}>
        <Box sx={styles}>
          <Typography variant="h6">Stress</Typography>
          <Sparklines data={[...data.map((e) => e.stress)]}>
            <SparklinesSpots style={{ display: "none" }} />
            <SparklinesLine
              style={{ fill: "none", strokeWidth: 3 }}
              color={colors[session.themeColor]["A700"]}
            />
          </Sparklines>
        </Box>
        <Box sx={styles}>
          <Typography variant="h6">Sleep</Typography>
          <Sparklines data={[...data.map((e) => e.rest)]}>
            <SparklinesSpots style={{ display: "none" }} />
            <SparklinesLine
              style={{ fill: "none", strokeWidth: 3 }}
              color={colors[session.themeColor]["A700"]}
            />
          </Sparklines>
        </Box>
        <Box sx={styles}>
          <Typography variant="h6">Physical discomfort</Typography>
          <Sparklines data={[...data.map((e) => e.pain)]}>
            <SparklinesSpots style={{ display: "none" }} />
            <SparklinesLine
              style={{ fill: "none", strokeWidth: 3 }}
              color={colors[session.themeColor]["A700"]}
            />
          </Sparklines>
        </Box>
        <Box sx={styles}>
          <Typography className="font-heading" variant="h3">
            {
              ~~(
                (data.reduce((a, b) => a + b.stress, 0) / data.length / 3) *
                100
              )
            }
            %
          </Typography>
          <Typography sx={{ fontWeight: 700 }}>Stress score</Typography>
        </Box>
        <Box sx={styles}>
          <Typography className="font-heading" variant="h3">
            {~~((data.reduce((a, b) => a + b.rest, 0) / data.length / 3) * 100)}
            %
          </Typography>
          <Typography sx={{ fontWeight: 700 }}>Sleep score</Typography>
        </Box>
        <Box sx={styles}>
          <Typography className="font-heading" variant="h3">
            {~~((data.reduce((a, b) => a + b.pain, 0) / data.length / 3) * 100)}
            %
          </Typography>
          <Typography sx={{ fontWeight: 700 }}>Discomfort score</Typography>
        </Box>
        <Box sx={styles}>
          <Typography variant="h6">Reasons</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {[...new Set(data.map((item) => item.reason))].map(
              (reason: any) => (
                <Chip key={reason} label={reason} />
              )
            )}
          </Box>
        </Box>
        <Box sx={styles}>
          <Typography className="font-heading" variant="h3">
            {data.length}
          </Typography>
          <Typography sx={{ fontWeight: 700 }}>
            Check-ins completed in the last {lastBy} days
          </Typography>
        </Box>
      </Masonry>

      {/* {JSON.stringify(data)} */}
    </Box>
  ) : (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
