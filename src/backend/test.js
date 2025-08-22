require('dotenv').config();
const {
  RekognitionClient,
  DetectFacesCommand,
} = require("@aws-sdk/client-rekognition");

const fs = require("fs");
const sharp = require("sharp");
const rekognitionClient = require("./config/aws.recognization");

async function detectFaces(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);

  const params = {
    Image: {
      Bytes: imageBuffer,
    },
  };

  const command = new DetectFacesCommand(params);
  const data = await rekognitionClient.send(command);

  if (data.FaceDetails && data.FaceDetails.length > 0) {
    console.log("Faces detected:", data.FaceDetails);
    return data.FaceDetails;
  } else {
    console.log("No faces detected.");
    return null;
  }
}

async function blurFaces(imagePath, faceDetails) {
  const image = sharp(imagePath);
  const metadata = await image.metadata();

  let compositeOps = [];

  for (const face of faceDetails) {
    const { Left, Top, Width, Height } = face.BoundingBox;

    const left = Math.round(Left * metadata.width);
    const top = Math.round(Top * metadata.height);
    const width = Math.round(Width * metadata.width);
    const height = Math.round(Height * metadata.height);

    const faceRegion = await image.extract({ left, top, width, height }).blur(10).toBuffer();
    compositeOps.push({ input: faceRegion, top, left });
  }

  await image.composite(compositeOps).toFile("output_with_blurred_faces.jpg");
}

async function main() {
  const imagePath = "resume_template_motion_designer.jpg";

  try {
    const faceDetails = await detectFaces(imagePath);
    if (faceDetails) {
      await blurFaces(imagePath, faceDetails);
      console.log("Image with blurred faces saved as output_with_blurred_faces.jpg");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
