import React, { useEffect, useState } from "react";
import { Col, Empty, Row, Divider, Popconfirm, message, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Cards from "./Cards";
import { getBuckets, subscribe, deleteBucket } from "../services/storage";

const Buckets = () => {
  const [buckets, setBuckets] = useState([]);

  const load = () => {
    setBuckets(getBuckets());
  };

  useEffect(() => {
    load();
    const unsub = subscribe(() => load());
    return unsub;
  }, []);

  const handleDeleteBucket = (id) => {
    deleteBucket(id);
    message.success("Bucket deleted");
  };

  return buckets.length >= 1 ? (
    <Row gutter={[16, 16]}>
      {buckets.map((bucket) => (
        <Col className="gutter-row" xs={24} sm={12} md={8} key={bucket.id}>
          <Divider orientation="left" style={{ color: "#6699ff" }}>
            {bucket.name}
          </Divider>
          <Cards cid={bucket.id} bname={bucket.name} />
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
            <Popconfirm
              title="Delete this bucket?"
              description="This will remove the bucket and all its cards."
              onConfirm={() => handleDeleteBucket(bucket.id)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>Delete Bucket</Button>
            </Popconfirm>
          </div>
        </Col>
      ))}
    </Row>
  ) : (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 200,
        }}
        description={<span>Oops, No Bucket Found</span>}
      >
      </Empty>
    </div>
  );
};

export default Buckets;
