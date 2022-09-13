import 'font-awesome/css/font-awesome.min.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { applyMiddleware, createStore } from 'redux'
import Thunk from 'redux-thunk'
import App from './App'
import './fonts/SukhumvitSet-Text.ttf'
import './index.css'
import { AppReducers } from './reducers'
import reportWebVitals from './reportWebVitals'

const middlewares = [Thunk]
const store = createStore(AppReducers, applyMiddleware(...middlewares))

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
