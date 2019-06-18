import { withErrorBoundary } from "../../../hocs";

import BoardPresenter from "./board.presenter";

const Board = withErrorBoundary(BoardPresenter);

export default Board;
