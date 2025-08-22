const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const Docker = require("dockerode");
const Redis = require("ioredis");

const app = express();
const docker = new Docker({ socketPath: "/var/run/docker.sock" });
const redis = new Redis(); // Default Redis connection

app.use(cors());
app.use(bodyParser.json());

const BASE_IMAGE = "my-code-compiler:latest"; // Prebuilt image with all compilers
const MAX_CONCURRENT_CONTAINERS = 10;

// Track running containers
let runningContainers = 0;

// Queue system
const enqueue = async (job) => {
	await redis.lpush("codeQueue", JSON.stringify(job));
};

const dequeueAndRun = async () => {
	if (runningContainers >= MAX_CONCURRENT_CONTAINERS) return;

	const jobData = await redis.rpop("codeQueue");
	if (!jobData) return;

	const job = JSON.parse(jobData);
	runningContainers++;

	try {
		await runInContainer(job);
	} catch (err) {
		console.error("Error running container:", err);
	} finally {
		runningContainers--;
		// Check queue again
		dequeueAndRun();
	}
};

// Function to run code inside a new Docker container
const runInContainer = async ({ code, language, input, res }) => {
	const tempDir = path.join(__dirname, "tmp", uuidv4());
	fs.mkdirSync(tempDir, { recursive: true });

	const extensionMap = {
		javascript: "js",
		python: "py",
		cpp: "cpp",
		c: "c",
		java: "java",
		go: "go",
		ruby: "rb",
		php: "php",
		rust: "rs",
		kotlin: "kt",
	};

	const ext = extensionMap[language.toLowerCase()] || "txt";
	const fileName = `program.${ext}`;
	fs.writeFileSync(path.join(tempDir, fileName), code);
	fs.writeFileSync(path.join(tempDir, "input.txt"), input || "");

	const container = await docker.createContainer({
		Image: BASE_IMAGE,
		Cmd: ["sh", "-c", `/run-code.sh /code/${fileName} /code/input.txt`],
		HostConfig: {
			Binds: [`${tempDir}:/code:rw`], // only temporary folder writable
			Memory: 256 * 1024 * 1024, // 256MB
			CpuShares: 512, // CPU priority
			NetworkMode: "none", // disable network
		},
	});

	await container.start();

	let output = "";
	const logStream = await container.logs({ stdout: true, stderr: true, follow: true });

	logStream.on("data", (chunk) => {
		output += chunk.toString();
	});

	await new Promise((resolve) => {
		logStream.on("end", resolve);
		container.wait().then(resolve);
	});

	await container.remove({ force: true });
	fs.rmSync(tempDir, { recursive: true, force: true });

	res.json({ output });
};

app.post("/run", async (req, res) => {
	const { code, language, input } = req.body;

	if (!code || !language) {
		return res.status(400).json({ error: "Code and language required" });
	}

	// Add job to queue
	await enqueue({ code, language, input, res });
	dequeueAndRun();
});

app.listen(5100, () => console.log("Server running on port 5100"));
