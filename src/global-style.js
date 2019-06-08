import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset};

  html, body, #root {
    height: 100%;
    font-size: 12px;
  }
`;

export default GlobalStyle;
