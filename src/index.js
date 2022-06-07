import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'font-awesome/css/font-awesome.min.css';
import reportWebVitals from './reportWebVitals';
import './fonts/SukhumvitSet-Text.ttf';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { allRedux } from './apps/payment/services/reducer/allredux';
import { createStore, applyMiddleware } from 'redux';
import Thunk from 'redux-thunk';
const middlewares = [Thunk];
const store = createStore(allRedux, applyMiddleware(...middlewares));

ReactDOM.render(
	<Provider store={store}>
		<React.StrictMode>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</React.StrictMode>
	</Provider>,
	document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
