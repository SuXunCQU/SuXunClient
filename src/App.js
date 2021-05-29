import React, {Component} from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import {Modal} from 'antd';
import IncidentAdd from "./pages/incident/add";
import IncidentUpdate from "./pages/incident/update";
import NotFound from "./pages/not-found/not-found";
import IncidentShare from "./pages/incident/share";

/*
应用的根组件
 */
export default class App extends Component {

    render () {
    return (
        <BrowserRouter>
            <Switch>
                <Redirect exact from='/' to='/add'/>
                <Route path={"/add"} component={IncidentAdd}/>
                <Route path={"/update"} component={IncidentUpdate}/>
                <Route path={"/share"} component={IncidentShare}/>
                <Route path={"/notFound"} component={NotFound}/>
                <Route component={NotFound}/>
            </Switch>
        </BrowserRouter>
    )
  }
}
