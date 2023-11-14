import { useEffect, useState } from "react";

type LocationStatus = "pending" | "active" | "failed" | "unsupported";

const useLocation = (): [LocationStatus, () => void] => {
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("pending");

  const requestLocation = async () => {
    // Check if the browser supports the Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          // Access the latitude and longitude from the position object
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Now you can use the latitude and longitude as needed
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

          // Update location status to "active" upon successful retrieval
          setLocationStatus("active");
        },
        function (error) {
          // Handle errors (e.g., user denied location access)
          console.error(`Error getting location: ${error.message}`);

          // Update location status to "failed" if there is an error
          setLocationStatus("failed");
        }
      );
    } else {
      // Browser doesn't support Geolocation API
      console.error("Geolocation is not supported by your browser");

      // Update location status to "unsupported" if the API is not supported
      setLocationStatus("unsupported");
    }
  };
  // useEffect to automatically request location if enabled
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          if (permissionStatus.state === "granted") {
            // Location is enabled, automatically fetch
            requestLocation();
          }
          // Otherwise, wait for the user to click the button
        });
    }
  }, []);

  return [locationStatus, requestLocation];
};

export default useLocation;
