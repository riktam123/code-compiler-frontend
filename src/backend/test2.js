require('dotenv').config();
const {
  DetectFacesCommand,
} = require("@aws-sdk/client-rekognition");

const fs = require("fs");
const sharp = require("sharp");
const rekognitionClient = require("./config/aws.recognization");

async function detectCandidateFace(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);

  const params = {
    Image: {
      Bytes: imageBuffer,
    },
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

async function blurCandidateFace(imagePath, faceDetails) {
  const image = sharp(imagePath);
  const metadata = await image.metadata();

  const { Left, Top, Width, Height } = faceDetails.BoundingBox;

  const left = Math.round(Left * metadata.width);
  const top = Math.round(Top * metadata.height);
  const width = Math.round(Width * metadata.width);
  const height = Math.round(Height * metadata.height);

  // Extract, blur, and recomposite
  const blurredFace = await image
    .extract({ left, top, width, height })
    .blur(10)
    .toBuffer();

  await sharp(imagePath)
    .composite([{ input: blurredFace, top, left }])
    .toFile("output.jpg");

  console.log("Candidate's face blurred in output_with_blurred_candidate.jpg");
}

async function main() {
  const imagePath = "biswajitResume.png";

  try {
    const candidateFace = await detectCandidateFace(imagePath);
    if (candidateFace) {
      await blurCandidateFace(imagePath, candidateFace);
    } else {
      console.log("No candidate face detected.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
