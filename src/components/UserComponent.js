// UserComponent.js
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addUser, updateUser, deleteUser } from "../redux/action";

const UserComponent = () => {
	const users = useSelector((state) => state.users);
	const dispatch = useDispatch();

	const [user, setUser] = useState({ id: "", name: "" });
	const [isEditing, setIsEditing] = useState(false);

	const handleAddUser = () => {
		dispatch(addUser({ id: Date.now(), name: user.name }));
		setUser({ id: "", name: "" });
	};

	const handleUpdateUser = () => {
		dispatch(updateUser(user));
		setUser({ id: "", name: "" });
		setIsEditing(false);
	};

	const handleEditUser = (user) => {
		setUser(user);
		setIsEditing(true);
	};

	const handleDeleteUser = (id) => {
		dispatch(deleteUser(id));
	};

	return (
		<div>
			<div className="mt-5 mx-5 flex justify-center border-md">
				<input
					type="text"
					value={user.name}
					onChange={(e) => setUser({ ...user, name: e.target.value })}
					placeholder="Enter user name"
					className="p-3 border-collapse border-gray-400"
				/>
				<button
					className="m-2 p-2 bg-blue-500 text-sm text-white rounded-md"
					onClick={isEditing ? handleUpdateUser : handleAddUser}
				>
					{isEditing ? "Update" : "Add"} User
				</button>
			</div>
			<table className="p-5 table-auto border-collapse border border-gray-400 w-full">
				<thead className="bg-gray-200">
					<tr>
						<th className="border border-gray-400 p-2">Name</th>
						<th className="border border-gray-400 p-2">Edit</th>
						<th className="border border-gray-400 p-2">Delete</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id} className="text-center">
							<td className="border border-gray-400 p-2">{user.name}</td>
							<td className="border border-gray-400 p-2">
								<button
									className="m-2 p-2 bg-sky-500 text-sm text-white rounded-md"
									onClick={() => handleEditUser(user)}
								>
									Edit
								</button>
							</td>
							<td className="border border-gray-400 p-2">
								<button
									className="m-2 p-2 bg-red-500 text-sm text-white rounded-md"
									onClick={() => handleDeleteUser(user.id)}
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default UserComponent;
