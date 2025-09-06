import React from 'react';
import { Provider } from 'react-redux';
import store from './store/index';

const TestComponent = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Redux Test</h1>
      <p>If you can see this, Redux Provider is working!</p>
    </div>
  );
};

function TestApp() {
  return (
    <Provider store={store}>
      <TestComponent />
    </Provider>
  );
}

export default TestApp;