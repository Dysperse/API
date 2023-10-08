import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { cloneElement, useEffect, useState } from "react";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";
import weatherCodes from "./weatherCodes.json";

export function WeatherWidget({ children }) {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);

  const [open, setOpen] = useState(false);
  const [locationData, setLocationData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);

  const trigger = cloneElement(children, {
    onClick: () => setOpen((s) => !s),
    ...(open && { "data-active": true }),
  });

  const isNight = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 18 || currentHour <= 6; // Assuming night is between 6 PM and 6 AM
  };

  const getWeather = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`)
        .then((res) => res.json())
        .then((res) => setLocationData(res));
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,apparent_temperature,weathercode&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=1`
      ).then((res) => res.json());
      setWeatherData(res);
    });
  };

  useEffect(() => {
    if (open) {
      getWeather();
      const interval = setInterval(getWeather, 5 * 60 * 1000); // Update every 5 minutes
      return () => clearInterval(interval);
    }
  }, [open]);

  return (
    <>
      {trigger}

      {open && (
        <Box
          className="drag-widget"
          sx={{
            zIndex: 999,
            position: "fixed",
            bottom: "40px",
            left: "40px",
          }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Box
              onClick={getWeather}
              sx={{
                borderRadius: 5,
                overflow: "hidden",
                position: "relative",
                p: 3,
                width: "300px",
                maxWidth: "300px",
                minWidth: "300px",
                "& .close": {
                  display: "none",
                },
                "&:hover .close": {
                  display: "flex",
                },
                background: palette[3],
                ...(weatherData && {
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
                }),
              }}
            >
              <IconButton
                onClick={() => {
                  setOpen(false);
                  setWeatherData(null);
                }}
                className="close"
                sx={{
                  position: "absolute",
                  top: 0,
                  color: "#fff!important",
                  background: "rgba(255,255,255,.1)!important",
                  ...(weatherData &&
                    weatherCodes[weatherData.current_weather.weathercode][
                      isNight() ? "night" : "day"
                    ].textColor == "#000" && {
                      color: "#000!important",
                      background: "rgba(0,0,0,.1)!important",
                    }),
                  right: 0,
                  m: 1,
                }}
                size="small"
              >
                <Icon>close</Icon>
              </IconButton>
              <Typography
                sx={{ display: "flex", gap: 2, alignItems: "center" }}
              >
                <Icon className="outlined">location_on</Icon>
                <span>
                  {locationData
                    ? `${locationData?.address?.city}, ${locationData?.address?.state}`
                    : "Loading..."}
                </span>
              </Typography>
              {!weatherData ? (
                <CircularProgress sx={{ mt: 2 }} />
              ) : (
                <>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        variant="h1"
                        className="font-heading"
                        flexGrow={1}
                      >
                        {weatherData.current_weather.temperature}°
                      </Typography>

                      <img
                        src={
                          isNight()
                            ? weatherCodes[
                                weatherData.current_weather.weathercode
                              ].night.image
                            : weatherCodes[
                                weatherData.current_weather.weathercode
                              ].day.image
                        }
                        style={{
                          ...(weatherCodes[
                            weatherData.current_weather.weathercode
                          ][isNight() ? "night" : "day"].textColor ==
                            "#000" && {
                            filter: "invert(1)",
                          }),
                        }}
                        alt="Weather Icon"
                      />
                    </Box>
                  </motion.div>
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Typography variant="h6">
                      {isNight()
                        ? weatherCodes[weatherData.current_weather.weathercode]
                            .night.description
                        : weatherCodes[weatherData.current_weather.weathercode]
                            .day.description}{" "}
                      &bull; Feels like{" "}
                      {Math.round(
                        weatherData.hourly.apparent_temperature[dayjs().hour()]
                      )}
                      &deg;
                    </Typography>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    transition={{ delay: 1 }}
                    animate={{ opacity: 1 }}
                  >
                    <Sparklines
                      data={weatherData.hourly.temperature_2m}
                      style={{
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                        zIndex: 0,
                        opacity: 0.2,
                        width: "100%",
                      }}
                    >
                      <SparklinesSpots style={{ display: "none" }} />
                      <SparklinesLine
                        style={{
                          fill: weatherCodes[
                            weatherData.current_weather.weathercode
                          ][isNight() ? "night" : "day"].textColor,
                          strokeWidth: 2,
                        }}
                        color={
                          weatherCodes[weatherData.current_weather.weathercode][
                            isNight() ? "night" : "day"
                          ].textColor
                        }
                      />
                    </Sparklines>
                  </motion.div>
                </>
              )}
            </Box>
          </motion.div>
        </Box>
      )}
    </>
  );
}
