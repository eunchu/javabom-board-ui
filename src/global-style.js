import { createGlobalStyle } from "styled-components";
// import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`

  @import "~normalize.css";
  @import "~@blueprintjs/core/lib/css/blueprint.css";
  @import "~@blueprintjs/icons/lib/css/blueprint-icons.css";

  html, body, #root {
    height: 100%;
    font-size: 12px;
  }
`;

export default GlobalStyle;
