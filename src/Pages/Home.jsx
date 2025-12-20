import "../App.css";
import Navbar from "../Componets/Navbar";
import Buckets from "../Componets/Buckets";
import { Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

export const Home = () => {

	return (
		<>
			<Navbar />
			<div className="content-wrapper" style={{ paddingBottom: 20 }}>
				<Buckets />
			</div>

			<div className="content-wrapper" style={{ marginTop: 0 }}>
				<Typography>
					<Title level={3} style={{ marginTop: 0 }}>How to use MemoBucket</Title>
					<Paragraph>
						A <strong>Bucket</strong> is a container for organizing related tasks or ideas (e.g., "Work", "Personal", "Grocery List").
					</Paragraph>
					<Paragraph>
						A <strong>Card</strong> represents a single item or task within a specific Bucket. It contains a title and a description.
					</Paragraph>

					<Title level={4}>Workflow</Title>
					<ul>
						<li><Text strong>Create a Bucket:</Text> Click "Add Bucket" in the navigation bar to create a new category.</li>
						<li><Text strong>Add Cards:</Text> Click "Add New" or "Create One" inside a bucket to add a new card.</li>
						<li><Text strong>Manage Cards:</Text> Use the icons on each card to <Text strong>Edit</Text>, <Text strong>Delete</Text>, or <Text strong>Move</Text> (swap) it to another bucket.</li>
					</ul>
				</Typography>
			</div>
		</>
	);
};

export default Home;
