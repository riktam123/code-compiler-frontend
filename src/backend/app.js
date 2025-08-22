require('dotenv').config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const sharp = require("sharp");
const { DetectFacesCommand } = require("@aws-sdk/client-rekognition");
const rekognitionClient = require("./config/aws.recognization");

const app = express();
const PORT = process.env.PORT || 5100;

app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

async function detectCandidateFace(imageBuffer) {
  const params = {
    Image: { Bytes: imageBuffer },
  };

  const command = new DetectFacesCommand(params);
  const data = await rekognitionClient.send(command);

  if (data.FaceDetails && data.FaceDetails.length > 0) {
    const largestFace = data.FaceDetails.sort(
      (a, b) =>
        b.BoundingBox.Width * b.BoundingBox.Height -
        a.BoundingBox.Width * a.BoundingBox.Height
    )[0];
    console.log("Largest face detected:", largestFace);
    return largestFace;
  } else {
    console.log("No faces detected.");
    return null;
  }
}

async function blurEntireImage(imageBuffer, faceDetails) {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();

  // If a face is detected, process it
  if (faceDetails) {
    const { Left, Top, Width, Height } = faceDetails.BoundingBox;
    const left = Math.round(Left * metadata.width);
    const top = Math.round(Top * metadata.height);
    const width = Math.round(Width * metadata.width);
    const height = Math.round(Height * metadata.height);

    console.log("Face Coordinates:", { left, top, width, height });

    // Extract the face region, apply blur to it
    const blurredFace = await image
      .extract({ left, top, width, height }) // Extract face region
      .blur(10) // Apply blur only to the face
      .toBuffer();

    // Recompose the image with the blurred face and keep the rest of the image intact
    const finalImage = await image
      .composite([{ input: blurredFace, top, left }]) // Overlay the blurred face on original image
      .toBuffer(); // Ensure the full image is returned

    return finalImage;
  }

  // If no face is detected, simply return the original image (the full resume)
  return imageBuffer; // Return the full image (resume) without modification
}

app.post("/api/blur", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageBuffer = req.file.buffer;

    const candidateFace = await detectCandidateFace(imageBuffer);
    const processedImageBuffer = await blurEntireImage(imageBuffer, candidateFace);

    res.json({ blurredImage: processedImageBuffer.toString("base64") });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing image" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
