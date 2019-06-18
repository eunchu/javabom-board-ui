import { withErrorBoundary } from "../../../hocs";

import PopupPresenter from "./popup.presenter";

const Popup = withErrorBoundary(PopupPresenter);

export default Popup;
