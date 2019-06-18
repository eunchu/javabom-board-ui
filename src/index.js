import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import store from "./ducks";
import GlobalStyle from "./global-style";
import App from "./app";

// antd css
import "antd/dist/antd.css";

// Blue print css
import "../node_modules/normalize.css";
import "../node_modules/@blueprintjs/core/lib/css/blueprint.css";
import "../node_modules/@blueprintjs/table/lib/css/table.css";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Provider store={store}>
    <GlobalStyle />
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
