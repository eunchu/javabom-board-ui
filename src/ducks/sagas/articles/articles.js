import { all, call, takeEvery, put } from "redux-saga/effects";

import { articles as articleRequests } from "../../../requests";

import {
  REQUEST_GET_ARTICLES,
  addArticles
} from "../../modules/articles/articles";

// Constants

const PREFIX = "[Ducks/saga|articles]";

// workers
export function* processRequestGetArticles() {
  try {
    const { success, articles } = yield call(articleRequests.articleRequests);
    if (success) yield put(addArticles(articles));
  } catch (error) {
    if (error) yield console.log("error");
  }
}

// watcher
function* watchRequestGetArticles() {
  yield takeEvery(REQUEST_GET_ARTICLES, processRequestGetArticles);
}

export default function* articlesSaga() {
  try {
    yield all([watchRequestGetArticles()]);
  } catch (error) {
    console.log(`${PREFIX}\n [error] : `, error);
    yield call(articlesSaga);
  }
}
