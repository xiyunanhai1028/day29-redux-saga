/*
 * @Author: dfh
 * @Date: 2021-03-09 19:24:18
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-10 07:32:12
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/store/sagas/index.js
 */
import { take, put, takeEvery, call, cps } from '../../redux-saga/effects';
import * as types from '../action-types';

const delay = ms => new Promise((resolve) => {
  setTimeout(resolve, ms);
})

const delay2 = (ms, callback) => {
  setTimeout(() => {
    //第一个参数是错误结果
    callback(null,'ok')
  }, ms);
}
function* add() {
  //告诉saga中间件执行delay2反复，参数是1000
  yield cps(delay2, 1000);
  //向仓库派发一个动作，让仓库调用store.dispatch({type:types.ADD})
  yield put({ type: types.ADD });
}

function* rootSaga() {
  yield takeEvery(types.ASYNC_ADD, add)
}

export default rootSaga;