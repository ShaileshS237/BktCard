import React from "react";

const Createcard = () => {
	return (
		<div>
			<Modal
				title="Create Card"
				open={open}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
			>
				<Input placeholder="Name of Bucket" />
			</Modal>
		</div>
	);
};

export default Createcard;
