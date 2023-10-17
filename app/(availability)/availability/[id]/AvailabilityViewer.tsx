import { ErrorHandler } from "@/components/Error";
import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import useSWR from "swr";

export function AvailabilityViewer({ data: eventData }) {
  const { session } = useSession();
  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );

  const { data, mutate, error } = useSWR([
    "availability/event/others",
    { id: eventData.id },
  ]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="motion"
      style={{
        overflowY: "scroll",
        flexDirection: "column",
        padding: "30px",
        gap: "7px",
      }}
    >
      {data ? (
        <>
          {data.overlappingAvailability?.length === 0 ? (
            <Box
              sx={{
                borderRadius: 4,
              }}
            >
              <Typography variant="h4" className="font-heading">
                Yikes!
              </Typography>
              <Typography>
                Nobody you&apos;ve invited is available at the same time
              </Typography>

              <TableContainer
                component={Box}
                sx={{
                  mt: 3,
                  background: palette[3],
                  borderRadius: 4,
                }}
              >
                <Table
                  aria-label="All overlapping availability"
                  sx={{
                    "& *": {
                      borderBottomColor: palette[5] + "!important",
                      borderBottomWidth: "2px!important",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="h6">All availability</Typography>
                        <Typography variant="body2">
                          {eventData.participants.length} people responded
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Person</TableCell>
                      <TableCell align="center">Availability</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.data.participants.map((participant) => (
                      <TableRow
                        key={participant.name}
                        sx={{
                          borderColor: palette[3],
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            {participant?.user?.Profile && (
                              <ProfilePicture
                                data={participant.user}
                                size={30}
                              />
                            )}
                            {participant.user?.name ||
                              participant.userData?.name}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              flexWrap: "wrap",
                              gap: 2,
                            }}
                          >
                            {participant.availability.map(
                              (availability, index) => (
                                <Chip
                                  label={dayjs(availability.date)
                                    .set("hour", availability.hour)
                                    .format("MM/D [at] hA")}
                                  sx={{ background: palette[5] }}
                                  key={index}
                                />
                              )
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Box>
              <Box
                sx={{
                  p: 3,
                  background: palette[3],
                  borderRadius: 4,
                }}
              >
                <Typography variant="h4" className="font-heading">
                  <u>
                    {dayjs(data.overlappingAvailability?.[0]?.date).format(
                      "dddd, MMMM Do"
                    )}
                  </u>{" "}
                  at{" "}
                  <u>
                    {data.overlappingAvailability[0]?.hour % 12 || 12}{" "}
                    {data.overlappingAvailability[0]?.hour > 11 ? "PM" : "AM"}
                  </u>
                </Typography>
                <Typography>Best time to meet</Typography>
              </Box>

              <TableContainer
                component={Box}
                sx={{
                  mt: 3,
                  background: palette[3],
                  borderRadius: 4,
                  overflowX: "scroll",
                }}
              >
                <Table
                  aria-label="All overlapping availability"
                  sx={{
                    minWidth: "500px",
                    "& *": {
                      borderBottomColor: palette[5] + "!important",
                      borderBottomWidth: "2px!important",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="h6">
                          All overlapping availability
                        </Typography>
                        <Typography variant="body2">
                          {eventData.participants.length} people responded
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="center">Time</TableCell>
                      <TableCell align="center">People</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.overlappingAvailability.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          borderColor: palette[3],
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {dayjs(row.date).format("dddd, MMMM Do")}
                        </TableCell>
                        <TableCell align="center">
                          {dayjs(row.date).set("hour", row.hour).format("hA")}
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              flexDirection: "column",
                            }}
                          >
                            {row.participants.map((participant) => (
                              <Box
                                key={participant.id}
                                sx={{
                                  display: "flex",
                                  gap: 2,
                                  alignItems: "center",
                                }}
                              >
                                <ProfilePicture
                                  size={30}
                                  data={
                                    participant.user || participant.userData
                                  }
                                />
                                {participant.user?.name ||
                                  participant.userData?.name}
                              </Box>
                            ))}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {error && <ErrorHandler callback={mutate} />}
    </motion.div>
  );
}
