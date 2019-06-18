import { withErrorBoundary } from "../../../hocs";

import HeaderPresenter from "./header.presenter";

const Header = withErrorBoundary(HeaderPresenter);

export default Header;
