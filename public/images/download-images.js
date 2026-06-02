const fs = require('fs');
const path = require('path');
const http = require('https');

// Alle Bildnamen aus deiner SQL-Liste
const images = [
  'headphones-1.jpg', 'headphones-2.jpg', 'headphones-3.jpg', 'tv-1.jpg', 'tv-2.jpg',
  'watch-1.jpg', 'watch-2.jpg', 'speaker-1.jpg', 'speaker-2.jpg', 'keyboard-1.jpg',
  'keyboard-2.jpg', 'mouse-1.jpg', 'mouse-2.jpg', 'stand-1.jpg', 'hub-1.jpg', 'hub-2.jpg',
  'webcam-1.jpg', 'chair-1.jpg', 'chair-2.jpg', 'monitor-1.jpg', 'ssd-1.jpg', 'ssd-2.jpg',
  'smart-1.jpg', 'powerbank-1.jpg', 'drone-1.jpg', 'drone-2.jpg', 'fitness-1.jpg',
  'router-1.jpg', 'docking-1.jpg', 'vr-1.jpg', 'ereader-1.jpg', 'actioncam-1.jpg',
  'plug-1.jpg', 'charger-1.jpg', 'stand-2.jpg', 'mic-1.jpg', 'deck-1.jpg', 'psu-1.jpg',
  'cooler-1.jpg', 'fan-1.jpg', 'holder-1.jpg', 'cable-1.jpg', 'cleaner-1.jpg'
];

const targetDir = path.join(__dirname, 'public', 'images');

// Ordner erstellen, falls er nicht existiert
if (!fs.existsSync(targetDir)){
    fs.mkdirSync(targetDir, { recursive: true });
}

console.log("Starte Download der Produktbilder...");

images.forEach((img, index) => {
  const file = fs.createWriteStream(path.join(targetDir, img));
  // Wir nutzen loremflickr für thematisch zufällige Technik-Bilder
  const url = `https://loremflickr.com/640/480/tech,gadget,electronics/all?lock=${index}`;
  
  http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`✓ Heruntergeladen: ${img}`);
    });
  }).on('error', (err) => {
    fs.unlink(path.join(targetDir, img));
    console.error(`X Fehler bei ${img}:`, err.message);
  });
});