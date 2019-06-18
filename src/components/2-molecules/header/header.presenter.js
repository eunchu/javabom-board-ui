import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* ======= Constants ======= */

/* === style === */

const FLEX = {
  display: "flex"
};

/* ======= Components ======= */

/* === style === */

const Container = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 1rem;

  background-color: #e2fadd;
`;

const Logo = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

/* === main === */

function Header({ width, height }) {
  return (
    <Container width={width} height={height}>
      <Logo>EUN.B</Logo>
      <div style={FLEX}>
        <div>My github</div>
        <a
          target="_blank"
          href="https://github.com/eunchu/javabom-board-ui"
          style={{ marginLeft: "1.2rem" }}
        >
          UI
        </a>
        <a
          target="_blank"
          href="https://github.com/eunchu/javabom-board-api"
          style={{ marginLeft: "1.2rem" }}
        >
          API
        </a>
      </div>
    </Container>
  );
}

Header.defaultProps = {
  width: "100%",
  height: "100%"
};

Header.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string
};

export default Header;
