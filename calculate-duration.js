const fs = require("fs");
const path = require("path");

// Function to calculate duration using file size and bitrate estimation
function calculateDuration(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;

    // MP3 files typically have a bitrate around 128-320 kbps
    // Let's use 192 kbps as an average estimate
    const bitrateInBitsPerSecond = 192 * 1000;
    const durationInSeconds = (fileSizeInBytes * 8) / bitrateInBitsPerSecond;

    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    return {
      durationInSeconds: Math.round(durationInSeconds),
      formattedDuration: `${minutes}:${seconds.toString().padStart(2, "0")}`,
      fileSizeInMB: (fileSizeInBytes / (1024 * 1024)).toFixed(2),
    };
  } catch (error) {
    console.error("Error calculating duration:", error);
    return null;
  }
}

// Calculate duration for bevacqua.mp3
const filePath = path.join(__dirname, "public", "audio", "bevacqua.mp3");
const result = calculateDuration(filePath);

if (result) {
  console.log("Bevacqua.mp3 Duration Analysis:");
  console.log(`File size: ${result.fileSizeInMB} MB`);
  console.log(`Estimated duration: ${result.durationInSeconds} seconds`);
  console.log(`Formatted duration: ${result.formattedDuration}`);
  console.log(`Current duration in config: 76 seconds (1:16)`);
  console.log(`Difference: ${result.durationInSeconds - 76} seconds`);
} else {
  console.log("Could not calculate duration");
}
