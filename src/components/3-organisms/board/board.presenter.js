import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button } from "antd";

import LogoIcon from "../../../assets/img/flower.png";

import { useModal } from "../../../jhooks";

import Popup from "../../2-molecules/popup/popup";
import Table from "../../2-molecules/table-antd/table";
import { init } from "events";

/* ======= Constants ======= */

const FLEX = {
  display: "flex"
};

const COLUMNS = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Article",
    dataIndex: "article",
    key: "article"
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date"
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: () => (
      <span>
        <a href="javascript:;">Delete</a>
      </span>
    )
  }
];

/* ======= Components ======= */

/* === style === */

const Container = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};

  padding-top: 4rem;
`;

const Title = styled.h1`
  margin: 0;
`;

const TableOptionArea = styled.div`
  margin-bottom: 0.8rem;
`;

/* === main === */

function Board({ width, height, init }) {
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const DATA = [
    {
      key: "1",
      name: "chu.b",
      article: "this is article",
      date: `${new Date()}`,
      action: ""
    }
  ];

  const { isShowing, toggle } = useModal();

  return (
    <Container width={width} height={height}>
      <div style={{ ...FLEX, marginBottom: "1.6rem" }}>
        <img
          style={{ width: "2.4rem", height: "2.4rem", marginRight: "0.8rem" }}
          src={LogoIcon}
          alt="Logo"
        />
        <Title>Javabom project 1 [게시판 만들기]</Title>
      </div>

      <TableOptionArea>
        <Button style={{ marginRight: "0.4rem" }}>Create</Button>
        <Button>Delete</Button>
      </TableOptionArea>

      <Table
        size="small"
        columns={COLUMNS}
        dataSource={DATA}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => toggle()
          };
        }}
      />
      <Popup isShowing={isShowing} hide={toggle} />
    </Container>
  );
}

Board.defaultProps = {
  width: "100%",
  height: "100%"
};

Board.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string
};

export default Board;
