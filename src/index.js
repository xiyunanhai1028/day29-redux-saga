/*
 * @Author: dfh
 * @Date: 2021-03-09 18:56:49
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-09 19:33:33
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/index.js
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Counter from './components/Counter'

ReactDOM.render(<Provider store={store}>
    <Counter />
</Provider>, document.getElementById('root'));