/*
 * @Author: dfh
 * @Date: 2021-03-09 20:09:49
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-10 08:01:22
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/redux-saga/effects.js
 */
import * as effecTypes from './effectTypes';

/**
 * 
 * @param {*} actionType 
 * @returns 返回值是一个普通对象，称之为指令对象
 */
export function take(actionType) {
    return { type: effecTypes.TAKE, actionType };
}

export function put(action) {
    return { type: effecTypes.PUT, action }
}

/**
 * 以新的子进程的方式执行saga
 * @param {*} saga 
 * @returns 
 */
export function fork(saga) {
    return { type: effecTypes.FORK, saga };
}

/**
 * 等待每一次的actionType派发，然后一单独的子进程调用saga执行
 * @param {*} actionType 
 * @param {*} saga 
 * @returns 
 */
export function takeEvery(actionType, saga) {
    function* takeEveryHelper() {
        while (true) {//写一个死循环，每次都执行
            yield take(actionType);//等待一个动作类型
            yield fork(saga);//开启一个新的子进程执行saga
        }
    }
    //开一个新的子进程执行 takeEveryHelper这个saga
    return fork(takeEveryHelper);
}


export function call(fn, ...args) {
    return { type: effecTypes.CALL, fn, args }
}

export function cps(fn, ...args) {
    return { type: effecTypes.CPS, fn, args };
}

export function all(effects) {
    return { type: effecTypes.ALL, effects };
}