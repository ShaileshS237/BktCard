import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row } from "antd";
import { Card, Divider } from "antd";
import Cards from "./Cards";
import { FolderAddOutlined } from "@ant-design/icons";
const Buckets = () => {
	let newData = [];
	const [bucket, setBucket] = React.useState([]);
	const [allBucket, setAllBucket] = useState([]);
	useEffect(() => {
		axios.get("http://localhost:8000/data").then((val) => {
			setBucket(val.data);
			console.log(val.data);

			setAllBucket(newData);
			console.log(newData);
		});
	}, []);

	return (
		<Row gutter={16}>
			{bucket.map((bucket) => (
				<Col className="gutter-row" span={8} key={bucket.id}>
					<Divider orientation="left" style={{ color: "#6699ff" }}>
						{bucket.name}
					</Divider>
					<Cards cid={bucket.id} bname={bucket.name} newdata={newData} />
				</Col>
			))}
		</Row>
	);
};

export default Buckets;
