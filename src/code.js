import React ,{Component,Fragment} from 'react';
import { Card,Form,Input ,Button ,AutoComplete} from 'antd';
import axios from "axios";
import 'antd/dist/antd.css';


class Code extends Component{

    constructor(props){
        super(props);
        this.state={
            imei:'',
            imsi:'',
            sensorID:'',
            site:'',
            addr:'',
            install_height:'50',
            dataSource:[],
            addrArr:[],
        };

    }

    componentWillMount() {
        const _this = this;
        let myurl = window.location.href;

      /* let myurl = `dhushdusd=1004&hiewdcme`;*/

        console.log(myurl);
        let second_url = myurl.split("=");
        let sensor_url2=second_url[1];
        let second_url3 = sensor_url2.split("&");
        let senor_id = second_url3[0];
        console.log(senor_id);

        axios.post('http://tower.e-irobot.com:8886/api/get_identity', {
            sensorID:senor_id
        })
            .then(function (response) {
                console.log('初始值',JSON.parse(response.data));
                const res=JSON.parse(response.data);
                const imeis=res.data[0].imei;
                const imsis=res.data[0].imsi;
                console.log(imeis,imsis);

                _this.setState({
                    imei:imeis,
                    imsi:imsis,
                    sensorID:senor_id,
                },()=>{
                    _this.props.form.setFieldsValue({
                        imei:_this.state.imei,
                        imsi:_this.state.imsi,
                        sensorID:_this.state.sensorID,
                        install_height:_this.state.install_height,

                    });
                })

            })
            .catch(function (error) {
                console.log(error);
            });

    };
    componentDidMount(){
            this.setData();
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
                          {/*核对传感器信息*/}
                      </div>}>
                <Card title='传感器设置'  {...formItemLayout}>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item label='传感器IMEI：' {...formItemLayout}>
                            {getFieldDecorator('imei')(
                                <Input disabled/>
                            )}
                        </Form.Item>
                        <Form.Item label='传感器IMSI：' {...formItemLayout}>
                            {getFieldDecorator('imsi',{
                                rules: [{
                                    message: '请输入IMSI号',
                                }],
                            })(
                                <Input disabled />
                            )}
                        </Form.Item>
                        <Form.Item label='sensorID：' {...formItemLayout}>
                            {getFieldDecorator('sensorID')(
                                <Input disabled/>
                            )}
                        </Form.Item>
                        <Form.Item label='高度：' {...formItemLayout}>
                            {getFieldDecorator('install_height', {
                                rules: [{
                                    required: true, message: '请输入传感器安装高度',
                                }],
                            })(
                                <Input  onChange={this.handleHeight} />
                            )}
                        </Form.Item>
                        <Form.Item label='站点：' {...formItemLayout}>
                            {getFieldDecorator('site', {
                                rules: [{
                                    required: true, message: '请输入传感器站名',
                                }]
                            })(
                                <AutoComplete
                                    dataSource={this.state.dataSource}
                                    onSelect={(value)=>this.onSelect(value)}
                                    allowClear={true}
                                    onFocus={this.setData}
                                    style={{ marginBottom: 5 ,width:'100%'}}
                                >
                                <Input/>

                                </AutoComplete>
                            )}
                        </Form.Item>
                        <Form.Item label='地址：' {...formItemLayout}>
                            {getFieldDecorator('addr')(
                                <Input disabled />
                            )}
                        </Form.Item>
                        <Form.Item  style={{}} >
                            <div style={{width:"20%",display:"inline-block"}}/>
                            <Button type="primary" htmlType="submit">确定</Button>
                            <div style={{width:"20%",display:"inline-block"}}/>
                            <Button type="primary" >取消</Button>
                            <div style={{width:"20%",display:"inline-block"}}/>
                        </Form.Item>
                    </Form>
                </Card>
                </Card>
            </Fragment>
        );
    }
    setData=()=>{
        const _this = this;
            axios.post('http://tower.e-irobot.com:8886/api/select_site', {
                keyWords:'keyWords'
            })
                .then(function (response) {

                        const res = JSON.parse(response.data);
                        const data = res.data;
                        let addrValue = data.map(v => v.addr);
                        let siteValue = data.map(v => v.site);

                        _this.setState({
                            addrArr: addrValue,
                            dataSource: siteValue,
                        }, () => {
                            console.log('StatedataSource', _this.state.dataSource);
                        });

                })
                .catch(function (error) {
                    console.log(error);
                });
    };

    onSelect=(value)=>{
        const _this=this;
        let index=this.state.dataSource.indexOf(value);
        console.log('index',index);
        this.setState({
            site:this.state.dataSource[index],
            addr:this.state.addrArr[index],
        },()=>{
            _this.props.form.setFieldsValue({
                addr:_this.state.addr,
            });
        });


    };
    handleHeight=(e)=>{
        const _this = this;
        _this.setState({
            install_height:e.target.value,
        },()=>{
            _this.props.form.setFieldsValue({
                install_height:_this.state.install_height,

            });
        });
    };
    /*handleSite=(e)=>{
        const _this = this;
      _this.setState({
          site:e.target.value,
      },()=>{
          axios.post('http://tower.e-irobot.com:8886/api/select_site', {
              keyWords:this.state.site
          })
              .then(function (response) {
                  const res=JSON.parse(response.data);
                  const data=res.data;
                  let addrValue = data.map(v => v.addr);
                  let siteValue=data.map(v=>v.site);

                  /!*let head = '(.*)(';
                  let tail = ')(.*)';
                  let body = _this.state.site.split('').join(')(.*)(');
                  let siteAddr= new RegExp(head + body + tail, 'i');  /!*用户输入的值*!/
                  if(_this.state.site.length>2){
                      let matchAddr= addrValue.filter(function (item) {
                          //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                          return item.match(siteAddr);
                      });

                      _this.setState({
                          addr:matchAddr[0],
                      },()=>{
                          console.log('addr',_this.state.addr);
                          _this.props.form.setFieldsValue({
                              addr:_this.state.addr,
                              site:_this.state.site,
                          });
                      });
                  }*!/


              })
              .catch(function (error) {
                  console.log(error);
              });

      });
    };*/
    handleOk=()=>{

        axios.post('http://tower.e-irobot.com:8886/api/sensor_data_mysql',{
            sensorID:this.state.sensorID,
            install_height:this.state.install_height,
            site:this.state.site,
            Tower_addr:this.state.addr,
        })
            .then(response=>{
                console.log(response);
                console.log('site',this.state.site);

                this.setState({
                    imei:'',
                    imsi:'',
                    sensorID:'',
                    site:'',
                    addr:'',
                    install_height:'',
                },()=>{
                    this.props.form.setFieldsValue({
                        imei:this.state.imei,
                        imsi:this.state.imsi,
                        sensorID:this.state.sensorID,
                        install_height:this.state.install_height,
                        addr:this.state.addr,
                        site:this.state.site,
                    });
                })
            })
            .catch(error =>{
                console.log(error.message)
            });

    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err) => {
            if (err) {
                console.log('Received values of form: ','some');
            }else{
                this.handleOk2();
                /*this.handleOk();*/
            }
        });

    }
    handleOk2=()=>{
        const _this=this;
        axios.post('http://tower.e-irobot.com:8886/api/sensor_data_mysql',{
            sensorID:_this.state.sensorID,
            install_height:_this.state.install_height,
            site:_this.state.site,
            Tower_addr:_this.state.addr,
        }).then(
            response=>{
                console.log('response',_this.state.addr);
                _this.handleOk();
            }
        ).catch(error=>{
            console.log('error',error.message)
        })
};

}
export default Form.create()(Code);