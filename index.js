window.addEventListener('load', () => {
  const mapCanvas = document.getElementById('mapCanvas');
  const context = mapCanvas.getContext('2d');

  navigator.geolocation.watchPosition(
    position => {
      const timestamp = new Date(position.timestamp);
      const { longitude, latitude, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;

      const recordDiv = document.createElement('div');
      recordDiv.textContent = `${timestamp.toLocaleTimeString()} | ${longitude.toFixed(4)}, ${latitude.toFixed(4)} (${accuracy} %)${altitude ? ' | ' + altitude.toFixed(2) : ''}${altitudeAccuracy ? ` (${altitudeAccuracy} %)` : ''}${heading ? ' | ' + heading : ''} ${speed ? ' | ' + speed : ''}`;
      document.body.append(recordDiv);

      const z = 18;
      const x = (longitude + 180) / 360 * Math.pow(2, z);
      const y = (1 - Math.log(Math.tan(latitude * Math.PI / 180) + 1 / Math.cos(latitude * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z);

      const tileImage = new Image();
      tileImage.addEventListener('load', () => {
        context.drawImage(tileImage, 0, 0);
        context.fillStyle = 'rgba(0, 0, 255, .1)';
        context.beginPath();
        context.arc((x % 1) * mapCanvas.width, (y % 1) * mapCanvas.height, (100 / accuracy) * z, 0, 2 * Math.PI);
        context.fill();
      });
      tileImage.addEventListener('error', () => {
        context.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
        context.fillText('Failed to load the tile', 10, 20);
      });
      tileImage.src = `https://maps.wikimedia.org/osm-intl/${z}/${Math.floor(x)}/${Math.floor(y)}.png`;
    },
    error => alert(error.code + ' ' + error.message),
    { enableHighAccuracy: true },
  );
});
