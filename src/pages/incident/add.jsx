import React, {PureComponent} from 'react'
import {Button, Card, Col, DatePicker, Form, Icon, Input, message, Radio, Row} from 'antd'
import TextArea from "antd/es/input/TextArea";

import Index from '../../components/pictures-wall'
import SearchBar from "../../components/search-bar";
import {reqAddOrUpdateIncident} from '../../api'
import Locale from 'antd/es/date-picker/locale/zh_CN';


import moment from "moment";
import 'moment/locale/zh-cn';
import {format, formatTime} from "../../utils/dateUtils";
import {validateAge, validateIDNumber} from "../../utils/validateUtils";

moment.locale('zh-cn');

const {Item} = Form

/*
Incident的添加和更新的子路由组件
 */
class IncidentAdd extends PureComponent {

    constructor(props) {
        super(props)

        // 创建用来保存ref标识的标签对象的容器
        this.pictureWall = React.createRef();
        this.incident = {};

        this.state = {
            isUpdate: false,
            searchTypes: [
                {
                    value: 'theLostName',
                    title: '按走失者姓名搜索',
                },
                {
                    value: 'lostLocation',
                    title: '按走失地点搜索',
                },
                {
                    value: 'reporterName',
                    title: '按报失者姓名搜索',
                },
                {
                    value: 'reporterPhoneNumber',
                    title: '按报失者电话搜索',
                },
            ]
        }
    }


