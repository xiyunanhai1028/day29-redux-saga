/*
 * @Author: dfh
 * @Date: 2021-03-09 19:27:53
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-09 19:30:12
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/store/reducers/index.js
 */
import { combineReducers } from 'redux';
import counter from './counter';

export default combineReducers({
    counter
})