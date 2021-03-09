/*
 * @Author: dfh
 * @Date: 2021-03-09 19:54:41
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-09 20:21:09
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/redux-saga/createChannel.js
 */

function createChannel() {
    let currentTakers = [];//当前的监听者

    /**
     * 开始监听某个动作
     * @param {*} actionType 动作类型 ASYNC_ADD
     * @param {*} taker 是next
     */
    function take(actionType, taker) {
        taker.actionType = actionType;
        taker.cancel = () => {
            currentTakers = currentTakers.filter(item => item !== taker);
        }
        currentTakers.push(taker);
    }

    /**
     * 触发takers数组中的函数执行，但是要配置动作类型
     * @param {*} action 动作对象 {type:types.ASYNC_ADD}
     */
    function put(action) {
        currentTakers.forEach(taker => {
            if (taker.actionType === action.type) {
                //take默认执行一次，需要取消掉
                taker.cancel();
                taker(action);//next函数
            }
        })
    }

    return { take, put };
}
export default createChannel;