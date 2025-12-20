import React, { useState } from "react";
import { Input } from "antd";
import "../App.css";
import Navbar from "../Componets/Navbar";
import { Modal } from "antd";
import Buckets from "../Componets/Buckets";

export const Home = () => {
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);

	const handleOk = () => {
		setConfirmLoading(true);
		setTimeout(() => {
			setOpen(false);
			setConfirmLoading(false);
		}, 2000);
	};
	const handleCancel = () => {
		console.log("Clicked cancel button");
		setOpen(false);
	};
	return (
		<>
			<Navbar />

			{/* Bug Reported : After moving the card into another bucket. It gets moved but componet didnt fetch the updated data, After manual refresh it gets updated */}
			<Modal
				title="Add Bucket"
				open={open}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
			>
				<Input placeholder="Name of Bucket" />
			</Modal>
			<div className="content-wrapper">
				<Buckets />
			</div>
		</>
	);
};

export default Home;
