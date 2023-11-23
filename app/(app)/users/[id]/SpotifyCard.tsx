import { fetcher } from "@/app/(app)/fetcher";
import { Box, Icon, LinearProgress, Skeleton, Typography } from "@mui/material";
import Image from "next/legacy/image";
import useSWR from "swr";

export function SpotifyCard({
  styles,
  email,
  profile,
  hideIfNotPlaying = false,
  open = false,
}: any) {
  const { data, isLoading, error } = useSWR(
    [
      "user/spotify/currently-playing",
      { spotify: JSON.stringify(profile.spotify), email },
    ],
    fetcher,
    { refreshInterval: 1000 }
  );

  if (error) return <div></div>;
  if (hideIfNotPlaying && !data?.item) return null;

  return (
    <Box
      sx={{
        ...styles,
        background: "#1db954",
        position: "relative",
        color: "#fff",
        cursor: "pointer",
        transition: "transform .2s",
        "&:hover": {
          transform: "scale(1.02)",
        },
        "&:active": {
          transform: "scale(.95)",
        },
      }}
      onClick={() =>
        window.open(
          data?.item?.external_urls?.spotify || "https://open.spotify.com"
        )
      }
    >
      {data?.item ? (
        <>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              maxWidth: "100%",
            }}
          >
            <picture>
              <img
                src={data?.item?.album.images[0].url}
                alt="Spotify album cover"
                style={{ width: "100%", display: "block" }}
              />
            </picture>

            <picture>
              <Image
                src="/images/integrations/spotify.png"
                width={45}
                height={45}
                alt="Spotify"
              />
            </picture>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              overflow: "hidden",
            }}
          >
            <Icon className="outlined" sx={{ fontSize: "40px!important" }}>
              {data.is_playing ? "pause_circle_filled" : "play_circle"}
            </Icon>
            <Box sx={{ flexGrow: 1, maxWidth: "100%", minWidth: 0, mt: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {data.item.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {data.item.artists.map((artist) => artist.name).join(", ")}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(data.progress_ms / data.item.duration_ms) * 100}
                sx={{
                  height: 10,
                  borderRadius: 99,
                  background: "rgba(255, 255, 255, 0.2)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 99,
                    background: "#fff",
                  },
                }}
              />
            </Box>
          </Box>
        </>
      ) : !data ||
        (data && (isLoading || data?.currently_playing_type === "ad")) ? (
        <>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  aspectRatio: "1 / 1",
                  width: "100%",
                  background: "rgba(255,255,255,.2)",
                }}
              />
            </Box>

            <Image
              src="/images/integrations/spotify.png"
              width={45}
              height={45}
              alt="Spotify"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              pl: 0.5,
              mt: 1,
              mb: -1,
              overflow: "hidden",
            }}
          >
            <Skeleton
              animation={false}
              variant="circular"
              width={32}
              height={32}
              sx={{ mt: 2.5 }}
            />
            <Box sx={{ flexGrow: 1, maxWidth: "100%", minWidth: 0, ml: -0.5 }}>
              <Skeleton animation={false} width="50%" height={50} />
              <Skeleton animation={false} width="80%" sx={{ mt: -0.5 }} />
              <Skeleton animation={false} width="100%" sx={{ mt: -0.5 }} />
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Not playing
            </Typography>

            <Image
              src="/images/integrations/spotify.png"
              width={45}
              height={45}
              alt="Spotify"
            />
          </Box>
        </>
      )}
    </Box>
  );
}
