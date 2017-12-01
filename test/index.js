// Imports
const { expect } = require("chai");
const { subscribe, size, forEach } = require("lodash");
const middleware = require("../src");
const { buildStore, actions } = require("./mock-redux");

// callback tracker
let callbackTracker = {};

// subs
const subs = {
  sub1: [
    "sub1",
    "TEST_ACTION_1",
    data => (callbackTracker.sub1 = { [data.action.type]: data })
  ],
  sub2: [
    "sub2",
    "TEST_ACTION_1",
    data => (callbackTracker.sub2 = { [data.action.type]: data })
  ],
  sub2_1: [
    "sub2",
    "TEST_ACTION_2",
    data => (callbackTracker.sub2 = { [data.action.type]: data })
  ]
};

// Test suit - props
describe("all the properties exist", () => {
  it("has the middleware property:: function", () => {
    expect(middleware.middleware).to.be.a("function");
  });

  it("has the subscribe property::function", () => {
    expect(middleware.subscribe).to.be.a("function");
  });

  it("has the unsubscribe property::function", () => {
    expect(middleware.unsubscribe).to.be.a("function");
  });

  it("has the subscriptions property::object", () => {
    expect(middleware.subscriptions).to.be.an("object");
  });

  it("has the update property::function", () => {
    expect(middleware.update).to.be.a("function");
  });

  it("has the unsubscribeAction property::function", () => {
    expect(middleware.unsubscribeAction).to.be.an("function");
  });
});

// Test suit - subscribe
describe("subscribe function works", () => {
  describe("sub1", () => {
    middleware.subscribe(...subs.sub1);
    it("subscribe adds to the subscription to the middleware subs", () => {
      expect(middleware.subscriptions.hasOwnProperty("sub1")).to.be.true;
    });

    it("subscribed the correct action", () => {
      expect(middleware.subscriptions.sub1.hasOwnProperty("TEST_ACTION_1")).to
        .be.true;
    });
  });
});

// Test Suit - unsubscribeAction
describe("unsubscribeAction function works", () => {
  before("subscribe 2", () => {
    middleware.subscribe(...subs.sub2);
    middleware.subscribe(...subs.sub2_1);
  });
  it("unsubscribeAction(TEST_ACTION_2) removes this listener", () => {
    middleware.unsubscribeAction("sub2", "TEST_ACTION_2");
    expect(size(middleware.subscriptions.sub2)).to.equal(1);
  });

  it("if there are no more subs left, remove the subscription", () => {
    middleware.unsubscribeAction("sub2", "TEST_ACTION_1");
    expect(middleware.subscriptions.hasOwnProperty("sub2")).to.be.false;
  });
});

// Test Suit - unsubscribe
describe("unsubscribe function works", () => {
  it("unsubscribe(sub1) removes the subscription", () => {
    middleware.unsubscribe("sub1");
    expect(middleware.subscriptions.hasOwnProperty("sub1")).to.be.false;
  });
});

// Test Suit - middleware
describe("middleware works", () => {
  let store;

  before("subscribe", () => {
    forEach(subs, sub => {
      middleware.subscribe(...sub);
    });
    store = buildStore(middleware.middleware);
  });

  describe("no subs", () => {
    it("if no subscriptions none of the callbacks are executed", () => {
      store.dispatch(actions.test3);
      expect(size(callbackTracker)).to.equal(0);
    });
  });

  describe("only subs", () => {
    beforeEach("clean", () => {
      callbackTracker = {};
    });

    it("if subscribed only those that are subscribed will be fired::TEST_ACTION_1", () => {
      store.dispatch(actions.test1);
      const keys = Object.keys(callbackTracker);
      expect(keys.includes("sub1") && keys.includes("sub2")).to.be.true;
    });

    it("if subscribed only those that are subscribed will be fired::TEST_ACTION_2", () => {
      store.dispatch(actions.test2);
      const keys = Object.keys(callbackTracker);
      expect(!keys.includes("sub1") && keys.includes("sub2")).to.be.true;
    });
  });

  describe("no actions fired after unsub", () => {
    before("unsubscribe", () => {
      middleware.unsubscribe("sub1");
      middleware.unsubscribe("sub2");
      callbackTracker = {};
    });
    it("no actions fired", () => {
      store.dispatch(actions.test1);
      expect(size(callbackTracker)).to.equal(0);
    });
  });
});
