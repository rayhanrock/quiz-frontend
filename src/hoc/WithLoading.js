import React, { Component } from 'react';
import { Loader, Segment, Dimmer, Image, Placeholder } from 'semantic-ui-react';

const withLoading = (WrappedComponent) => {
  return class WithLoading extends Component {
    state = {
      isLoading: true,
    };

    startLoading = () => {
      this.setState({ isLoading: true });
    };

    stopLoading = () => {
      this.setState({ isLoading: false });
    };

    render() {
      const { isLoading } = this.state;

      return (
        <>
          <WrappedComponent
            {...this.props}
            isLoading={isLoading}
            startLoading={this.startLoading}
            stopLoading={this.stopLoading}
          />
          {isLoading && (
            <Segment>
              <Dimmer
                active
                inverted>
                <Loader size='small'>Loading</Loader>
              </Dimmer>

              <Placeholder fluid>
                <Placeholder.Line length='full' />
                <Placeholder.Line length='full' />
                <Placeholder.Line length='full' />
                <Placeholder.Line length='full' />
                <Placeholder.Line length='full' />
              </Placeholder>
            </Segment>
          )}
        </>
      );
    }
  };
};

export default withLoading;
