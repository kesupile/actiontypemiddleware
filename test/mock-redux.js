const { createStore, applyMiddleware } = require("redux");

const actions = {
  test1: {
    type: "TEST_ACTION_1"
  },
  test2: {
    type: "TEST_ACTION_2"
  },
  test3: {
    type: "TEST_ACTION_3"
  }
};

const state = {
  value: 0
};

const reducer = (initialState = state, action) => {
  switch (action.type) {
    case "TEST_ACTION_1":
      return { ...initialState, value: 1 };
      break;
    case "TEST_ACTION_2":
      return { ...initialState, value: 2 };
      break;
    case "TEST_ACTION_3":
      return { ...initialState, value: 3 };
      break;
    default:
      return { ...initialState, value: 0 };
  }
};

const buildStore = middleware =>
  createStore(reducer, applyMiddleware(middleware));

module.exports = {
  actions,
  buildStore
};
