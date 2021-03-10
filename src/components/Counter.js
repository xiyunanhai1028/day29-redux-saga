/*
 * @Author: dfh
 * @Date: 2021-03-09 19:19:30
 * @LastEditors: dfh
 * @LastEditTime: 2021-03-10 08:50:13
 * @Modified By: dfh
 * @FilePath: /day29-redux-saga/src/components/Counter.js
 */
import React from 'react';
import { connect } from 'react-redux';
import actions from '../store/actions/counter'

class Counter extends React.Component {
    render() {
        return <div>
            <p>{this.props.num}</p>
            <button onClick={this.props.add}>add</button>
            <button onClick={this.props.asyncAdd}>async add</button>
            <button onClick={this.props.stop}>stop</button>
        </div>
    }
}
const mapStateToProps = state => state.counter;
export default connect(mapStateToProps, actions)(Counter);