import React ,{Component,Fragment} from 'react';
import { Card,Form,Input ,Button } from 'antd';
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
        };

    }

    componentWillMount() {
        const _this = this;
        /*let myurl = window.location.pathname;*/

       let myurl = `dhushdusd=1004`;

        console.log(myurl);
        let second_url = myurl.split("=");
        console.log(second_url);
        let senor_id = second_url[1];
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
                        /*addr:_this.state.addr,
                        site:_this.state.site,*/
                    });
                })

            })
            .catch(function (error) {
                console.log(error);
            });

    };

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            /*labelCol:{
                xs:5,
                sm:5
            },
            wrapperCol:{
                xs:15,
                sm:15
            }*/
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
                                <Input onChange={this.handleSite} />
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
    handleSite=(e)=>{
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

                  let head = '(.*)(';
                  let tail = ')(.*)';
                  let body = _this.state.site.split('').join(')(.*)(');
                  let siteAddr= new RegExp(head + body + tail, 'i');  /*用户输入的值*/

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
                  }

                  /*if(_this.state.site.length>2){
                      let matchAdrr= addrValue.filter(function (item) {
                          //遍历数组，返回值为true保留并复制到新数组，false则过滤掉
                          return item.includes(_this.state.site);
                      });
                      console.log('match',matchAdrr);
                      console.log('_this.state.site',_this.state.site);
                      _this.setState({
                          addr:matchAdrr[0],
                      });
                  }*/

              })
              .catch(function (error) {
                  console.log(error);
              });

      });
    };
    handleOk=()=>{
        /*axios.post('http://tower.e-irobot.com:8886/api/sensor_data_mysql', {
            sensorID:this.state.sensorID,
            install_height:this.state.install_height,
            site:this.state.site,
        })
            .then(function () {
                console.log('handleOK');
            })
            .catch(function (error) {
                console.log(error);
            });*/
        axios.post('http://tower.e-irobot.com:8886/api/sensor_data_mysql',{
            sensorID:this.state.sensorID,
            install_height:this.state.install_height,
            site:this.state.site,
        })
            .then(response=>{
                console.log(response);
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
                this.handleOk();
            }
        });

    }

}
export default Form.create()(Code);