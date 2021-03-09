/*
 * @Author: dfh
 * @Date: 2021-03-09 19:24:18
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-09 19:26:42
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/store/sagas/index.js
 */
import { take, put } from 'redux-saga/effects';
import * as types from '../action-types';

function* rootSaga() {
    for (let i = 0; i < 3; i++) {
        yield take(types.ASYNC_ADD);
        yield put({ type: types.ADD });
    }
}

export default rootSaga;