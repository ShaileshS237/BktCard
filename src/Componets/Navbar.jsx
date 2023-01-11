import React, { useEffect, useState } from "react";
import { Button, Space, Modal, Input } from "antd";
import "../App.css";
import { Empty } from "antd";
import {
	SearchOutlined,
	HistoryOutlined,
	HomeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router-dom";

export const Navbar = ({ fn }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [bucketname, setBucketName] = useState();
	const [data, setData] = useState([]);
	const [buttonDisabled, setButtonDisabled] = useState(false);

	const showModal = () => {
		setIsModalOpen(true);
	};
	const handleOk = async () => {
		await axios
			.post("http://localhost:8000/data", {
				name: bucketname,
				cards: [],
			})
			.then((val) => {
				console.log(val);
				if (val.status == 201) {
					setBucketName("");
					setIsModalOpen(false);
				}
			});
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};
	const getData = async () => {
		await axios.get("http://localhost:8000/data").then((val) => {
			setData(val.data);
		});
	};

	const pushBucket = () => {};

	useEffect(() => {
		getData();
	}, []);
	return (
		<div>
			<Modal
				title="Add Bucket"
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				okButtonProps={{ disabled: buttonDisabled }}
			>
				<Input
					placeholder="Bucket Name"
					onChange={(e) => {
						e.preventDefault();
						setBucketName(e.target.value);
					}}
					value={bucketname}
				/>
			</Modal>
			<div className="nav-bar">
				<div>
					<Link to="/">
						<img
							style={{ marginTop: 30 }}
							src="/assignement2.png"
							alt=""
							height={100}
						/>
					</Link>
				</div>
				<div style={{ margin: "20px 0 20px 0" }}>
					<Space wrap>
						<Link to="/">
							<Button
								size={"large"}
								type="dashed "
								icon={<HomeOutlined />}
							></Button>
						</Link>
						<Link to="/history">
							<Button size={"large"} type="dashed " icon={<HistoryOutlined />}>
								History
							</Button>
						</Link>
						<Button size={"large"} type="primary" onClick={showModal}>
							Add Bucket
						</Button>
						{/* <Button size={"large"} type="primary" danger>
							Create Card
						</Button> */}
					</Space>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