    /**
     * 表单提交
     */
    submit = () => {
        // 进行表单验证, 如果通过了, 才发送请求
        this.props.form.validateFields(async (error, values) => {
            console.log(values)
            if (!error) {

                // 1. 收集数据, 并封装成incident对象
                // const {
                //     theLostName,
                //     theLostGender,
                //     theLostAge,
                //     theLostIDNumber,
                //     lostTime,
                //     lostLocation,
                //     theLostFeatures,
                //     reporterName,
                //     reporterGender,
                //     reporterIDNumber,
                //     reporterIDPictures,
                //     relationship,
                //     reporterLocation,
                //     reporterPhoneNumber,
                //     reporterWeChat
                // } = values
                const theLostPictures = this.pictureWall.current.getImgs() || [];

                // // 格式化走失时间为字符串
                values.lostTime = values['lostTime'].format(format);

                const incident = {...values, theLostPictures};

                // 如果是更新, 需要添加id
                if (this.isUpdate) {
                    incident.id = this.incident.id
                }

                // TO DO
                // 2. 调用接口请求函数去添加/更新
                const result = await reqAddOrUpdateIncident(incident)

                // 3. 根据结果提示
                if (result.status === 0) {
                    message.success(`${this.isUpdate ? '更新' : '添加'}事件成功!`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}事件失败!`)
                }
            }
        })
    }

    /**
     * 获取数据
     */
    getIncidents = (searchType, searchName) => {
        return async () => {
            // const pageNum = 1;
            this.searchType = searchType; // 保存searchType, 让其他方法可以看到
            this.searchName = searchName; // 保存searchName, 让其他方法可以看到
            const pageNum = this.pageNum;
            console.log('pageNum', pageNum);
            this.setState({loading: true}) // 显示loading

            // 如果搜索关键字有值, 说明我们要做搜索分页
            let result = {
                status: 0,
                data: {
                    total: 0,
                    list: [],
                }
            }
            // // TO DO
            // if (searchName) {
            //     result = await reqSearchIncidents({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
            // } else { // 一般分页请求
            //     result = await reqIncidents(pageNum, PAGE_SIZE)
            // }

            this.setState({loading: false}) // 隐藏loading
            if (result.status === 0) {
                // 取出分页数据, 更新状态, 显示分页列表
                const {total, list} = result.data
                this.setState({
                    total,
                    incidents: list
                })
            }
            console.log(searchType, searchName);
        }
    }


    render() {
        const {isUpdate, incidents, searchTypes} = this.state;
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: {
                xs: {span: 12},
                sm: {span: 6},
            },  // 左侧label的宽度
            wrapperCol: {
                xs: {span: 16},
                sm: {span: 10},
            }, // 右侧包裹的宽度
        }

        // 头部左侧标题
        const title = (
            <div style={{display: "flex", justifyContent: "flex-start", alignItems: "center", }}>
                <Button
                    style={{marginRight: "16px"}}
                    type={isUpdate ?"default": "primary"}
                    onClick={() => {
                        this.setState(() => ({
                            isUpdate: false,
                        }))
                    }}
                >添加事件</Button>
            </div>
        )

        const {getFieldDecorator} = this.props.form

        return (
            <Card title={title}>
                <Form
                    {...formItemLayout}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Item label='走失者姓名'>
                                {
                                    getFieldDecorator('theLostName', {
                                        // initialValue: incident.theLostName,
                                        rules: [
                                            {required: true, message: '必须输入走失者姓名'}
                                        ]
                                    })(<Input placeholder='请输入走失者姓名'/>)
                                }
                            </Item>
                        </Col>
                        <Col span={12}>
                            <Item label='报失者姓名'>

                                {
                                    getFieldDecorator('reporterName', {
                                        // initialValue: incident.reporterName,
                                        rules: [
                                            {required: true, message: '必须输入报失者姓名'}
                                        ]
                                    })(<Input placeholder='请输入报失者姓名'/>)
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Item label="走失者性别">
                                {
                                    getFieldDecorator('theLostGender', {
                                        // initialValue: incident.theLostGender,
                                        rules: [
                                            {required: true, message: '必须输入走失者性别'}
                                        ]
                                    })(<Radio.Group
                                        onChange={(e)=>{this.incident['theLostGender']=e.target.value}}
                                        name='theLostGender'>
                                        <Radio value={1}>男</Radio>
                                        <Radio value={0}>女</Radio>
                                    </Radio.Group>)
                                }
                            </Item>
                        </Col>
                        <Col span={12}>
                            <Item label="报失者性别">
                                {
                                    getFieldDecorator('reporterGender', {
                                        // initialValue: incident.reporterGender,
                                        rules: [
                                            {required: true, message: '必须输入报失者性别'}
                                        ]
                                    })(<Radio.Group
                                        onChange={(e)=>{this.incident['reporterGender']=e.target.value}}
                                        name='reporterGender'>
                                        <Radio value={1}>男</Radio>
                                        <Radio value={0}>女</Radio>
                                    </Radio.Group>)
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Item label="走失者年龄">

                                {
                                    getFieldDecorator('theLostAge', {
                                        // initialValue: incident.theLostAge,
                                        rules: [
                                            {required: true, message: '必须输入走失者年龄'},
                                            {validator: validateAge}
                                        ]
                                    })(<Input type='number' placeholder='请输入走失者年龄'/>)
                                }
                            </Item>
                        </Col>
                        <Col span={12}>
                            <Item label='报失者联系电话'>

                                {
                                    getFieldDecorator('reporterPhoneNumber', {
                                        // initialValue: incident.reporterPhoneNumber,
                                        rules: [
                                            {required: true, message: '必须输入报失者联系电话'}
                                        ]
                                    })(<Input placeholder='请输入报失者联系电话'/>)
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Item label="走失时间">
                                {
                                    getFieldDecorator('lostTime', {
                                        // 在DatePicker中使用getFieldDecorator需要设置initialValue，而不能用defaulValue
                                        // initialValue: moment(incident.lostTime, format),
                                        rules: [
                                            {required: true, message: '必须输入走失时间'},
                                        ]
                                    })(<DatePicker
                                        locale={Locale}
                                        placeholder="请输入走失时间"
                                        format={format}
                                        showTime={{format: formatTime}}
                                    />)
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Item label="走失地点">
                                {
                                    getFieldDecorator('lostLocation', {
                                        // initialValue: incident.lostLocation,
                                        rules: [
                                            {required: true, message: '必须输入走失地点'},
                                        ]
                                    })(<Input placeholder='请输入走失地点'/>)
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Item label="走失者照片">
                                {
                                    getFieldDecorator('theLostPicture', {
                                        // initialValue: incident.theLostPicture,
                                        rules: [
                                            {required: true, message: '必须上传走失者照片'},
                                        ]
                                    })(<Index ref={this.pictureWall}/>)
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} offset={10}>
                            <Item>
                                <Button type='primary' onClick={this.submit}>提交</Button>
                            </Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(IncidentAdd)


/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
 */

/*
使用ref
1. 创建ref容器: thi.pictureWall = React.createRef()
2. 将ref容器交给需要获取的标签元素: <PictureWall ref={this.pictureWall} />
3. 通过ref容器读取标签元素: this.pictureWall.current
 */
