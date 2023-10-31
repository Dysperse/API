import { violetDark } from "@radix-ui/colors";
import { ImageResponse } from "@vercel/og";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);

export const runtime = "edge";

export default async function handler(req) {
  const id = req.nextUrl.search.split("?id=")[1];
  const hostname = req.headers.get("x-forwarded-host");
  const url = `https://${hostname}/api/availability/event?id=${id}&basic=true`;

  const res = await fetch(url).then((res) => res.json());

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          flexDirection: "column",
          fontFamily: "'Georgia', serif",
          padding: "80px",
          justifyContent: "center",
          letterSpacing: "-.02em",
          fontWeight: 700,
          color: violetDark["violet11"],
          background: violetDark["violet3"],
        }}
      >
        <div
          style={{
            right: 42,
            top: 42,
            position: "absolute",
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={70}
            height={70}
            className="logo"
            version="1"
            viewBox="0 0 375 375"
            fill={violetDark["violet6"]}
          >
            <defs>
              <clipPath id="963808ace8">
                <path d="M37.5 37.5h300.75v300.75H37.5zm0 0"></path>
              </clipPath>
              <clipPath id="f8e32d0f6d">
                <path
                  d="M187.875 37.5c0 83.05 67.324 150.375 150.375 150.375-83.05 0-150.375 67.324-150.375 150.375 0-83.05-67.324-150.375-150.375-150.375 83.05 0 150.375-67.324 150.375-150.375zm0 0"
                  clipRule="evenodd"
                ></path>
              </clipPath>
            </defs>
            <g clipPath="url(#963808ace8)">
              <g clipPath="url(#f8e32d0f6d)">
                <path d="M338.25 37.5H37.5v300.75h300.75zm0 0"></path>
              </g>
            </g>
          </svg>
        </div>
        <div
          style={{
            background: violetDark["violet3"],
            fontSize: "100px",
            whiteSpace: "nowrap",
            maxWidth: "1000px",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {`${res.name}`}
        </div>
        <div
          style={{
            background: violetDark["violet3"],
            fontSize: "27px",
            maxWidth: "800px",
            textAlign: "center",
            marginTop: "-3px",
            marginBottom: "7px",
          }}
        >
          {`When are you free from 
          ${dayjs(res.startDate).format("MMM Do")} to 
          ${dayjs(res.endDate).format("MMM Do")}?`}
        </div>
        <div
          style={{
            padding: "7px 25px",
            background: violetDark["violet5"],
            fontSize: "20px",
            marginTop: "10px",
            borderRadius: "999px",
          }}
        >
          Tap to fill in your availability
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
