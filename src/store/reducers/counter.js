/*
 * @Author: dfh
 * @Date: 2021-03-09 19:28:05
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-09 19:29:21
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/store/reducers/counter.js
 */
import * as types from '../action-types';

const initialState = { num: 0 }
function counter(state = initialState, action) {
    switch (action.type) {
        case types.ADD:
            return { num: state.num + 1 };
        default:
            return state;
    }
}
export default counter;