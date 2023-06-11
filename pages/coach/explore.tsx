import { CreateGoal } from "@/components/Coach/Goal/Create/Custom";
import { ExploreGoalCard } from "@/components/Coach/Goal/Create/card";
import {
  categories,
  goals,
} from "@/components/Coach/Goal/Create/goalTemplates";
import { fetchRawApi } from "@/lib/client/useApi";
import { Masonry } from "@mui/lab";
import { Box, Button, Icon, Typography } from "@mui/material";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const [view, setView] = useState("Goals");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const d = await fetchRawApi("ai/routine", {
        month: dayjs().format("MMMM"),
      });
      setData(d);
    })();
  }, []);

  const shuffled = useMemo(() => goals.sort(() => Math.random() - 0.5), []);

  return (
    <>
      <Head>
        <title>Explore &bull; Coach</title>
      </Head>
      <Box sx={{ p: { xs: 2, sm: 4 } }}>
        <Link href="/coach">
          <Button size="small" variant="contained" sx={{ mb: 5 }}>
            <Icon>west</Icon>
            Back
          </Button>
        </Link>
        <Box
          sx={{
            px: { xs: 1, sm: 2 },
          }}
        >
          <CreateGoal />
          <Typography
            variant="h4"
            sx={{
              mb: { xs: 2, sm: 4 },
              mt: 3,
              fontSize: { xs: 25, sm: 30 },
            }}
          >
            Freshly picked for you
          </Typography>
          <Box sx={{ mr: -2 }}>
            <Masonry spacing={2} columns={{ xs: 1, sm: 2, md: 3 }}>
              {shuffled.slice(0, 6).map((goal, index) => (
                <ExploreGoalCard key={index} goal={goal} />
              ))}
            </Masonry>
          </Box>

          {categories.map((category) => (
            <Box
              key={category}
              sx={{
                px: { xs: 1, sm: 2 },
              }}
            >
              <Typography
                variant="h4"
                sx={{ mb: 4, mt: 3, fontSize: { xs: 30, sm: 30 } }}
              >
                {category}
              </Typography>
              <Box sx={{ mr: -2 }}>
                <Masonry spacing={2} columns={{ xs: 1, sm: 2, md: 3 }}>
                  {shuffled
                    .filter((goal) => goal.category === category)
                    .map((goal, index) => (
                      <ExploreGoalCard key={index} goal={goal} />
                    ))}
                </Masonry>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ mb: 4, display: "block" }} />
      &nbsp;
    </>
  );
}
