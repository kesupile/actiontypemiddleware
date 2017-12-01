"use strict";

// Imports
const { forEach, size } = require("lodash");

// Definitions
const exporter = Object.create(null);

// subscriptions
Object.defineProperty(exporter, "subscriptions", {
  value: {},
  enumerable: true
});

// subscribe
Object.defineProperty(exporter, "subscribe", {
  value: function(name, actionType, callback) {
    if (!name || typeof name !== "string") {
      throw new Error("name must be a string");
    } else if (!actionType || typeof actionType !== "string") {
      throw new Error("acitonType must be a string");
    } else if (!callback || typeof callback !== "function") {
      throw new Error("callback must be a function");
    }
    if (
      this.subscriptions.hasOwnProperty(name) &&
      !this.subscriptions[name].hasOwnProperty(actionType)
    ) {
      this.subscriptions[name][actionType] = callback;
    } else if (!this.subscriptions.hasOwnProperty(name)) {
      this.subscriptions[name] = {
        [actionType]: callback
      };
    } else {
      console.warn("action type already subscribed by that name");
    }
  }
});

// unsubscribe
Object.defineProperty(exporter, "unsubscribe", {
  value: function(name) {
    if (!this.subscriptions.hasOwnProperty(name)) {
      console.warn("NO SUBSCRIPTION OF THAT NAME");
    } else {
      delete this.subscriptions[name];
    }
  }
});

// update
Object.defineProperty(exporter, "update", {
  value: function(subs, data) {
    subs.forEach(name => {
      this.subscriptions[name][data.action.type](data);
    });
  }
});

// middleware
Object.defineProperty(exporter, "middleware", {
  value: function({ dispatch, getState }) {
    return next => action => {
      const subs = Object.keys(exporter.subscriptions).filter(name =>
        exporter.subscriptions[name].hasOwnProperty(action.type)
      );
      if (subs.length > 0)
        exporter.update(subs, { timeStamp: Date.now(), action });
      return next(action);
    };
  }
});

// unsubscribeAction
Object.defineProperty(exporter, "unsubscribeAction", {
  value: function(name, action) {
    if (!this.subscriptions.hasOwnProperty(name)) {
      console.warn("NO SUBSCRIPTION OF THAT NAME");
    } else if (!this.subscriptions[name].hasOwnProperty(action)) {
      console.warn("NO SUBSCRIPTION OF THAT NAME");
    } else {
      delete this.subscriptions[name][action];
      // if no more subs delete
      if (size(this.subscriptions[name]) === 0) {
        this.unsubscribe(name);
      }
    }
  }
});

module.exports = exporter;
