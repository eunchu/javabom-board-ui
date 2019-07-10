import { go, reduce } from "fxjs2";

// Actions
export const REQUEST_GET_ARTICLES = "articles/REQUEST_GET_ARTICLES";

export const ADD_ARTICLES = "articles/ADD_ARTICLES";

// Action Creators
export const requestGetArticles = () => ({
  type: REQUEST_GET_ARTICLES
});

export const addArticles = articles => ({
  type: ADD_ARTICLES,
  articles
});

// Init State
const initState = {
  articles: new Map()
};

// Reducer
export default function articlesReducer(state = initState, action = {}) {
  switch (action.type) {
    case ADD_ARTICLES:
      return applyAddArticles(state, action);
    default:
      return state;
  }
}

// Reducer Functions
function applyAddArticles(state, { articles }) {
  console.log(articles);

  const articleList = go(
    reduce(
      (all, article) => {
        all.set(article.id, article);
        return all;
      },
      new Map(state.articles),
      articles
    )
  );

  return {
    ...state,
    articles: articleList
  };
}
