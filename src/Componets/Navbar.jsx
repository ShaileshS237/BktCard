import React, { useState } from "react";
import { Button, Space, Modal, Input, message } from "antd";
import "../App.css";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { addBucket } from "../services/storage";

export const Navbar = ({ fn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bucketname, setBucketName] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const name = (bucketname || "").trim();
    if (!name) {
      message.warning("Bucket name is required");
      return;
    }
    const created = addBucket(name);
    if (created) {
      message.success("Bucket added");
      setBucketName("");
      setIsModalOpen(false);
    } else {
      message.warning("Bucket already exists");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Modal
        title="Add Bucket"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: !(bucketname && bucketname.trim().length > 0) }}
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
              className="nav-logo"
              src="/bktcard_logo.png"
              alt="BktCard logo"
            />
          </Link>
        </div>
        <div style={{ margin: "20px 0 20px 0" }}>
          <Space wrap className="nav-actions" style={{ width: "100%" }}>
            <Button className="full-width-sm" size={"large"} type="primary" onClick={showModal}>
              Add Bucket
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
