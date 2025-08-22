import React from "react";
import axios from "axios";

const VideoPlayer = ({ interview_id }) => {
	const startVideo = async () => {
		try {
			const response = await axios.get(`http://localhost:5500/video/${interview_id}`);
			if (response.status === 200) {
				window.open(`http://localhost:5000/video/${interview_id}`, "_blank");
			}
		} catch (error) {
			console.error("Error opening video", error);
		}
	};

	return (
		<div>
			<h2>Interview Video</h2>
			<button onClick={startVideo}>Start Video</button>
		</div>
	);
};

export default VideoPlayer;
