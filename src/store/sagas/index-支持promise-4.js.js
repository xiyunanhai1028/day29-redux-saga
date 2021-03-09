/*
 * @Author: dfh
 * @Date: 2021-03-09 19:24:18
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-09 22:27:23
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/store/sagas/index.js
 */
import { take, put, takeEvery } from '../../redux-saga/effects';
import * as types from '../action-types';

const delay = ms => new Promise((resolve) => {
  setTimeout(resolve, ms);
})
function* add() {
  yield delay(2000);
  //向仓库派发一个动作，让仓库调用store.dispatch({type:types.ADD})
  yield put({ type: types.ADD });
}

function* rootSaga() {
  yield takeEvery(types.ASYNC_ADD, add)
}

export default rootSaga;