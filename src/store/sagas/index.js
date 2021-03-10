/*
 * @Author: dfh
 * @Date: 2021-03-09 19:24:18
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-10 07:59:46
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/store/sagas/index.js
 */
import { take, put, takeEvery, call, cps, all } from '../../redux-saga/effects';
import * as types from '../action-types';

function* add1() {
  for (let i = 0; i < 3; i++) {
    yield take(types.ASYNC_ADD);
    yield put({ type: types.ADD })
  }
  return 'add1';
}

function* add2() {
  for (let i = 0; i < 2; i++) {
    yield take(types.ASYNC_ADD);
    yield put({ type: types.ADD })
  }
  return 'add2';
}

function* rootSaga() {
  yield all([add1, add2]);
}

export default rootSaga;