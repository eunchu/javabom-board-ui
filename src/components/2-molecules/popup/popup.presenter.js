import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

/* ======= Components ======= */

/* === style === */

const Background = styled.div`
  position: absolute;
`;

/* === main === */

const Popup = ({ isShowing, hide }) =>
  isShowing
    ? ReactDOM.createPortal(
        <Background>
          <div>
            hello, i'm modal
            <button onClick={hide}>&times;</button>
          </div>
        </Background>,
        document.body
      )
    : null;

export default Popup;
