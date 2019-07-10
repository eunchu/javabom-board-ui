import { go } from "fxjs2";

const PREFIX = "[Request|articles]";

export const getArticleList = async () => {
  try {
    console.log(`${PREFIX} : getArticleList`);
    return (
      await go(`http://localhost:8080/api/v1/articles`, fetch, res => {
        if (res.status === 204) return { success: true, articles: "No data" };
        return res.json();
      }),
      json => json.data,
      articles => ({ success: true, articles })
    );
  } catch (error) {
    console.log(`${PREFIX} : getArticleList\n[error] : `, error);

    return {
      success: false,
      articles: []
    };
  }
};
