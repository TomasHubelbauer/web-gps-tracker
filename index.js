window.addEventListener('load', () => {
  const mapCanvas = document.getElementById('mapCanvas');
  const context = mapCanvas.getContext('2d');

  navigator.geolocation.watchPosition(
    position => {
      const recordDiv = document.createElement('div');
      recordDiv.textContent = `${new Date(position.timestamp).toLocaleTimeString()} | ${position.coords.longitude.toFixed(4)}, ${position.coords.latitude.toFixed(4)} (${position.coords.accuracy} %) | ${position.coords.altitude.toFixed(2)} (${position.coords.altitudeAccuracy} $) | ${position.coords.heading || ''} | ${position.coords.speed || ''} \n`;
      document.body.append(recordDiv);

      const z = 18;
      const x = (position.coords.longitude + 180) / 360 * Math.pow(2, z);
      const y = (1 - Math.log(Math.tan(position.coords.latitude * Math.PI / 180) + 1 / Math.cos(position.coords.latitude * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z);

      const tileImage = new Image();
      tileImage.addEventListener('load', () => {
        context.drawImage(tileImage, 0, 0);
        context.fillStyle = 'rgba(0, 0, 255, .1)';
        context.beginPath();
        context.arc((x % 1) * mapCanvas.width, (y % 1) * mapCanvas.height, (100 / position.coords.accuracy) * z, 0, 2 * Math.PI);
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
