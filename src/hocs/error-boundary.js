import React, { Component } from "react";

const FallbackCompDefault = () => <h1>Oops! Something went wrongㅜㅜ</h1>;
const onErrorDefault = (error, info) => {};
export const withErrorBoundary = (
  Comp,
  FallbackComp = FallbackCompDefault,
  onError = onErrorDefault
) => {
  class WithErrorBoundary extends Component {
    constructor(props) {
      super(props);

      this.state = {
        error: null
      };

      this.resetError = this.resetError.bind(this);
    }

    render() {
      const {
        props,

        state: { error },

        resetError
      } = this;

      return error ? (
        <FallbackComp
          error={error}
          onReset={resetError}
          originalProps={props}
        />
      ) : (
        <Comp {...props} />
      );
    }

    componentDidCatch(error, info) {
      onError(error, info);
      this.setState({ error });
    }

    resetError() {
      this.setState({ error: null });
    }
  }

  WithErrorBoundary.displayName = `withErrorBoundary(${Comp.displayName ||
    Comp.name})`;

  return WithErrorBoundary;
};
