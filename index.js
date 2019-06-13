window.addEventListener('load', () => {
  navigator.geolocation.watchPosition(
    position => document.body.textContent += `${new Date(position.timestamp).toLocaleTimeString()} | ${position.coords.longitude}, ${position.coords.latitude} (${position.coords.accuracy} %) | ${position.coords.altitude} (${position.coords.altitudeAccuracy}) | ${position.coords.heading} | ${position.coords.speed} \n`,
    error => alert(error),
    { enableHighAccuracy: true },
  );
});
