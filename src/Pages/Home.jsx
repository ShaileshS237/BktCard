import React, { useState } from "react";
import { Button, Space, Input, Select, Alert } from "antd";
import "../App.css";
import { Empty } from "antd";
import Navbar from "../Componets/Navbar";
import { Modal } from "antd";
import Buckets from "../Componets/Buckets";
import Marquee from "react-fast-marquee";
export const Home = () => {
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [modalText, setModalText] = useState("Content of the modal");
	const showModal = () => {
		setOpen(true);
	};
	const handleOk = () => {
		setModalText("The modal will be closed after two seconds");
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
			<Alert
				style={{ margin: "0 1%" }}
				type="error"
				message={
					<Marquee pauseOnHover gradient={false} speed="60">
						Bug Reported : 1 . After transferring the card to a different
						bucket. It moves but the component doesn't retrieve the updated
						data; after a manual refresh, the updated data is retrieved.
					</Marquee>
				}
			/>

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
			<div
				style={{
					margin: "22px",
					background: "white",
					padding: "10px 20px 40px",
					borderRadius: "10px",
				}}
			>
				<Buckets />
			</div>

			{/* <Empty
				image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
				imageStyle={{
					height: 200,
				}}
				description={<span>Oops, No Bucket Found</span>}
			>
				<Button onClick={showModal} type="primary">
					Create One
				</Button>
			</Empty> */}
		</>
	);
};

export default Home;
