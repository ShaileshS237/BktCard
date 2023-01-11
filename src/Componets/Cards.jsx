import {
	Card,
	Empty,
	Button,
	Modal,
	Tooltip,
	Popconfirm,
	Popover,
	message,
	Input,
	Alert,
	Select,
} from "antd";
import React, { useEffect, useState } from "react";
import {
	EditOutlined,
	EllipsisOutlined,
	DeleteTwoTone,
	DeleteOutlined,
	EditTwoTone,
	SwapOutlined,
	SettingOutlined,
	PlusOutlined,
	FileAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { click } from "@testing-library/user-event/dist/click";

const Cards = (props) => {
	const [dispCard, setDispCard] = React.useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
	const [cardName, setCardName] = useState("");
	const [cardURL, setCardURL] = useState("");
	const [editcardName, setEditCardName] = useState("");
	const [editcardURL, setEditCardURL] = useState("");
	const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
	const [optionData, setOptionData] = useState([]);
	const [selectedBucket, setSelBucket] = useState("");
	const [updateData, setUpdateData] = useState([]);
	const [cid, setCID] = useState();
	const [cBucket, setCBucket] = useState();
	const [messageApi, contextHolder] = message.useMessage();
	const [showError, setShowError] = useState(false);
	const [videURL, setVideoURL] = useState("");
	const log = async () => {};
	const { Option } = Select;

	const warning = () => {
		Modal.warning({
			title: "Delete",
			content: "are you sure you want to delete this card?",
			okText: "Yes",
			onOk: () => {
				console.log("hi");
			},
		});
	};

	const showCardModal = async (e) => {
		// let time = new Date().toLocaleString();

		// await axios
		// 	.post("http://localhost:8000/history", {
		// 		name: card.name,
		// 		time: time,
		// 	})
		// 	.then((val) => {
		setIsAddCardModalOpen(true);
		// 	});
	};

	const handleCardOk = async () => {
		let tempId = dispCard.length + 1;
		let cards = [
			...dispCard,
			{
				id: tempId,
				name: cardName,
				videoLink: cardURL,
			},
		];

		console.log(cards);
		await axios
			.patch("http://localhost:8000/data/" + props.cid, {
				cards: cards,
			})
			.then((val) => {
				setIsAddCardModalOpen(false);
				getData();
			});
	};

	const handleCardCancel = () => {
		setIsAddCardModalOpen(false);
	};
	const confirm = (e, id) => {
		e.preventDefault();
		deleteCard(id);
	};

	const deleteCard = async (id) => {
		message.success("Deleted");
		console.log(dispCard, id);
		let newdispCard = dispCard.filter((x) => x.id != id);
		console.log(newdispCard);
		await axios
			.patch("http://localhost:8000/data/" + props.cid, {
				cards: newdispCard,
			})
			.then((val) => {
				message.success("Deleted");
				getData();
			});
	};

	const cancel = (e) => {
		console.log(e);
		// message.error("Click on No");
	};
	const click = () => {
		console.log("hi");
	};

	const getData = async () => {
		axios.get("http://localhost:8000/data?id=" + props.cid).then((val) => {
			// setDispCard(val.data);
			setDispCard(val.data[0].cards);
		});
		console.log(dispCard, "finally");
	};

	useEffect(() => {
		getData();
	}, []);

	const addCard = (e, id) => {
		console.log(dispCard);
	};

	let newData = [];

	const getBucket = async () => {
		axios.get("http://localhost:8000/data").then((val) => {
			setUpdateData(val.data);
			val.data.forEach((el) => {
				newData.push(el);
			});
			setOptionData(newData);
		});
	};

	const movecard = () => {
		getBucket();
		console.log("hi");
	};

	let newCards = dispCard;
	const [cardId, setCardId] = useState();
	let DummyCard = [];
	const editCard = (card) => {
		setEditCardName(card.name);
		setEditCardURL(card.videoLink);
		setIsEditModalOpen(true);

		// console.log(dispCard, card);

		console.log(DummyCard);
		setCardId(card.id);
	};

	const updateCard = async () => {
		newCards = newCards.filter((x) => x.id != cardId);
		DummyCard = { id: cardId, name: editcardName, videoLink: editcardURL };
		await axios
			.patch("http://localhost:8000/data/" + props.cid, {
				cards: [...newCards, DummyCard],
			})
			.then((val) => {
				message.success("Updated Succesfully");
				setIsEditModalOpen(false);

				getData();
			});
	};
	const handleEditOk = () => {
		setIsEditModalOpen(false);
		updateCard();
	};

	const handleEditCancel = () => {
		setIsEditModalOpen(false);
	};

	const showSwapModal = (cid) => {
		setCID(cid);
		getBucket();
		setIsSwapModalOpen(true);
		setShowError(false);
	};

	const sameBucketWarning = () => {
		messageApi.open({
			type: "warning",
			content: "This is a warning message",
		});
	};

	const handleSwapOk = async () => {
		if (props.bname == selectedBucket) {
			// sameBucketWarning();
			setShowError(true);
		} else {
			let removeFromCurrent = dispCard.filter((x) => x.id != cid);
			console.log(removeFromCurrent, "updated card");
			await axios
				.patch("http://localhost:8000/data/" + props.cid, {
					cards: removeFromCurrent,
				})
				.then(async (val) => {});

			message.success("Updated Succesfully");
			let addCard = dispCard.filter((x) => x.id == cid);
			let desireUpdateBucket = updateData.filter(
				(x) => x.name === selectedBucket
			);

			let finalCards = {
				id: desireUpdateBucket[0].cards.length + 1,
				name: addCard[0].name,
				videoLink: addCard[0].videoLink,
			};

			console.log(finalCards, "want to add this card");
			console.log(
				[...desireUpdateBucket[0].cards, finalCards],
				"to this bucket"
			);

			await axios
				.patch("http://localhost:8000/data/" + desireUpdateBucket[0].id, {
					cards: [...desireUpdateBucket[0].cards, finalCards],
				})
				.then((val) => {
					temp();
					// message.success("Updated Succesfully");
				});
		}
	};

	const temp = () => {
		getData();
		console.log("hia");
		// setIsSwapModalOpen(false);
	};

	const handleSwapCancel = () => {
		setIsSwapModalOpen(false);
	};

	function getId(url) {
		// console.log(url);

		const regExp =
			/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regExp);
		return match[2];
	}

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const showModal = async (e, card) => {
		e.preventDefault();
		setIsModalOpen(true);
		// getId(card.videoLink);

		let temp = getId(card.videoLink);
		setVideoURL(temp);
		console.log(
			"<iframe src='https://www.youtube.com/embed/" +
				temp +
				"' width='100%' heeight='500px' allowscriptaccess='always' frameborder='0' />"
		);
		let time = new Date().toLocaleString();

		await axios
			.post("http://localhost:8000/history", {
				name: card.name,
				Bucket: props.bname,
				time: time,
			})
			.then((val) => {
				setIsModalOpen(true);
			});
	};

	// const content = showSwapModal();
	return (
		<div>
			<Modal
				title="Update Card"
				onOk={handleEditOk}
				onCancel={handleEditCancel}
				open={isEditModalOpen}
				okText="Update"
			>
				<Input
					placeholder="Card Name"
					size="large"
					style={{ marginBottom: 10 }}
					value={editcardName}
					onChange={(e) => setEditCardName(e.target.value)}
				/>
				<Input
					placeholder="Video Link"
					size="large"
					value={editcardURL}
					onChange={(e) => setEditCardURL(e.target.value)}
				/>
			</Modal>
			<Modal
				title={
					dispCard.length >= 1
						? "Add " + props.bname + " Card"
						: "Create " + props.bname + " Card"
				}
				onOk={handleCardOk}
				onCancel={handleCardCancel}
				open={isAddCardModalOpen}
				okText={dispCard.length >= 1 ? "Add" : "Create"}
			>
				<Input
					placeholder="Card Name"
					size="large"
					style={{ marginBottom: 10 }}
					onChange={(e) => setCardName(e.target.value)}
				/>
				<Input
					placeholder="Video Link"
					size="large"
					onChange={(e) => setCardURL(e.target.value)}
				/>
			</Modal>
			<Modal
				title="Watch Video"
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={null}
				width={1000}
				bodyStyle={{ height: 500 }}
			>
				<div
					dangerouslySetInnerHTML={{
						__html:
							"<iframe src='https://www.youtube.com/embed/" +
							videURL +
							"' width='100%' height='500px'  />",
					}}
				/>
			</Modal>
			{dispCard.length >= 1 ? (
				<div>
					{dispCard.map((card) => (
						<div key={card.id} style={{ padding: "0 20px" }}>
							{/* extra={<Button type="primary">Move Card</Button>} */}
							<Card
								type="inner"
								title={card.name.toUpperCase()}
								style={{ width: "100%", marginBottom: 20 }}
								actions={[
									<Popconfirm
										title="Delete the task"
										description="Are you sure to delete this card?"
										onConfirm={(e) => {
											confirm(e, card.id);
										}}
										onCancel={cancel}
										okText="Yes"
										cancelText="No"
									>
										<DeleteOutlined key="ellipsis" />
									</Popconfirm>,
									<Tooltip title="Edit Card">
										<EditOutlined
											key="ellipsis"
											onClick={(e) => {
												editCard(card);
											}}
										/>
									</Tooltip>,
									<SwapOutlined
										key="edit"
										onClick={(e) => showSwapModal(card.id)}
									/>,
								]}
							>
								<Modal
									title="Select The Desire Bucket"
									open={isSwapModalOpen}
									onOk={handleSwapOk}
									onCancel={handleSwapCancel}
								>
									<Select
										size="large"
										style={{ width: "100%" }}
										onChange={(e) => {
											setSelBucket(e);
										}}
									>
										{optionData.map((item) => (
											<Option key={item.id} value={item.name}>
												{item.name}
											</Option>
										))}
									</Select>
									{showError ? (
										<Alert
											style={{ marginTop: 10 }}
											message="Moving in same bucket is not possible, Please select another bucket"
											type="warning"
										/>
									) : (
										""
									)}
								</Modal>
								<p>
									Video Link : {/* <Tooltip title="Click To Watch"> */}
									<a
										onClick={(e) => {
											showModal(e, card);
										}}
									>
										{card.videoLink ? card.videoLink : "NA"}
									</a>
									{/* </Tooltip> */}
								</p>
							</Card>
						</div>
					))}
					<div style={{ textAlign: "center" }}>
						<Button
							onClick={(e) => {
								showCardModal(e);
							}}
							type="default"
							icon={<PlusOutlined />}
						>
							Add New
						</Button>
					</div>
				</div>
			) : (
				<>
					<Empty
						description={<span>No Cards Available</span>}
						style={{ marginBottom: 30 }}
					>
						<Button
							style={{ background: "#6699ff" }}
							type="primary"
							onClick={(e) => {
								showCardModal(e);
							}}
						>
							Create One
						</Button>
					</Empty>
				</>
			)}
		</div>
	);
};

export default Cards;
