import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";

interface LogoProps {
  intensity?: number | string;
  size?: number | string;
  onClick?: () => void;
  color?: string;
  style?: any;
}

export function Logo({
  intensity = 7,
  size = 45,
  onClick = () => {},
  color = "violet",
  style = {},
}: LogoProps) {
  const session = useSession();

  const palette = useColor(
    session?.session?.themeColor || color,
    useDarkMode(session?.session?.darkMode || "system")
  );

  return (
    <svg
      id="Layer_1"
      className="logo"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      width={size}
      height={size}
      style={{ ...style, padding: "5px" }}
      fill={palette[intensity]}
      viewBox={`0 0 1000 1000`}
    >
      <path
        className="cls-1"
        d="m500,978.06q0-373.12,0,0c-57.96-373.12-104.94-420.1-478.06-478.06q373.12,0,0,0c373.12-57.96,420.1-104.94,478.06-478.06q0,373.12,0,0c57.96,373.12,104.94,420.1,478.06,478.06q-373.12,0,0,0c-373.12,57.96-420.1,104.94-478.06,478.06Z"
      />
    </svg>
  );
}
