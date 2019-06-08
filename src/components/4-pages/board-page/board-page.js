import { withErrorBoundary } from "../../../hocs";

import BoardPagePresenter from "./board-page.presenter";

const BoardPage = withErrorBoundary(BoardPagePresenter);

export default BoardPage;
