import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, TextField, Toolbar, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axios from "axios";
import React from "react";

const defaultTemplates = {
	python: `print("Hello, World!")\n`,
	javascript: `console.log("Hello, World!");\n`,
	java: `public class Program {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n`,
	cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n`,
	c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n`,
	csharp: `using System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("Hello, World!");\n    }\n}\n`,
	php: `<?php\nfunction greet(string $name): void {\n    echo "Hello, " . $name . "!\n";\n}\n\ngreet("World");\n?>`,
	go: `package main\n\nimport "fmt"\n\nfunc greet(name string) {\n    fmt.Println("Hello, " + name + "!")\n}\n\nfunc main() {\n    greet("World")\n}\n`,
	ruby: `def greet(name)\n    puts "Hello, #{name}!"\nend\n\ngreet("World")\n`,
	rust: `fn main() {\n    println!("Hello, World!");\n}\n`,
	typescript: `function greet(name: string): void {\n    console.log("Hello, " + name + "!");\n}\n\ngreet("World");\n`,
	kotlin: `fun main() {\n    val name = "World"\n    println("Hello, \$name!")\n}\n`,
};

const extensions = [
	{
		label: "javascript",
		value: "javascript",
		editorLanguage: "javascript",
	},
	{ label: "python", value: "python", editorLanguage: "python" },
	{ label: "java", value: "java", editorLanguage: "java" },
	{ label: "cpp", value: "c++", editorLanguage: "cpp" },
	{ label: "c", value: "c", editorLanguage: "c" },
	{ label: "php", value: "php", editorLanguage: "php" },
	{ label: "go", value: "go", editorLanguage: "go" },
	{ label: "ruby", value: "ruby", editorLanguage: "ruby" },
	{ label: "rust", value: "rust", editorLanguage: "rust" },
	{ label: "typescript", value: "typescript", editorLanguage: "typescript" },
	{ label: "c#", value: "csharp", editorLanguage: "csharp" },
	// { label: "kotlin", value: "kotlin", editorLanguage: "kotlin" },
];

