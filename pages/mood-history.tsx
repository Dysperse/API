import { fetchRawApi } from "@/lib/client/useApi";
import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";

export default function History() {
  const router = useRouter();
  const session = useSession();
  const [lastBy, setLastBy] = useState(7);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(null);

  const handleFetch = useCallback(async () => {
    setData(false);
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

  useHotkeys("esc", (e) => {
    e.preventDefault();
    router.push("/zen");
  });

  const styles = {
    border: "1px solid",
    borderColor: `hsl(240,11%,${session.user.darkMode ? 15 : 90}%)`,
    p: 3,
    borderRadius: 5,
    "& .MuiTypography-body2": { mb: 2 },
  };
  const palette = useColor(session.themeColor, session.user.darkMode);

  const dataByDate = data
    ? data.sort(
        (a: any, b: any) =>
          (new Date(b.date) as any) - (new Date(a.date) as any)
      )
    : [];

  return data ? (
    <Box sx={{ p: { xs: 3, sm: 5 }, mb: 5 }}>
      <Head>
        <title>Mood history &bull; Mental health</title>
      </Head>
      <Link href="/zen">
        <Button size="small" variant="contained" sx={{ mb: 5 }}>
          <Icon>west</Icon>
          Back
        </Button>
      </Link>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h3" sx={{ mb: 1 }} className="font-heading">
          History
        </Typography>
        <IconButton sx={{ ml: "auto" }} onClick={handleFetch}>
          <Icon>refresh</Icon>
        </IconButton>
      </Box>
      <Box
        sx={{
          position: "relative",
        }}
      >
        {data?.length < 2 && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              maxWidth: "220px",
              textAlign: "center",
              p: 2,
              background: `hsla(240,11%,${
                session.user.darkMode ? 90 : 15
              }%,0.1)`,
              borderRadius: 5,
              transform: "translate(-50%, -50%)",
            }}
          >
            Not enough data yet! Check back once you complete{" "}
            <b>{2 - data.length}</b> more daily check-ins.
          </Box>
        )}
        <Box
          sx={{
            ...(data?.length < 2 && {
              filter: "blur(10px)",
              opacity: 0.5,
            }),
          }}
        >
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
                disabled={lastBy === days}
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
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4} md={3}>
              <Box sx={styles}>
                <Typography variant="h6">Stress</Typography>
                <Typography variant="body2">
                  {
                    ~~(
                      (data.reduce((a, b) => a + b.stress, 0) /
                        data.length /
                        3) *
                      100
                    )
                  }
                  % score
                </Typography>
                <Sparklines data={[...dataByDate.map((e) => e.stress)]}>
                  <SparklinesSpots style={{ display: "none" }} />
                  <SparklinesLine
                    style={{ fill: "none", strokeWidth: 3 }}
                    color={palette[9]}
                  />
                </Sparklines>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Box sx={styles}>
                <Typography variant="h6">Sleep</Typography>
                <Typography variant="body2">
                  {
                    ~~(
                      (data.reduce((a, b) => a + b.rest, 0) / data.length / 3) *
                      100
                    )
                  }
                  % score
                </Typography>
                <Sparklines data={[...data.map((e) => 2 - e.rest)]}>
                  <SparklinesSpots style={{ display: "none" }} />
                  <SparklinesLine
                    style={{ fill: "none", strokeWidth: 3 }}
                    color={palette[9]}
                  />
                </Sparklines>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Box sx={styles}>
                <Typography variant="h6">Discomfort</Typography>
                <Typography variant="body2">
                  {
                    ~~(
                      (data.reduce((a, b) => a + b.pain, 0) / data.length / 3) *
                      100
                    )
                  }
                  % score
                </Typography>
                <Sparklines data={[...data.map((e) => e.pain)]}>
                  <SparklinesSpots style={{ display: "none" }} />
                  <SparklinesLine
                    style={{ fill: "none", strokeWidth: 3 }}
                    color={palette[9]}
                  />
                </Sparklines>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Box sx={styles}>
                <Typography variant="h6">Food</Typography>
                <Typography variant="body2">
                  {
                    ~~(
                      (data.reduce((a, b) => a + b.food, 0) / data.length / 3) *
                      100
                    )
                  }
                  % score
                </Typography>
                <Sparklines
                  data={[...dataByDate.reverse().map((e) => 3 - e.food)]}
                >
                  <SparklinesSpots style={{ display: "none" }} />
                  <SparklinesLine
                    style={{ fill: "none", strokeWidth: 3 }}
                    color={palette[9]}
                  />
                </Sparklines>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ ...styles, height: "100%" }}>
                <Typography variant="h6">Reasons</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {[...new Set(data.map((item) => item.reason))].map(
                    (reason: any) => (
                      <Chip key={reason} label={reason} />
                    )
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ ...styles, height: "100%" }}>
                <Typography className="font-heading" variant="h3">
                  {data.length}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  Check-ins completed in the last {lastBy} days
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              mb: 5,
              overflowX: { xs: "auto", sm: "hidden" },
            }}
          >
            <Table
              sx={{
                background: "transparent",
                minWidth: "1000px",
                "& *": {
                  borderColor: `hsl(240,11%,${
                    session.user.darkMode ? 15 : 90
                  }%)!important`,
                },
              }}
              aria-label="simple table"
              stickyHeader
            >
              <TableHead
                sx={{
                  background: "transparent",
                  top: { xs: "var(--navbar-height)", sm: "0!important" },
                  position: { sm: "sticky" },
                }}
              >
                <TableRow
                  sx={{
                    background: palette[1],
                  }}
                >
                  <TableCell sx={{ background: "transparent" }} />
                  <TableCell sx={{ background: "transparent" }}>
                    When?
                  </TableCell>
                  <TableCell sx={{ background: "transparent" }}>Why?</TableCell>
                  <TableCell sx={{ background: "transparent" }}>
                    Stress
                  </TableCell>
                  <TableCell sx={{ background: "transparent" }}>
                    Sleep
                  </TableCell>
                  <TableCell sx={{ background: "transparent" }}>
                    Discomfort
                  </TableCell>
                  <TableCell sx={{ background: "transparent" }}>
                    Food?
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  minWidth: "1000px",
                }}
              >
                {dataByDate.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
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
                    <TableCell>{row.stress + 1}/4</TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
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
          </Box>
        </Box>
      </Box>
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
