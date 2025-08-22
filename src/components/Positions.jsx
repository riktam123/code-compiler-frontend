import { useState } from "react";
import "./Position.css";
const Positions = () => {
	const [open, setOpen] = useState(false);
	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
				}}
			>
				<div className="box" id="box1">
					box1
				</div>
				<div className="box" id="box2" onClick={(e) => setOpen(!open)}>
					box2
				</div>
				<div className="box" id="box3">
					box3
				</div>
				<div className="box" id="box4">
					box4
				</div>
			</div>
			<div>
				<h1>
					Where does it come from? Contrary to popular belief, Lorem Ipsum is not simply random
					text. It has roots in a piece of classical Latin literature from 45 BC, making it over
					2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in
					Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum
					passage, and going through the cites of the word in classical literature, discovered the
					undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus
					Bonorum et Malorum" generated Lorem Ipsum is therefore always free from repetition,
					injected humour, or non-characteristic words etc. Where does it come from? Contrary to
					popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
					classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock,
					a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
					Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the
					word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from
					sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" generated Lorem Ipsum is
					therefore always free from repetition, injected humour, or non-characteristic words
					etc.Where does it come from? Contrary to popular belief, Lorem Ipsum is not simply random
					text. It has roots in a piece of classical Latin literature from 45 BC, making it over
					2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in
					Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum
					passage, and going through the cites of the word in classical literature, discovered the
					undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus
					Bonorum et Malorum" generated Lorem Ipsum is therefore always free from repetition,
					injected humour, or non-characteristic words etc.Where does it come from? Contrary to
					popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
					classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock,
					a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
					Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the
					word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from
					sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" generated Lorem Ipsum is
					therefore always free from repetition, injected humour, or non-characteristic words
					etc.Where does it come from? Contrary to popular belief, Lorem Ipsum is not simply random
					text. It has roots in a piece of classical Latin literature from 45 BC, making it over
					2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in
					Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum
					passage, and going through the cites of the word in classical literature, discovered the
					undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus
					Bonorum et Malorum" generated Lorem Ipsum is therefore always free from repetition,
					injected humour, or non-characteristic words etc.Where does it come from? Contrary to
					popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
					classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock,
					a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
					Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the
					word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from
					sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" generated Lorem Ipsum is
					therefore always free from repetition, injected humour, or non-characteristic words
					etc.Where does it come from? Contrary to popular belief, Lorem Ipsum is not simply random
					text. It has roots in a piece of classical Latin literature from 45 BC, making it over
					2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in
					Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum
					passage, and going through the cites of the word in classical literature, discovered the
					undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus
					Bonorum et Malorum" generated Lorem Ipsum is therefore always free from repetition,
					injected humour, or non-characteristic words etc.
				</h1>
			</div>
			{open && <Modal onClose={() => setOpen(false)} />}
		</div>
	);
};

const Modal = ({ onClose }) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	return (
		<div className="modal" onClose={onClose}>
			<div className="modal-content">
				<div className="modal-header">
					<h5>Model demo</h5>
					<button className="modal-close" onClick={onClose}>
						X close
					</button>
				</div>
				<div className="modal-body">
					<InputBox
						placeholder="Enter your name"
						name={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<InputBox
						placeholder="Enter your email"
						name={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<InputBox
						placeholder="Enter your password"
						name={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button className="modal-submit">Submit</button>
				</div>
			</div>
		</div>
	);
};

const InputBox = ({ placeholder, name, onChange }) => {
	return <input className="modal-input" placeholder={placeholder} name={name} onChange={onChange} />;
};

export default Positions;
