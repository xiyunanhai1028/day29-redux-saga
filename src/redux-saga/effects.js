/*
 * @Author: dfh
 * @Date: 2021-03-09 20:09:49
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-09 20:13:36
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