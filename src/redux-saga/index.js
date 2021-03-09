/*
 * @Author: dfh
 * @Date: 2021-03-09 19:49:47
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-09 20:19:49
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/redux-saga/index.js
 */

import runSaga from './runSaga';
import createChannel from "./createChannel";

/**
 * 
 * @returns 返回的是一个中间件
 */
function createSagaMiddleware() {
    const channel = createChannel();
    let boundRunSaga;
    function sagaMiddleware(middlewareApi) {//{getState,dispatch}
        const { getState, dispatch } = middlewareApi;
        //把this绑定为null，把runSaga的第一个参数绑定为env={ getState, dispatch, channel }
        boundRunSaga = runSaga.bind(null, { getState, dispatch, channel })
        return function (next) {//下一次中间件的dispatch方法
            return function (action) {//动作
                //原生的dispatch方法执行，直接把async_add给仓库，又给reducer，reducer不能识别，什么也不做
                next(action);
                //执行channel.put
                channel.put(action)
            }
        }
    }
    sagaMiddleware.run = saga => boundRunSaga(saga);
    return sagaMiddleware;
}
export default createSagaMiddleware;
