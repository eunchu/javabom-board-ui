import { withErrorBoundary } from "./hocs";

import AppPresenter from "./app.presenter";

const App = withErrorBoundary(AppPresenter);

export default App;
