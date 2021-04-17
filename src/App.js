import React, {Component} from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import IncidentAdd from "./pages/incident/add";
import IncidentUpdate from "./pages/incident/update";

/*
应用的根组件
 */
export default class App extends Component {

    render () {
    return (
        <BrowserRouter>
            <Switch>
                <Route path={"/add"} component={IncidentAdd}/>
                <Route path={"/update"} component={IncidentUpdate}/>
                <Redirect to={"/add"}/>
            </Switch>
        </BrowserRouter>
    )
  }
}
