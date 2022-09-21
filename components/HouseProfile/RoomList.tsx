import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import useEmblaCarousel from "embla-carousel-react";
import React, { useCallback } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { ApiResponse } from "../../types/client";
import type { Room as RoomType } from "../../types/room";
import IconButton from "@mui/material/IconButton";

/**
 * Room card
 * @param room Room details
 * @returns JSX.Element
 */
function Room({ color, room }: { color: string; room: RoomType }): JSX.Element {
  const [deleted, setDeleted] = React.useState<boolean>(false);

  return deleted ? (
    <>This room has been deleted</>
  ) : (
    <>
      <Typography
        sx={{
          fontWeight: "600",
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {room.name}
      </Typography>
      <Button
        variant="outlined"
        sx={{
          borderWidth: "2px!important",
          width: "100%",
          mt: 1.5,
          color: colors[color][900],
          "&:not(.MuiLoadingButton-loading, .Mui-disabled)": {
            borderColor: `${colors[color][900]}!important`,
          },
          borderRadius: 4,
        }}
        disabled={global.property.role === "read-only"}
        onClick={() => {
          if (
            confirm(
              "Delete this room including the items in it? This action is irreversible."
            )
          ) {
            setDeleted(true);
            fetchApiWithoutHook("property/rooms/delete", {
              id: room.id.toString(),
            })
              .then(() => toast.success("Room deleted!"))
              .catch(() => {
                toast.error("Failed to delete room");
                setDeleted(false);
                mutate(
                  `/api/property/rooms?${new URLSearchParams({
                    property: global.property.propertyId,
                    accessToken: global.property.accessToken,
                  }).toString()}`
                );
              });
          }
        }}
      >
        Delete
      </Button>
    </>
  );
}
/**
 * Room list popup found in house profile
 * @param color Theme color of home
 */
export function RoomList({ color }: any) {
  const wheelGestures = WheelGesturesPlugin();
  const trigger = useMediaQuery("(max-width: 600px)");
  const { data }: ApiResponse = useApi("property/rooms");
  const [emblaRef, emblaApi]: any = useEmblaCarousel(
    {
      dragFree: true,
      slidesToScroll: trigger ? 2 : 2,
    },
    [wheelGestures]
  );

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );

  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const images = data
    ? [
        ...data.map((room: RoomType) => {
          return {
            content: <Room color={color} room={room} />,
          };
        }),
      ]
    : [];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.5,
        alignItems: "center",
      }}
    >
      {!trigger && (
        <IconButton
          onClick={scrollPrev}
          sx={{
            background: `${colors[color][100]}!important`,
            color: `${colors[color][900]}!important`,
          }}
        >
          <span className="material-symbols-rounded">chevron_left</span>
        </IconButton>
      )}
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {images.length === 0 ? (
            <Box
              className="embla__slide"
              sx={{
                p: 0.5,
                flex: "0 0 100%",
                userSelect: "none",
                borderRadius: 5,
                background: colors[color][100],
              }}
            >
              You haven&apos;t created any rooms yet
            </Box>
          ) : (
            images.map((step, index) => (
              <Box
                key={Math.random().toString()}
                className="embla__slide"
                sx={{
                  pl: index == 0 ? 0 : 2,
                  flex: "0 0 50%",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    userSelect: "none",
                    px: 2.5,
                    borderRadius: 5,
                    background: global.user.darkMode
                      ? "hsl(240, 11%, 30%)"
                      : colors[color][100],
                  }}
                >
                  {step.content}
                </Box>
              </Box>
            ))
          )}
        </div>
      </div>
      {!trigger && (
        <IconButton
          onClick={scrollNext}
          sx={{
            background: `${colors[color][100]}!important`,
            color: `${colors[color][900]}!important`,
          }}
        >
          <span className="material-symbols-rounded">chevron_right</span>
        </IconButton>
      )}
    </Box>
  );
}
