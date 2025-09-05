import {
  Card,
  Empty,
  Button,
  Modal,
  Tooltip,
  Popconfirm,
  message,
  Input,
  Alert,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  SwapOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import {
  getBucketById,
  getBuckets,
  addCardToBucket,
  deleteCardFromBucket,
  updateCardInBucket,
  moveCardToBucketByName,
  subscribe,
} from "../services/storage";

const Cards = (props) => {
  const [dispCard, setDispCard] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [editcardName, setEditCardName] = useState("");
  const [editcardDescription, setEditCardDescription] = useState("");
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [optionData, setOptionData] = useState([]);
  const [selectedBucket, setSelBucket] = useState("");
  const [updateData, setUpdateData] = useState([]);
  const [cid, setCID] = useState(); // card id for swap
  const [showError, setShowError] = useState(false);
  const { Option } = Select;

  const getData = () => {
    const bucket = getBucketById(props.cid);
    setDispCard(Array.isArray(bucket?.cards) ? bucket.cards : []);
  };

  useEffect(() => {
    getData();
    const unsub = subscribe(() => {
      getData();
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.cid]);

  const showCardModal = () => {
    setIsAddCardModalOpen(true);
  };

  const handleCardOk = () => {
    addCardToBucket(props.cid, {
      name: cardName,
      description: cardDescription,
    });
    setIsAddCardModalOpen(false);
    setCardName("");
    setCardDescription("");
  };

  const handleCardCancel = () => {
    setIsAddCardModalOpen(false);
  };

  const confirm = (e, id) => {
    e.preventDefault();
    deleteCard(id);
  };

  const deleteCard = (id) => {
    deleteCardFromBucket(props.cid, id);
    message.success("Deleted");
  };

  const cancel = () => {};

  const getBucket = () => {
    const all = getBuckets();
    setUpdateData(all);
    setOptionData(all);
  };

  const [cardId, setCardId] = useState();
  const editCard = (card) => {
    setEditCardName(card.name);
    setEditCardDescription(card.description);
    setIsEditModalOpen(true);
    setCardId(card.id);
  };

  const updateCard = () => {
    updateCardInBucket(props.cid, cardId, {
      name: editcardName,
      description: editcardDescription,
    });
    message.success("Updated Succesfully");
    setIsEditModalOpen(false);
  };

  const handleEditOk = () => {
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

  const handleSwapOk = () => {
    if (props.bname === selectedBucket) {
      setShowError(true);
    } else {
      moveCardToBucketByName(props.cid, selectedBucket, cid);
      message.success("Updated Succesfully");
      setIsSwapModalOpen(false);
    }
  };

  const handleSwapCancel = () => {
    setIsSwapModalOpen(false);
  };

  // Removed: YouTube ID parser (no longer needed)

  // Removed: handleOk (video modal no longer used)

  // Removed: handleCancel (video modal no longer used)

  // Removed: showModal handler and history entry (video playback removed)

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
        <Input.TextArea
          placeholder="Description"
          autoSize={{ minRows: 3, maxRows: 6 }}
          value={editcardDescription}
          onChange={(e) => setEditCardDescription(e.target.value)}
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
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
        <Input.TextArea
          placeholder="Description"
          autoSize={{ minRows: 3, maxRows: 6 }}
          value={cardDescription}
          onChange={(e) => setCardDescription(e.target.value)}
        />
      </Modal>
      {/* Removed video playback modal */}
      {dispCard.length >= 1 ? (
        <div>
          {dispCard.map((card) => (
            <div key={card.id} style={{ padding: "0 20px" }}>
              <Card
                type="inner"
                title={card.name ? card.name.toUpperCase() : "UNTITLED"}
                style={{ width: "100%", marginBottom: 20 }}
                actions={[
                  <Tooltip title="Edit Card" key="edit">
                    <EditOutlined
                      onClick={() => {
                        editCard(card);
                      }}
                    />
                  </Tooltip>,
                  <SwapOutlined
                    key="swap"
                    onClick={() => showSwapModal(card.id)}
                  />,
                  <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this card?"
                    onConfirm={(e) => {
                      confirm(e, card.id);
                    }}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                    key="del"
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
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
                <p style={{ marginBottom: 0 }}>
                  Description:{" "}
                  <span style={{ overflowWrap: "anywhere", wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                    {card.description ? card.description : "NA"}
                  </span>
                </p>
              </Card>
            </div>
          ))}
          <div style={{ textAlign: "center" }}>
            <Button
              onClick={() => {
                showCardModal();
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
              onClick={() => {
                showCardModal();
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
