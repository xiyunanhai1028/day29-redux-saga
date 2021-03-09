/*
 * @Author: dfh
 * @Date: 2021-03-09 19:22:52
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-09 19:23:51
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/store/actions/counter.js
 */
import * as types from '../action-types';

const actions = {
    add() {
        return { type: types.ADD };
    },
    asyncAdd() {
        return { type: types.ASYNC_ADD };
    }
}
export default actions;