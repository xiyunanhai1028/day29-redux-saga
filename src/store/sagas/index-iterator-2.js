/*
 * @Author: dfh
 * @Date: 2021-03-09 19:24:18
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-09 22:11:44
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/store/sagas/index.js
 */
import { take, put } from '../../redux-saga/effects';
import * as types from '../action-types';

function* add() {
  //向仓库派发一个动作，让仓库调用store.dispatch({type:types.ADD})
  yield put({ type: types.ADD });
}
function* rootSaga() {
  for (let i = 0; i < 3; i++) {
    //等待有人向仓库派发一个ASYNC_ADD这样的命令，等到了就会继续执行，等不到就卡在这里
    //take只等待一次
    yield take(types.ASYNC_ADD);
    yield add();
  }
}

export default rootSaga;