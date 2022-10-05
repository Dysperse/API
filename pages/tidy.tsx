import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useState } from "react";
import { ErrorHandler } from "../components/ErrorHandler";
import { Header } from "../components/Tidy/Header";
import { useApi } from "../hooks/useApi";
import type { ApiResponse } from "../types/client";
import { Puller } from "../components/Puller";
import { colors } from "../lib/colors";
import ListItem from "@mui/material/ListItem";
import Item from "../components/ItemPopup";
import { Item as ItemType } from "@prisma/client";
import dayjs from "dayjs";
/**
 * Intro
 */
function Intro({
  setStep,
  setRoom,
}: {
  setStep: (step: number) => void;
  setRoom: (room: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            borderRadius: "20px 20px 0 0",
          },
        }}
      >
        <Puller />
        <Box
          sx={{
            p: 3,
            pt: 5,
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            Select a room
          </Typography>
          {[
            "Kitchen",
            "Bedroom",
            "Bathroom",
            "Garage",
            "Living Room",
            "Dining Room",
            "Laundry Room",
            "Storage Room",
            "Garden",
          ].map((room) => (
            <ListItem
              button
              key={room}
              onClick={() => {
                setOpen(false);
                setRoom(room);
                setTimeout(() => setStep(0), 500);
              }}
              sx={{
                mt: 1,
                borderRadius: 3,
              }}
            >
              <Typography variant="body1">{room}</Typography>
            </ListItem>
          ))}
        </Box>
      </SwipeableDrawer>

      <Box
        sx={{
          p: 3,
          background: "rgba(200,200,200,.3)",
          borderRadius: 5,
          textAlign: "center",
        }}
      >
        <picture>
          <img
            src="https://i.ibb.co/3vkN5kS/6a4b209a-ac5d-402a-9816-7bdaef7f2ce8.png"
            style={{
              maxWidth: "100%",
            }}
          />
        </picture>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Tidy
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Tidy is a tool to help you organize your home.
        </Typography>
        <Button
          size="large"
          variant="contained"
          sx={{ borderRadius: 999, mt: 2 }}
          onClick={() => setOpen(true)}
          disableElevation
          fullWidth
        >
          Select a room to organize
        </Button>
      </Box>
    </>
  );
}

function OldItems({ room }: { room: string }) {
  const { data, error } = useApi("property/inventory/list", {
    room: room.toLowerCase(),
  });

  return (
    <>
      {error && (
        <ErrorHandler
          error={"Couldn't fetch your inventory. Please try again later"}
        />
      )}
      {data &&
        data.filter((item: ItemType) => {
          return dayjs(item.lastModified).isBefore(
            dayjs().subtract(1, "month")
          );
        }).length === 0 && (
          <Box
            sx={{
              p: 3,
              mt: 2,
              background: "rgba(200,200,200,.3)",
              borderRadius: 5,
            }}
          >
            You don&apos;t have any old items in this room.
          </Box>
        )}
      {data && (
        <>
          {data
            .filter((item: ItemType) => {
              return dayjs(item.lastModified).isBefore(
                dayjs().subtract(1, "month")
              );
            })
            .map((item: ItemType) => (
              <Item data={item} />
            ))}
        </>
      )}
    </>
  );
}

/**
 * Declutter
 */
function Declutter({ room, setStep }) {
  const { error, data } = useApi("property/tidy/excess", {
    room,
    quantity: 1,
  });

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Items you might have excess of
      </Typography>
      {data && data.length == 0 && (
        <Box
          sx={{
            p: 3,
            background: "rgba(200,200,200,.3)",
            borderRadius: 5,
          }}
        >
          You don&apos;t have any excess items in this room.
        </Box>
      )}
      {data && data.map((item: ItemType) => <Item data={item} key={item.id} />)}
      {error && (
        <ErrorHandler
          error={"An error occured while trying to fetch your inventory"}
        />
      )}

      <Typography variant="h6" sx={{ my: 2, mt: 5 }}>
        Old items you haven&apos;t edited in a while
      </Typography>
      {room === "Kitchen" && (
        <Typography variant="body1" sx={{ mt: -1 }}>
          Check for expiration dates!
        </Typography>
      )}

      <OldItems room={room} />

      <Button
        size="large"
        variant="contained"
        sx={{ borderRadius: 999, mt: 2 }}
        onClick={() => setStep(1)}
        disableElevation
        fullWidth
      >
        Continue
      </Button>
    </>
  );
}
/**
 * Step content
 */
function StepContent({
  content,
  step,
  currentStep,
  setCurrentStep,
}: {
  content: JSX.Element;
  step: number;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) {
  return currentStep === step ? <Box>{content}</Box> : null;
}
/**
 * Top-level component for the maintenance page
 */
export default function Maintenance() {
  const { error, data }: ApiResponse = useApi("property/maintenance/reminders");

  const [step, setStep] = useState<number>(-1);
  const [room, setRoom] = useState<string>("");

  return (
    <Box sx={{ mb: 4 }}>
      <Header step={step} setStep={setStep} />
      <Box sx={{ p: 3 }}>
        <StepContent
          content={<Intro setRoom={setRoom} setStep={setStep} />}
          step={-1}
          currentStep={step}
          setCurrentStep={setStep}
        />
        <StepContent
          content={<Declutter room={room} setStep={setStep} />}
          step={0}
          currentStep={step}
          setCurrentStep={setStep}
        />
      </Box>
    </Box>
  );
}
