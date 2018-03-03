'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  FIREBASE_CONFIGURATION: JSON.stringify({
    apiKey: "AIzaSyBFO_ZJi9NHlRzqob2XGqb8lznL8h5Q9g4",
    authDomain: "confcompanionwebdev.firebaseapp.com",
    databaseURL: "https://confcompanionwebdev.firebaseio.com",
    projectId: "confcompanionwebdev",
    storageBucket: "confcompanionwebdev.appspot.com",
    messagingSenderId: "253632985946"
  })
})