function CodeEditor() {
	const [compiledOutput, setCompiledOutput] = useState("");
	const [compilationError, setCompilationError] = useState(null);
	const [loader, setLoader] = useState(false);
	const [language, setLanguage] = useState("c++");
	const [codeExampleValue, setCodeExample] = useState("");
	const [inputValue, setInputValue] = useState("");
	const [outputType, setOutputType] = useState(false);
	const editorRef = useRef(null);

	function handleEditorDidMount(editor) {
		editorRef.current = editor;
	}
	function handleLanguageChange(e) {
		setLanguage(e.target.value);
	}
	function handleEditorChange() {
		setCodeExample(editorRef.current.getValue());
	}

	const startPollingToGetOutput = (jobId) => {
		const intervalId = setInterval(async () => {
			try {
				const res = await axios.get(`http://localhost:5100/run/getOutputFromJobId?jobId=${jobId}`);
				const stdout = res?.data?.output;
				const status = res?.data?.status;
				const error = res?.data?.error;
				const codeStatus = res?.data?.codeStatus;

				if (status === "completed") {
					if (
						codeStatus === "Max Output Limit Exceeded" ||
						codeStatus === "Time Limit Exceeded" ||
						codeStatus === "Memory Limit Exceeded"
					) {
						setCompilationError(stdout || "empty output");
						setOutputType(codeStatus);
					} else if (codeStatus === "Max Error Limit Exceeded") {
						setCompilationError(error || "empty output");
						setOutputType(codeStatus);
					} else if (error) {
						setCompilationError(error || "empty output");
						setOutputType("Issue Detected");
					} else {
						setCompiledOutput(stdout || "empty output");
					}
					setLoader(false);
					clearInterval(intervalId);
				} else if (status === "error") {
					setCompilationError(error || "An error occurred while compiling the code.");
					setOutputType(codeStatus);
					setLoader(false);
					clearInterval(intervalId);
				} else {
					setCompiledOutput(stdout || "");
				}
			} catch (e) {
				setCompilationError(
					e?.response?.data?.data?.output || "An error occurred while compiling the code."
				);
				setOutputType(e?.response?.data?.data?.errorType || "error");
				setLoader(false);
				clearInterval(intervalId); // stop polling on failure
			}
		}, 1000);

		return intervalId;
	};

	const handleCompile = async () => {
		const payload = {
			language,
			code: codeExampleValue,
			input: inputValue,
		};

		try {
			setCompilationError(null);
			setCompiledOutput("");
			setLoader(true);
			setOutputType("");
			const res = await axios.post("http://localhost:5100/run/runCode", payload);
			const pollingId = startPollingToGetOutput(res.data.jobId);
			return () => clearInterval(pollingId);
		} catch (e) {
			setCompilationError(
				e?.response?.data?.data?.output || "An error occurred while compiling the code."
			);
			setOutputType(e?.response?.data?.data?.errorType || "error");
			setLoader(false);
		}
	};

	function getKeyByValue(extensions, value) {
		return extensions.find((key) => key.value === value)?.editorLanguage || "javascript";
	}
	const languageKey = getKeyByValue(extensions, language);

	useEffect(() => {
		setCodeExample(defaultTemplates[languageKey] || "");
	}, [languageKey]);

	return (
		<Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default" }}>
			<ComponentHeading
				info={true}
				extensions={extensions}
				handleChange={handleLanguageChange}
				language={language}
				handleCompile={handleCompile}
				loader={loader}
			/>
			<Editor
				height="70vh"
				width="100%"
				defaultLanguage={languageKey}
				theme="vs-dark"
				onChange={handleEditorChange}
				onMount={handleEditorDidMount}
				language={languageKey}
				value={codeExampleValue}
				options={{ inlineSuggest: false }}
			/>
			<div className="flex justify-around flex-wrap gap-4">
				<Box className="m-5 flex-1 mx-5">
					<TextField
						className="w-[500px]"
						multiline
						rows={5}
						variant="outlined"
						placeholder="Type your input here..."
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
				</Box>

				{compiledOutput && (
					<div className="p-2 m-5 rounded border border-green-300 bg-green-50 h-[150px] w-[600px] overflow-auto">
						<strong className="text-green-800">{outputType}</strong>
						<div className="mt-2 space-y-1">
							{compiledOutput.split("\n").map((line, index) => (
								<div key={index} className="text-green-700 font-mono">
									{line}
								</div>
							))}
						</div>
					</div>
				)}

				{compilationError && (
					<div className="p-2 m-5 rounded border border-red-300 bg-red-50 h-[150px] w-[600px] overflow-auto">
						<strong className="text-red-800">{outputType}</strong>
						<div className="mt-2 space-y-1">
							{compilationError.split("\n").map((line, index) => (
								<div key={index} className="text-red-700 font-mono">
									<pre className="whitespace-pre-wrap break-words">{line}</pre>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</Box>
	);
}

export default CodeEditor;

const ComponentHeading = ({
	heading,
	info = false,
	extensions,
	language,
	handleChange,
	handleCompile,
	loader,
}) => {
	return (
		<Box>
			<Toolbar
				sx={{
					backgroundColor: "#337CCF",
					color: "#f1f1f1",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: "1rem",
				}}
			>
				<Typography variant="body1">{heading || "Code Runner"}</Typography>
				<Button
					sx={{
						marginRight: "20px",
						height: "40px",
						minWidth: "80px",
					}}
					onClick={handleCompile}
					color="warning"
					variant="contained"
					className="shadow-none"
					size="small"
				>
					{loader ? (
						<CircularProgress style={{ color: "white", width: "16px", height: "16px" }} />
					) : (
						"Run"
					)}
				</Button>
				{info && (
					<LanguageOptions
						language={language}
						extensions={extensions}
						handleChange={handleChange}
					/>
				)}
			</Toolbar>
		</Box>
	);
};

function LanguageOptions({ language, extensions, handleChange }) {
	return (
		<FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} className="text-white">
			<InputLabel id="code-editor-select-label" className="text-white">
				Language
			</InputLabel>
			<Select
				labelId="code-editor-select-label"
				id="code-editor-select"
				value={language}
				onChange={handleChange}
				label="Language"
				className="text-white"
			>
				{extensions.map((lang, index) => (
					<MenuItem value={lang.value} key={index}>
						{stringCapitalize(lang.label)}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

function stringCapitalize(str) {
	return str[0].toUpperCase() + str.substring(1).toLowerCase();
}
