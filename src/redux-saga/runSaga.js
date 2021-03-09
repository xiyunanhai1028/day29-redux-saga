/*
 * @Author: dfh
 * @Date: 2021-03-09 20:01:54
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-09 22:37:18
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/redux-saga/runSaga.js
 */
import * as effectTypes from './effectTypes';
/**
 * 执行或者说启动saga的方法
 * @param {*} evn { getState, dispatch, channel }
 * @param {*} saga 可以传过来的是一个生成器，也可能是一个迭代器
 */
function runSaga(env, saga) {
    const { getState, dispatch, channel } = env;
    //saga可能是生成器，也可能是迭代器
    const it = typeof saga === 'function' ? saga() : saga;
    function next(value) {
        /**
         * effect={ type: effecTypes.TAKE, actionType=types.ASYNC_ADD }
         * effect= { type: effecTypes.PUT, action }
         */
        const { value: effect, done } = it.next(value);
        if (!done) {
            //effect可能是一个迭代器 yield add();
            if (typeof effect[Symbol.iterator] === 'function') {
                runSaga(env, effect);
                next();//不会阻塞当前saga
            } else {
                switch (effect.type) {
                    case effectTypes.TAKE://等待有人向仓库派发ASYNC_ADD类型的动作
                        //如果有人向仓库派发了ASYNC_ADD动作，就执行channel.put(action)
                        //它会等待动作发生，如果等不到，就卡在这里
                        channel.take(effect.actionType, next);
                        break;
                    case effectTypes.PUT://put这个effect不会阻塞当前的saga执行，派发完成后，立即向下执行
                        dispatch(effect.action);
                        //派发完成后，立即向下执行
                        next();
                        break;
                    case effectTypes.FORK://开启一个新的子进程去执行saga
                        runSaga(env, effect.saga);
                        next();//不会阻塞当前saga
                        break;
                    default:
                        break;
                }
            }
        }
    }
    next();
}
export default runSaga;