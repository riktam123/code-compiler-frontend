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

async function detectCandidateFaces(imageBuffer) {
  const convertedImageBuffer = await sharp(imageBuffer)
    .jpeg({ quality: 100 }) // Convert to JPEG format with 100% quality
    .toBuffer();
  const params = {
    Image: { Bytes: convertedImageBuffer },
  };

  const command = new DetectFacesCommand(params);
  const data = await rekognitionClient.send(command);

  console.log("data.FaceDetails", data.FaceDetails);

  // Return all detected faces
  if (data.FaceDetails && data.FaceDetails.length > 0) {
    console.log(`Faces detected: ${data.FaceDetails.length}`);
    return data.FaceDetails;
  } else {
    console.log("No faces detected.");
    return [];
  }
}

async function blurFacesInImage(imageBuffer, faceDetailsList) {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  const imageWidth = metadata.width;
  const imageHeight = metadata.height;

  console.log(`Image dimensions: width=${imageWidth}, height=${imageHeight}`);

  let composites = [];

  for (const face of faceDetailsList) {
    const { Left, Top, Width, Height } = face.BoundingBox;

    // Calculate bounding box and clamp to valid values
    let left = Math.max(0, Math.floor(Left * imageWidth));
    let top = Math.max(0, Math.floor(Top * imageHeight));
    let width = Math.min(imageWidth - left, Math.ceil(Width * imageWidth));
    let height = Math.min(imageHeight - top, Math.ceil(Height * imageHeight));

    // Skip faces that are too small
    if (width < 10 || height < 10) {
      console.warn("Skipping small face:", { left, top, width, height });
      continue;
    }

    console.log("Validated Face Coordinates:", { left, top, width, height });

    try {
      // Extract and blur the face
      const blurredFace = await sharp(imageBuffer)
        .extract({ left, top, width, height })
        .blur(20)
        .toBuffer();

      // Add the blurred face to the composite array
      composites.push({ input: blurredFace, top, left });
    } catch (err) {
      console.error("Error processing face at:", { left, top, width, height }, err);
    }
  }

  // Composite all blurred faces back onto the original image
  if (composites.length > 0) {
    return sharp(imageBuffer).composite(composites).toBuffer();
  }

  // Return original image if no valid faces
  console.warn("No valid faces to blur.");
  return imageBuffer;
}


app.post("/api/blur", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageBuffer = req.file.buffer;

    // Detect all candidate faces
    const detectedFaces = await detectCandidateFaces(imageBuffer);

    if (detectedFaces.length === 0) {
      return res.json({ blurredImage: imageBuffer.toString("base64") });
    }

    // Blur all detected faces
    const processedImageBuffer = await blurFacesInImage(imageBuffer, detectedFaces);
    console.log("completed", '\n\n\n');
    // Return the blurred image as base64
    res.json({ blurredImage: processedImageBuffer.toString("base64") });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing image" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
