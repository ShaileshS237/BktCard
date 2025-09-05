import React, { useEffect, useState } from "react";
import Navbar from "../Componets/Navbar";
import { Divider, Card, Row, Col } from "antd";
import { getHistory as readHistory, subscribe } from "../services/storage";

const History = () => {
  const [history, setHistory] = useState([]);

  const load = () => {
    setHistory(readHistory());
  };

  useEffect(() => {
    load();
    const unsub = subscribe(() => load());
    return unsub;
  }, []);

  return (
    <div>
      <Navbar />

      <Divider orientation="left" plain>
        Watch History
      </Divider>

      <div>
        <Row gutter={[16, 16]}>
          {history.map((val) => (
            <Col
              className="gutter-row"
              xs={24}
              sm={12}
              md={8}
              lg={6}
              key={val.id || val.time}
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
