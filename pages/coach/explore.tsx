import { CreateGoal } from "@/components/Coach/Goal/Create/Custom";
import { ExploreGoalCard } from "@/components/Coach/Goal/Create/card";
import {
  categories,
  goals,
} from "@/components/Coach/Goal/Create/goalTemplates";
import { Masonry } from "@mui/lab";
import {
  AppBar,
  Box,
  Icon,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";

export default function Page() {
  const shuffled = useMemo(() => goals.sort(() => Math.random() - 0.5), []);

  return (
    <motion.div initial={{ x: 100 }} animate={{ x: 0 }}>
      <Head>
        <title>Explore &bull; Coach</title>
      </Head>
      <AppBar sx={{ border: 0, position: "fixed", top: 0, left: 0 }}>
        <Toolbar>
          <Link href="/coach">
            <IconButton>
              <Icon>arrow_back_ios_new</Icon>
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: { xs: 2, sm: 4 } }}>
        <Box
          sx={{
            px: { xs: 1, sm: 2 },
            pt: { xs: 8 },
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
    </motion.div>
  );
}
