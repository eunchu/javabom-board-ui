import { connect } from "react-redux";

import { withErrorBoundary } from "../../../hocs";

import { requestGetArticles } from "../../../ducks/modules/articles/articles";

import BoardPresenter from "./board.presenter";

// const mapStateToProps = () => {};
const mapDispatchToProps = dispatch => ({
  init: () => dispatch(requestGetArticles)
});

const Board = connect(
  null,
  mapDispatchToProps
)(withErrorBoundary(BoardPresenter));

export default Board;
