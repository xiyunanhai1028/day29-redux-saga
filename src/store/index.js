/*
 * @Author: dfh
 * @Date: 2021-03-09 19:21:57
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-09 20:22:10
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/store/index.js
 */
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from '../redux-saga';
import reducers from './reducers';
import rootSage from './sagas';

//引用saga中间件
const sagaMiddleware = createSagaMiddleware();
//应用saga中间件，一旦使用了这个中间件，那么之后的store.dispatch都会指向sagaMiddleware提供的dispatch方法
const store = applyMiddleware(sagaMiddleware)(createStore)(reducers);
//让根saga开始启动执行
sagaMiddleware.run(rootSage);
export default store;