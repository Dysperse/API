"use client";
import { ErrorHandler } from "@/components/Error";
import { useSession } from "@/lib/client/session";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from "@mui/lab";
import { Box, CircularProgress, Typography } from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";
import { SpacesLayout } from "../SpacesLayout";

export default function Page() {
  const { session } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id } = params as any;

  const { error, data } = useSWR([
    "space/inbox",
    {
      params: {
        propertyId: id,
      },
    },
  ]);

  const parentRef = useRef();

  return (
    <SpacesLayout title="Changelog" parentRef={parentRef}>
      {error && <ErrorHandler />}
      {data ? (
        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {data && (
            <Virtuoso
              customScrollParent={parentRef?.current}
              style={{ height: "400px", width: "100%" }}
              totalCount={data.length}
              itemContent={(index) => (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <TimelineItem key={data[index].id}>
                    <TimelineSeparator>
                      <TimelineDot />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography gutterBottom>
                        <b>
                          {data[index].who === session.user.name
                            ? "You"
                            : data[index].who}
                        </b>{" "}
                        {data[index].what}
                      </Typography>
                      <Typography variant="body2">
                        {dayjs(data[index].when).fromNow()}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                </motion.div>
              )}
            />
          )}
        </Timeline>
      ) : (
        <CircularProgress />
      )}
      {data?.length === 0 && <Box>No changes made yet!</Box>}
    </SpacesLayout>
  );
}
