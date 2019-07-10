import { combineReducers } from "redux";

import articles from "./articles/articles";

const rootReduser = combineReducers({
  articles
});

export default rootReduser;
