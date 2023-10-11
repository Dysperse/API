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
  const { session } = useSession();

  const palette = useColor(
    session?.themeColor || color,
    useDarkMode(session?.darkMode || "system")
  );

  const makeid = (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };
  const id1 = makeid(5);
  const id2 = makeid(5);

  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      style={style}
      className="logo"
      version="1"
      viewBox="0 0 375 375"
      fill={palette[intensity]}
    >
      <defs>
        <clipPath id={id1}>
          <path d="M37.5 37.5h300.75v300.75H37.5zm0 0"></path>
        </clipPath>
        <clipPath id={id2}>
          <path
            d="M187.875 37.5c0 83.05 67.324 150.375 150.375 150.375-83.05 0-150.375 67.324-150.375 150.375 0-83.05-67.324-150.375-150.375-150.375 83.05 0 150.375-67.324 150.375-150.375zm0 0"
            clipRule="evenodd"
          ></path>
        </clipPath>
      </defs>
      <g clipPath={`url(#${id1})`}>
        <g clipPath={`url(#${id2})`}>
          <path d="M338.25 37.5H37.5v300.75h300.75zm0 0"></path>
        </g>
      </g>
    </svg>
  );
}
