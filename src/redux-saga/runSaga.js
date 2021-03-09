/*
 * @Author: dfh
 * @Date: 2021-03-09 20:01:54
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-10 07:30:52
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
    function next(value, isError) {
        let result;
        if (isError) {
            result = it.throw(value);//迭代器出错了
        } else {
            result = it.next(value);
        }
        const { value: effect, done } = result;
        if (!done) {
            //effect可能是一个迭代器 yield add();
            if (typeof effect[Symbol.iterator] === 'function') {
                runSaga(env, effect);
                next();//不会阻塞当前saga
            } else if (typeof effect.then === 'function') {//支持promise
                effect.then(next);//会阻塞，直到promise成功后会自动走next
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
                    case effectTypes.CALL:
                        effect.fn(...effect.args).then(next)
                        break;
                    case effectTypes.CPS:
                        effect.fn(...effect.args, (err, data) => {
                            if (err) {//如果err不为null，说明错误了，next第一个参数是错误对象
                                next(err, true);
                            } else {
                                next(data);
                            }
                        })
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