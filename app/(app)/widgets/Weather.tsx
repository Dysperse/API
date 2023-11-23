"use client";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import useLocation from "@/lib/client/useLocation";
import {
  Box,
  Icon,
  IconButton,
  Link,
  List,
  ListItem,
  Skeleton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getAirQualityInfo } from "../page";
import weatherCodes from "../tasks/Layout/widgets/weatherCodes.json";

export function Weather() {
  const hourlyRef = useRef();
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const [open, setOpen] = useState(false);
  const [locationData, setLocationData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [airQualityData, setAirQualityData] = useState<any>(null);
  const [error, setError] = useState(false);

  const isNight = () => {
    const currentHour = new Date().getHours();
    const withoutData = currentHour >= 18 || currentHour <= 6; // Assuming night is between 6 PM and 6 AM

    return weatherData
      ? !dayjs().isBetween(
          weatherData.daily.sunset[0],
          weatherData.daily.sunrise[0]
        )
      : withoutData;
  };

  const base =
    weatherCodes[weatherData?.current_weather?.weathercode]?.[
      isNight() ? "night" : "day"
    ].textColor === "#fff"
      ? `255,255,255`
      : `0,0,0`;

  const [locationStatus, requestLocation] = useLocation();

  const getWeather = useCallback(async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`)
        .then((res) => res.json())
        .then((res) => setLocationData(res));
      fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&current=pm2_5`
      )
        .then((r) => r.json())
        .then((r) => setAirQualityData(r))
        .catch((res) => setError(true));
      const getUrl = (days) =>
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=relative_humidity_2m&hourly=visibility,temperature_2m,wind_speed_10m,apparent_temperature,precipitation_probability,weathercode&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=${days}&daily=sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min`;
      const url = getUrl(1);
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          setWeatherData(res);
          const url = getUrl(10);
          fetch(url)
            .then((res) => res.json())
            .then((res) => setWeatherData(res))
            .catch((res) => setError(true));
        })
        .catch((res) => setError(true));
    });
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        document?.getElementById("activeHour")?.scrollIntoView({
          block: "start",
          inline: "center",
        });
        document.getElementById("scrollContainer")?.scrollTo({ top: 0 });
      }, 200);
    }
  }, [open]);

  useEffect(() => {
    if (locationStatus === "active") {
      getWeather();
      const interval = setInterval(getWeather, 5 * 60 * 1000); // Update every 5 minutes
      return () => clearInterval(interval);
    }
  }, [getWeather, locationStatus]);
  return weatherData && !error ? (
    <>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
        PaperProps={{
          id: "scrollContainer",
          sx: {
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              display: "none",
            },
            maxHeight: "calc(100dvh - 150px)",
            "& .MuiChip-root": {
              background: `rgba(${base},.1)`,
              color: "inherit",
              "& .MuiIcon-root": {
                color: "inherit",
              },
            },
            color:
              weatherCodes[weatherData.current_weather.weathercode][
                isNight() ? "night" : "day"
              ].textColor,
            background: `linear-gradient(${
              weatherCodes[weatherData.current_weather.weathercode][
                isNight() ? "night" : "day"
              ].backgroundGradient[0]
            },${
              weatherCodes[weatherData.current_weather.weathercode][
                isNight() ? "night" : "day"
              ].backgroundGradient[1]
            })`,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            my: 5,
          }}
        >
          <Icon sx={{ fontSize: "70px!important" }} className="outlined">
            {isNight()
              ? weatherCodes[weatherData.current_weather.weathercode].night.icon
              : weatherCodes[weatherData.current_weather.weathercode].day.icon}
          </Icon>
          <Typography variant="h2" sx={{ fontWeight: 200, ml: 2 }}>
            {-~weatherData.current_weather.temperature}&deg;
          </Typography>
          <Typography sx={{ opacity: 0.6 }}>
            {capitalizeFirstLetter(
              (isNight()
                ? weatherCodes[weatherData.current_weather.weathercode].night
                    .description
                : weatherCodes[weatherData.current_weather.weathercode].day
                    .description
              ).toLowerCase()
            )}
          </Typography>
          <Typography sx={{ opacity: 0.6 }}>
            {locationData
              ? `${
                  locationData?.address?.city || locationData?.address?.county
                }, ${locationData?.address?.state}`
              : "Loading..."}
          </Typography>
        </Box>
        <Box sx={{ px: 3 }}>
          <Grid
            container
            spacing={2}
            sx={{
              "& .card": {
                display: "flex",
                alignItems: "center",
                background: `rgba(${base},.1)`,
                borderRadius: 5,
                p: 1,
                gap: 2,
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                "& *": {
                  minWidth: 0,
                  maxWidth: "100%",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                },
                width: "100%",
                "& .MuiIcon-root": {
                  fontSize: "30px!important",
                  fontVariationSettings:
                    '"FILL" 0, "wght" 200, "GRAD" 0, "opsz" 40!important',
                },
              },
            }}
          >
            <Grid xs={6}>
              <Box className="card">
                <Icon>waving_hand</Icon>
                <Box>
                  <Typography>Feels like</Typography>
                  <Typography variant="h6">
                    {-~weatherData.hourly.apparent_temperature[dayjs().hour()]}
                    &deg;
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid xs={6}>
              <Box className="card">
                <Icon>water_drop</Icon>
                <Box>
                  <Typography>Precipitation</Typography>
                  <Typography variant="h6">
                    {Math.round(
                      weatherData.hourly.precipitation_probability[
                        dayjs().hour()
                      ]
                    )}
                    %
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid xs={6}>
              <Box className="card">
                <Icon>airwave</Icon>
                <Box>
                  <Typography>Wind</Typography>
                  <Typography variant="h6">
                    {Math.round(
                      weatherData.hourly.wind_speed_10m[dayjs().hour()]
                    )}{" "}
                    mph
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid xs={6}>
              <Box className="card">
                <Icon>visibility</Icon>
                <Box>
                  <Typography>Visibility</Typography>
                  <Typography variant="h6">
                    {Math.round(
                      weatherData.hourly.visibility[dayjs().hour()] / 1609
                    )}{" "}
                    mi
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid xs={6}>
              <Box className="card">
                <Icon>north</Icon>
                <Box>
                  <Typography>High</Typography>
                  <Typography variant="h6">
                    {-~weatherData.daily.temperature_2m_max[0]}&deg;
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid xs={6}>
              <Box className="card">
                <Icon>south</Icon>
                <Box>
                  <Typography>Low</Typography>
                  <Typography variant="h6">
                    {-~weatherData.daily.temperature_2m_min[0]}&deg;
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid xs={6}>
              <Box className="card">
                <Icon>wb_sunny</Icon>
                <Box>
                  <Typography>Sunrise</Typography>
                  <Typography variant="h6">
                    {dayjs(weatherData.daily.sunrise[0]).format("h:mm A")}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid xs={6}>
              <Box className="card">
                <Icon>wb_twilight</Icon>
                <Box>
                  <Typography>Sunset</Typography>
                  <Typography variant="h6">
                    {dayjs(weatherData.daily.sunset[0]).format("h:mm A")}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            {airQualityData ? (
              <Grid xs={12}>
                <Box className="card">
                  <Icon>eco</Icon>
                  <Box>
                    <Typography>Air quality</Typography>
                    <Typography variant="h6">
                      {
                        getAirQualityInfo(airQualityData?.current?.pm2_5)
                          ?.category
                      }{" "}
                      <span style={{ opacity: 0.5 }}>
                        — {airQualityData.current.pm2_5}
                        {airQualityData.current_units.pm2_5}
                      </span>
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() =>
                      toast(
                        getAirQualityInfo(airQualityData.current.pm2_5)
                          ?.meaning || ""
                      )
                    }
                    sx={{ background: "transparent!important", ml: "auto" }}
                  >
                    <Icon
                      sx={{
                        color:
                          weatherCodes[weatherData.current_weather.weathercode][
                            isNight() ? "night" : "day"
                          ].textColor,
                      }}
                    >
                      help
                    </Icon>
                  </IconButton>
                </Box>
              </Grid>
            ) : (
              <Skeleton variant="rectangular" height={80} />
            )}
          </Grid>
          <Typography
            sx={{
              mt: 2,
              mb: 1,
              textTransform: "uppercase",
              fontWeight: "900",
              fontSize: "13px",
              opacity: 0.6,
            }}
          >
            Hourly
          </Typography>
          <Box
            sx={{
              borderRadius: 5,
              background: `rgba(${base},.1)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <SparkLineChart
              data={weatherData.hourly.temperature_2m.slice(0, 24)}
              height={100}
              curve="natural"
              area
              colors={[`rgb(${base})`]}
              margin={{ bottom: 0, left: 0, right: 0, top: 0 }}
              sx={{
                border: 0,
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                opacity: 0.1,
              }}
            />
            <Box
              sx={{
                overflow: "scroll",
                display: "flex",
                alignItems: "center",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                width: "100%",
                gap: 2,
                px: 0.8,
              }}
              ref={hourlyRef}
            >
              {weatherData.hourly.temperature_2m.slice(0, 24).map((temp, i) => (
                <Box
                  key={i}
                  {...(i === dayjs().hour() && { id: "activeHour" })}
                  sx={{
                    flexShrink: 0,
                    px: 2,
                    py: 1,
                    borderRadius: 5,
                    width: "70px",
                    display: "flex",
                    flexDirection: "column",
                    alignItem: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    ...(i === dayjs().hour() && {
                      background: `rgba(${base},.15)`,
                    }),
                  }}
                >
                  <Typography>
                    <Icon>
                      {
                        weatherCodes[weatherData.hourly.weathercode[i]][
                          isNight() ? "night" : "day"
                        ].icon
                      }
                    </Icon>
                  </Typography>
                  <Typography>{-~temp}&deg;</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.6,
                      textTransform: "uppercase",
                      fontWeight: 900,
                    }}
                  >
                    {dayjs().startOf("day").add(i, "hours").format("hA")}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Typography
            sx={{
              mt: 2,
              mb: 1,
              textTransform: "uppercase",
              fontWeight: "900",
              fontSize: "13px",
              opacity: 0.6,
            }}
          >
            Daily
          </Typography>
          <List
            sx={{
              background: `rgba(${base},.1)`,
              borderRadius: 5,
              mb: 2,
            }}
          >
            {weatherData.daily.weather_code.slice(1).map((code, i) => (
              <ListItem
                key={code}
                sx={{
                  "&:not(:last-child)": {
                    borderBottom: `1px solid rgba(${base},.1)`,
                  },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{ fontWeight: "900", opacity: 0.6, mr: "auto" }}
                >
                  {dayjs()
                    .startOf("day")
                    .add(i + 1, "day")
                    .format("ddd")}
                </Typography>
                {-~weatherData.daily.temperature_2m_min[i + 1]}
                {" - "}
                {-~weatherData.daily.temperature_2m_max[i + 1]}&deg;
                <Icon className="outlined">
                  {isNight()
                    ? weatherCodes[code].night.icon
                    : weatherCodes[code].day.icon}
                </Icon>
              </ListItem>
            ))}
          </List>
        </Box>
      </SwipeableDrawer>
      <Box
        sx={{
          position: "relative",
          p: 2,
          height: "130px",
        }}
        className="card"
        onMouseDown={() => setOpen(true)}
      >
        <Icon sx={{ fontSize: "40px!important" }} className="outlined">
          {isNight()
            ? weatherCodes[weatherData.current_weather.weathercode].night.icon
            : weatherCodes[weatherData.current_weather.weathercode].day.icon}
        </Icon>
        <Typography sx={{ ml: 0.2 }} variant="h5" noWrap>
          {-~weatherData.current_weather.temperature}&deg;
        </Typography>
        <Typography sx={{ ml: 0.2 }} variant="body2" noWrap>
          {isNight()
            ? weatherCodes[weatherData.current_weather.weathercode].night
                .description
            : weatherCodes[weatherData.current_weather.weathercode].day
                .description}
        </Typography>
      </Box>
    </>
  ) : (locationStatus === "active" || locationStatus === "unknown") &&
    !error ? (
    <Skeleton variant="rectangular" height={130} />
  ) : (
    <Box
      onClick={requestLocation}
      sx={{
        position: "relative",
        p: 2,
        borderRadius: 5,
        background: palette[3],
        color: palette[11],
        height: "130px",
      }}
    >
      <Icon sx={{ fontSize: "40px!important" }} className="outlined">
        {error
          ? "near_me_disabled"
          : locationStatus === "pending"
          ? "near_me"
          : locationStatus === "failed"
          ? "near_me_disabled"
          : ""}
      </Icon>
      <Typography sx={{ ml: 0.2 }} variant="h5" noWrap>
        Weather
      </Typography>
      <Typography sx={{ ml: 0.2 }} variant="body2">
        {error ? (
          "Something went wrong"
        ) : locationStatus === "pending" ? (
          "Tap to enable"
        ) : locationStatus === "failed" ? (
          <span style={{ textTransform: "none" }}>
            Blocked -{" "}
            <Link
              onClick={() =>
                alert(
                  "Your device has blocked location access. To fix this, go to your site settings and allow location access."
                )
              }
            >
              See why
            </Link>
          </span>
        ) : (
          ""
        )}
      </Typography>
    </Box>
    // <Skeleton variant="rectangular" width="100%" height={130} />
  );
}
