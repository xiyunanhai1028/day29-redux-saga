/*
 * @Author: dfh
 * @Date: 2021-03-09 19:24:18
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-10 08:36:53
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/store/sagas/index.js
 */
import { take, put, takeEvery, call, cps, all, delay, fork, cancel } from '../../redux-saga/effects';
import * as types from '../action-types';

function* add() {
  while (true) {
    yield delay(1000);
    yield put({ type: types.ADD });
  }
}

function* rootSaga() {
  const task = yield fork(add);
  yield take(types.STOP_ADD);
  yield cancel(task);
}

export default rootSaga;