/*
 * @Author: dfh
 * @Date: 2021-03-09 20:10:04
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-09 22:28:22
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/redux-saga/effectTypes.js
 */

/**监听特定的动作 */
export const TAKE = 'TAKE';

/**向仓库派发动作 */
export const PUT = 'PUT';

/**开启一个新的子进程,一般不会阻塞当前saga */
export const FORK = 'FORK';