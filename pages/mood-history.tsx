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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
    <Box sx={{ p: { xs: 3, sm: 5 }, mb: 5 }}>
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

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "100%" }} aria-label="simple table" stickyHeader>
          <TableHead
            sx={{
              position: "sticky",
              top: 0,
            }}
          >
            <TableRow>
              <TableCell></TableCell>
              <TableCell>When?</TableCell>
              <TableCell>Why?</TableCell>
              <TableCell>Stress</TableCell>
              <TableCell>Sleep</TableCell>
              <TableCell>Discomfort</TableCell>
              <TableCell>Food?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .sort(
                (a: any, b: any) =>
                  (new Date(b.date) as any) - (new Date(a.date) as any)
              )
              .map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left" sx={{ width: 50 }}>
                    <picture>
                      <img
                        src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${row.mood}.png`}
                        alt="emoji"
                        width={40}
                        height={40}
                      />
                    </picture>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 700 }}>
                      {dayjs(row.date).format("M/D")}
                    </Typography>
                    <Typography variant="body2">
                      {dayjs(row.date).fromNow().includes("hours")
                        ? "Today"
                        : dayjs(row.date).fromNow()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={row.reason} />
                  </TableCell>
                  <TableCell>{row.stress}/4</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Icon className="outlined">
                        {row.rest == 0
                          ? "check_circle"
                          : row.rest == 1
                          ? "airline_seat_flat"
                          : "bedtime"}
                      </Icon>
                      {row.rest == 0
                        ? "Slept"
                        : row.rest == 1
                        ? "Needed rest"
                        : "Needed sleep"}
                    </Box>
                  </TableCell>
                  <TableCell>{row.pain}/5</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Icon className="outlined">
                        {row.food == 0
                          ? "check_circle"
                          : row.food == 1
                          ? "icecream"
                          : "cancel"}
                      </Icon>
                      {row.food == 0
                        ? "Ate"
                        : row.food == 1
                        ? "Could've used a snack..."
                        : "Didn't eat"}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
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