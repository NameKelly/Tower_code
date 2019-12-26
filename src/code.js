import React ,{Component,Fragment} from 'react';
import { Card,Form,Input ,Button ,AutoComplete,Modal,Row,Col,message} from 'antd';
import axios from "axios";
import 'antd/dist/antd.css';

let timer;
const debounce = (func, wait ) => {
    // let timer = 0;
    return function(...args) {
        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
};

class Code extends Component{

    constructor(props){
        super(props);
        this.state={
            is_lower:'1',
            dataSource:[],
            addressSource:[],
            sensorID:'',
            company_id:'',
            site_id:'',
            site_address:''
        };

    }

    componentWillMount() {};
    componentDidMount(){
        this.getData();
            //this.setData();
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {

        };

        return(
            <Fragment>
                <Card
                    style={{margin:"0 auto",background:"#F5F5F5"}}
                      cover={<div
                          style={{height:"80px",background:"#FF6699",color:"white",textAlign:"center",heightLine:"20px",paddingTop:"50px"}} >
                         {/* 核对传感器信息*/}
                      </div>}>
                <Card title='传感器设置'  {...formItemLayout}>
                    <Form.Item label='sensorID：' {...formItemLayout} key={'1'}>
                        {getFieldDecorator('sensorID')(
                            <Input disabled/>
                        )}
                    </Form.Item>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item label='IMEI：' {...formItemLayout}>
                            {getFieldDecorator('imei')(
                                <Input disabled/>
                            )}
                        </Form.Item>
                        <Form.Item label='站点名称：' {...formItemLayout} key={'3'}>
                            {getFieldDecorator('site_name', {
                                rules: [{
                                    required: true, message: '请输入传感器站名',
                                }]
                            })(
                                <AutoComplete
                                    dataSource={this.state.dataSource}
                                    allowClear={true}
                                    onBlur={this.onBlur}
                                    onChange={debounce(this.getValue2)}
                                    onSelect={debounce(this.onSelect)}
                                    style={{ marginBottom: 5 ,width:'100%'}}
                                >
                                    <Input />

                                </AutoComplete>
                            )}
                        </Form.Item>
                        <Form.Item label='站点地址：' {...formItemLayout} key={'4'}>
                            {getFieldDecorator('site_address')(
                                <Input disabled />
                            )}
                        </Form.Item>
                        <Form.Item label='铁塔类型：' {...formItemLayout} key={'5'}>
                            {getFieldDecorator('tower_type')(
                                <Input disabled />
                            )}
                        </Form.Item>
                        <Form.Item label='上塔时间：' {...formItemLayout} key={'6'}>
                            {getFieldDecorator('lower_date')(
                                <Input disabled />
                            )}
                        </Form.Item>
                        <Form.Item  style={{}}  key={'7'}>
                            {/*<div style={{width:"20%",display:"inline-block"}}/>
                            <Button type="primary" htmlType="submit">确定</Button>
                            <div style={{width:"20%",display:"inline-block"}}/>
                            <Button type="primary" >取消</Button>
                            <div style={{width:"20%",display:"inline-block"}}/>*/}
                            <Row>
                                <Col span={'9'}/>
                                <Col span={'6'}><Button type={'primary'} onClick={this.upOrdown}>{this.state.is_lower=='0'?'下塔':'上塔'}</Button></Col>
                                <Col span={'9'}/>
                            </Row>
                        </Form.Item>
                    </Form>
                </Card>
                </Card>
            </Fragment>
        );
    }
    getSensorID=()=>{
        let myurl = window.location.href;
        //let myurl=`http://tower.e-irobot.com:8886/codeAddTower.aspx?sensorID=1010&1111111`;
        console.log(myurl);
        let second_url = myurl.split("=");
        let sensor_url2=second_url[1];
        let second_url3 = sensor_url2.split("&");
        let senor_id = second_url3[0];
        console.log(senor_id);
        return senor_id;
    };
    getData=()=>{
        const _this=this;
        let sensor_id=this.getSensorID();
        console.log(sensor_id);
        axios.get('http://112.33.57.75:2323/api/select_machine_sm', {  //params参数必写 , 如果没有参数传{}也可以
            params: {
                sensorID:sensor_id
            }
        }).then(function (res) {
            const data = JSON.parse(res.data);
            let info=data.data[0];
            console.log('res',info);
           _this.setData2(info);
        }).catch(function (err) {
            console.log(err);
        });
    };
    onBlur=()=>{
        this.setState({
            dataSource:[],
        })
    };
    setData2=(info)=>{
        this.setState({
            is_lower:info.is_lower,
            sensorID:info.sensorID,
            company_id:info.company_id,
            site_id:info.site_id,
            site_address:info.site_address
        },()=>{
            const { getFieldDecorator } = this.props.form;
            this.props.form.setFieldsValue({
                sensorID:info.sensorID,
                imei:info.imei,
                site_name:info.site_name,
                site_address:this.state.site_address,
                tower_type:info.tower_type,
                lower_date:info.upper_date
            });
        });
    };
    onSelect=(value)=>{
        console.log('value',value);
    };

    getValue2=(value)=>{
        let _this=this;
    axios.get('http://112.33.57.75:2323/api/select_site_name', {  //params参数必写 , 如果没有参数传{}也可以
        params: {
            site_name:value,
            company_id:this.state.company_id
}
})
.then(function (res) {
    let data = JSON.parse(res.data);
    let dataSource=data.data;
    console.log('dataSource',dataSource);
   let nameArr=dataSource.map(item=>item.site_name);
   let addrArr=dataSource.map(item=>item.site_address);
   if(dataSource.length=='1'){
       _this.setState({
           dataSource:nameArr,
           addressSource:addrArr,
           site_id:dataSource[0].site_id
       },()=>{
           _this.props.form.setFieldsValue({
               site_address:_this.state.addressSource[0],
               tower_type:dataSource[0].tower_type,
               lower_date:dataSource[0].upper_date
           });
       });
   }else{
       _this.setState({
           dataSource:nameArr,
           addressSource:addrArr
       });
   }
    console.log('arr',_this.state.dataSource,_this.state.addressSource);
/*    if(_this.state.dataSource.length==1){
        _this.props.form.setFieldsValue({
            site_address:_this.state.addressSource[0],
            tower_type:dataSource[0].tower_type,
            lower_date:dataSource[0].upper_date
        });
    }*/
    })
        .catch(function (err) {
            console.log(err);
        });
};
    upOrdown=()=>{
        let type=this.state.is_lower=='0'?'下塔':'上塔';
        axios.post('http://112.33.57.75:2323/api/upper_tower', {
            type,
            site_id:this.state.site_id,
            sensorID:this.state.sensorID,
            company_id:this.state.company_id
        })
            .then(function (res) {
                console.log('res',res);
                let info=JSON.parse(res.data);
                message.success(info.msg);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    //旧
   handleOk=()=>{

   };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err) => {
            if (err) {
                console.log('Received values of form: ','some');
            }else{
                this.handleOk();
            }
        });

    };

}
export default Form.create()(Code);
