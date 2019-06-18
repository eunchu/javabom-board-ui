import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Header from "../../2-molecules/header/header";

import Board from "../../3-organisms/board/board";

/* ======= Components ======= */

/* === style === */

const Container = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;

  padding: 2rem;
`;

const HeaderArea = styled.div`
  height: 4rem;
`;

const BoardArea = styled.div`
  height: 0;
  flex-grow: 1;
`;

/* === main === */

const BoardPage = () => {
  return (
    <Container>
      <HeaderArea>
        <Header />
      </HeaderArea>
      <BoardArea>
        <Board />
      </BoardArea>
    </Container>
  );
};

export default BoardPage;
