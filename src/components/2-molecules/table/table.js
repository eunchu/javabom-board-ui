import { withErrorBoundary } from "../../../hocs";

import TablePresenter from "./table.presenter";

const Table = withErrorBoundary(TablePresenter);

export default Table;
