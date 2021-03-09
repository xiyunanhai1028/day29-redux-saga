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

#### 4.1.项目依赖

```javascript
npm install react-redux redux redux-sage -S
```

