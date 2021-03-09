## Redux-saga源码分析

### 1.为什么需要`redux-saga`

> redux-sage就是用来处理下述副作用(异步任务)的一个中间件。它是一个接收事件，并可能触发新事件的过程管理者，为应用管理复杂的流程

- [redux-saga](https://redux-saga-in-chinese.js.org/) 是一个 redux 的中间件，而中间件的作用是为 redux 提供额外的功能。
- 在reducers中的所有操作都是同步的并且是纯粹的，即reducer都是纯函数，纯函数：`一个函数的返回结果只依赖于它的参数，并且在执行过程中不会对外部产生副作用，即给它传什么，就输出什么。`
- 但是在实际的应用开发中，我们希望做一些异步且不纯粹的操作，这些函数式编程规范中称为`副作用`



### 2.`redux-saga`工作原理

- `redux-sage`采用`generator`函数来`yield effects`
- `generator`函数的作用是可以暂停执行，再次执行的时候从上次暂停的地方继续执行
- `effect`是一个简单的对象，该对象包含了一些给`middleware`解释执行的信息
- 可以通过`effects api`如：`fork`,`call`,`take`,`put`,`cancel`等来创建`effect`

### 3.`redux-sage`分类

- `worker saga `  工作saga，如调用API，进行异步请求，获取异步封装结果
- `watcher saga`  监听被派发的动作，当接受到`action`或者知道其被触发时，调用`worker`执行任务
- `root saga`立即启动`saga`的唯一入口

### 4.基本使用

```javascript
├── components
│   └── Counter.js
├── index.js
└── store
    ├── action-types.js
    ├── actions
    │   └── counter.js
    ├── index.js
    ├── reducers
    │   ├── counter.js
    │   └── index.js
    └── sagas
        └── index.js
```

#### 4.1.项目依赖

```javascript
npm install react-redux redux redux-sage -S
```

#### 4.2.`src/index.js`

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Counter from './components/Counter'

ReactDOM.render(<Provider store={store}>
    <Counter />
</Provider>, document.getElementById('root'));
```

#### 4.2.`components/Counter.js`

```javascript
import React from 'react';
import { connect } from 'react-redux';
import actions from '../store/actions/counter'

class Counter extends React.Component {
    render() {
        return <div>
            <p>{this.props.num}</p>
            <button onClick={this.props.add}>add</button>
            <button onClick={this.props.asyncAdd}>async add</button>
        </div>
    }
}
const mapStateToProps = state => state.counter;
export default connect(mapStateToProps, actions)(Counter);
```

#### 4.3.`store/index.js`

```javascript
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import rootSage from './sagas';

//引用saga中间件
const sagaMiddleware = createSagaMiddleware();
//应用saga中间件，一旦使用了这个中间件，那么之后的store.dispatch都会指向sagaMiddleware提供的dispatch方法
const store = applyMiddleware(sagaMiddleware)(createStore)(reducers);
//让根saga开始启动执行
sagaMiddleware.run(rootSage);
export default store;
```

#### 4.4.`store/action-types.js`

```javascript
const ADD='ADD';
const ASYNC_ADD='ASYNC_ADD';
export {
    ADD,
    ASYNC_ADD
}
```

#### 4.5.`actions/counter.js`

```javascript
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
```

#### 4.6.`reducers/index.js`

```javascript
import { combineReducers } from 'redux';
import counter from './counter';

export default combineReducers({
    counter
})
```

#### 4.7.`reducers/counter.js`

```javascript
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
```

#### 4.8.`sagas/index.js`

```javascript
import { take, put } from 'redux-saga/effects';
import * as types from '../action-types';

function* rootSaga() {
    for (let i = 0; i < 3; i++) {
      	//等待有人向仓库派发一个ASYNC_ADD这样的命令，等到了就会继续执行，等不到就卡在这里
      	//take只等待一次
        yield take(types.ASYNC_ADD);
      	//向仓库派发一个动作，让仓库调用store.dispatch({type:types.ADD})
        yield put({ type: types.ADD });
    }
}

export default rootSaga;
```

### 5.put&take实现

```javascript
redux-sage
├── createChannel.js
├── effectTypes.js
├── effects.js
├── index.js
└── runSaga.js
```

#### 5.1.`index.js`

```javascript
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
```

#### 5.2.`createChannel.js`

```javascript
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
```

#### 5.3.`effectTypes.js`

```javascript
/**监听特定的动作 */
export const TAKE = 'TAKE';

/**向仓库派发动作 */
export const PUT = 'PUT';
```

#### 5.4.`effects.js`

```javascript
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
```

#### 5.5.`runSaga.js`

```javascript
import * as effectTypes from './effectTypes';
/**
 * 执行或者说启动saga的方法
 * @param {*} evn { getState, dispatch, channel }
 * @param {*} saga 可以传过来的是一个生成器，也可能是一个迭代器
 */
function runSaga(evn, saga) {
    const { getState, dispatch, channel } = evn;
    //获取迭代器
    const it = saga();
    function next(value) {
        /**
         * effect={ type: effecTypes.TAKE, actionType=types.ASYNC_ADD }
         * effect= { type: effecTypes.PUT, action }
         */
        const { value: effect, done } = it.next(value);
        if (!done) {
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
                    break
                default:
                    break;
            }
        }
    }
    next();
}
export default runSaga;
```

### 6.支持产出`iterator`



