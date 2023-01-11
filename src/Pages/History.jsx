import React, { useEffect, useState } from "react";
import Navbar from "../Componets/Navbar";
import axios from "axios";
import { Divider, Card, Row, Col } from "antd";
const History = () => {
	const [history, setHistory] = useState([]);

	const getHistory = async () => {
		await axios.get("http://localhost:8000/history").then((val) => {
			setHistory(val.data);
		});
	};

	useEffect(() => {
		getHistory();
	}, []);

	return (
		<div>
			<Navbar />

			<Divider orientation="left" plain>
				Watch History
			</Divider>

			<div>
				<Row>
					{history.map((val) => (
						<Col
							className="gutter-row"
							xs={{ span: 8, offset: 3 }}
							lg={{ span: 4, offset: 1 }}
						>
							<Card
								style={{ marginBottom: "25px", height: "95%" }}
								type="inner"
								title={"Bucket : " + val.Bucket}
							>
								<p>Title : {val.name}</p>
								<p>Date & Time : {val.time}</p>
							</Card>
						</Col>
					))}
				</Row>
			</div>
		</div>
	);
};

export default History;
