import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import toast from "react-hot-toast";

export function ParticipantMissingError({ userData, id, mutate }) {
  const { session } = useSession();
  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await fetch(
        "/api/availability/event/add-participant?" +
          new URLSearchParams({
            isAuthenticated: String(!!session),
            ...(session
              ? {
                  email: session?.user?.email,
                }
              : {
                  userData: JSON.stringify(userData),
                }),
            eventId: id,
          })
      );
      await mutate();
    } catch (e) {
      toast.error("Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <LoadingButton
      loading={loading}
      onClick={handleSubmit}
      sx={{
        position: "absolute",
        top: { xs: "100px", sm: "50%" },
        left: "50%",
        transform: {
          xs: "translateX(-50%)",
          sm: "translate(-50%, -50%)",
        },
        background: palette[5] + "!important",
        zIndex: 999,
      }}
    >
      Add your availability
    </LoadingButton>
  );
}
