/*
 * @Author: dfh
 * @Date: 2021-03-09 19:21:57
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-09 19:33:12
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/store/index.js
 */
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import rootSage from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = applyMiddleware(sagaMiddleware)(createStore)(reducers);
sagaMiddleware.run(rootSage);
export default store;