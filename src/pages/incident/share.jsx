import React, {PureComponent} from 'react'
import {Redirect, useLocation} from 'react-router-dom';
import {Button, Card, Form, Descriptions, Modal, Input} from 'antd'
import {incident_data} from '../../utils/mockUtils.new';
import logo from '../../assets/images/logo.png'
import Index from "../../components/pictures-wall";
import {format} from "../../utils/dateUtils";

/*
Incident的添加和更新的子路由组件
 */
class IncidentShare extends PureComponent {

    constructor(props) {
        super(props)
        this.incidents = incident_data.items;

        this.state = {

        }
    }

    /**
     * 表单提交
     */
    submit = () => {
        Modal.confirm({
            content: "请确认是否要提交？",
            cancelText: "取消",
            okText: "提交",
            onOk: () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        Modal.success({
                            content: "人脸识别成功！请等候联系",
                            okText: "确定",
                        });
                        resolve("success");
                    }, 1000)
                })
            }
        })
    }

    componentDidMount() {
        this.getIncidentFromUrl();
    }

    getIncident = (searchType, searchName) => {
        const size = this.incidents.length;
        let item = {};
        switch (searchType){
            case "theLostId":
                searchName = parseInt(searchName);
                for(let i = 0; i < size; i++){
                    if(this.incidents[i].lost_id === searchName)
                        item = this.incidents[i];
                }
                break;
            case "theLostName":
                for(let i = 0; i < size; i++){
                    if(this.incidents[i].lost_name === searchName)
                        item = this.incidents[i];
                }
                break;
            case "lostLocation":
                for(let i = 0; i < size; i++){
                    if(this.incidents[i].location.indexOf(searchName) !== -1)
                        item = this.incidents[i];
                }
                break;
            case "reporterName":
                for(let i = 0; i < size; i++){
                    if(this.incidents[i].reporter_name === searchName)
                        item = this.incidents[i];
                }
                break;
            case "reporterPhoneNumber":
                for(let i = 0; i < size; i++){
                    if(this.incidents[i].reporter_phone === searchName)
                        item = this.incidents[i];
                }
                break;
            default:
                item = {};
        }
        console.log(item);
        this.setState({
            "incident": item,
        })
    }

    getIncidentFromUrl(){
        const searchString = this.props.location.search.substring(1);
        console.log(searchString)
        const urlSearchParams = new URLSearchParams(searchString);
        let lost_id = urlSearchParams.get("id")
        this.getIncident("theLostId", lost_id);
    }


    render() {
        const {incident} = this.state;
        console.log(incident);
        return (
            <Card>
                {incident ? (
                    <>
                        <Descriptions
                            title="走失者信息"
                            bordered
                            column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}
                        >
                            <Descriptions.Item label="走失者照片">
                                <img src={require(`../../assets/images/走失老人照片/${incident.lost_id}.jpg`)} style={{width: "200px"}}/>
                            </Descriptions.Item>
                            <Descriptions.Item label="走失者姓名">{incident.lost_name}</Descriptions.Item>
                            <Descriptions.Item label="走失者性别">{incident.lost_age}</Descriptions.Item>
                            <Descriptions.Item label="走失地点">{incident.lost_place}</Descriptions.Item>
                            <Descriptions.Item label="走失者特征">{incident.lost_appearance}</Descriptions.Item>
                            <Descriptions.Item label="走失时间">{incident.lost_time}</Descriptions.Item>
                            <Descriptions.Item label="报失者姓名">{incident.reporter_name}</Descriptions.Item>
                            <Descriptions.Item label="报失者电话">{incident.reporter_phone}</Descriptions.Item>
                            <Descriptions.Item label="人脸识别上传区">
                                <Index />
                            </Descriptions.Item>
                            <Descriptions.Item label="提交人电话">
                                <Input placeholder="请输入电话号码" />
                            </Descriptions.Item>
                        </Descriptions>
                        <Button type={"primary"} style={{width: "100%"}} onClick={this.submit}>提交</Button>
                    </>
                ) : "无此信息"}
            </Card>
        )
    }
}

export default Form.create()(IncidentShare)

