export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationData = {
            type: "Point",
            coordinates: [longitude, latitude],
          };
          resolve(locationData); // Resolve with location data
        },
        (err) => {
          reject("Error getting location: " + err.message); // Reject with error message
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
};
