/*
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import {Button,List,Input} from 'antd';
import store from './store/store.js';
import axios from 'axios'


class Todolist extends Component {
    constructor(props){
        super(props);
        this.state=store.getState();
        store.subscribe(this.handleStoreChange.bind(this));


        this.handleInputChange=this.handleInputChange.bind(this);
        this.handleBtnClick=this.handleBtnClick.bind(this);
    }


  render() {
    return (
      <div style={{marginLeft:'10px',marginTop:'10px'}}>
        <h1>Hello World!</h1>
        <Input onChange={this.handleInputChange} value={this.state.inputValue} placeholder="请输入..." style={{width:'300px'}}/>
          <Button onClick={this.handleBtnClick} type="primary" style={{marginLeft:'10px'}}>提交</Button>
          <List
              style={{marginTop:'10px',width:'300px'}}
              size="small"
              bordered
              dataSource={this.state.list}
              renderItem={(item,index) => (<List.Item onClick={this.handleItemDelete.bind(this,index)}>{item}</List.Item>)}
          />
      </div>
    );
  }
    handleStoreChange(){
        this.setState(
            store.getState()
        )
    }
    handleInputChange(e){
            const action={
                type:'change_input_value',
                value:e.target.value
            }
            store.dispatch(action);
    }

    handleBtnClick(){
            const action={
            type:'add_todo_item',
        }
        store.dispatch(action);
    }
    handleItemDelete(index){
            const action={
                type:'delete_todo_item',
                index
            }
        store.dispatch(action);
    }
    //axios请求数据
    componentDidMount(){
            axios.get('/list')
                .then((res)=>{
                    console.log(res.data)
                })
    }



}

export default Todolist;
*/
