/*
 * @Author: dfh
 * @Date: 2021-03-09 20:10:04
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-10 07:25:03
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/redux-saga/effectTypes.js
 */

/**监听特定的动作 */
export const TAKE = 'TAKE';

/**向仓库派发动作 */
export const PUT = 'PUT';

/**开启一个新的子进程,一般不会阻塞当前saga */
export const FORK = 'FORK';

/**调用一个函数，默认此函数需要返回一个Promise */
export const CALL = 'CALL';

/**调用一个函数，此函数的最后一个参数应该是一个callback，调用callback可以让saga继续向下执行 */
export const CPS = 'CPS';