import React, { Component } from 'react';
import Home from './components/home/'
import Login from './components/authen/login/login'
import Register from './components/authen/register/register'
import ChangePassword from './components/authen/changePassword/changePassword'

import Header from './components/structure/header'
import Footer from './components/structure/footer'
import SideMenu from './components/structure/sideMenu'

//master
import User from './components/master/user'
import WeightScales from './components/master/weight_scales'
import WeightModels from './components/master/weight_models'
import model_calibration from './components/master/model_calibration'

//weight details
import WeightDeviceDetail from './components/weightDeviceDetail'

<<<<<<< HEAD
//verify
import VerifyFunction from './components/verifyFunction'

=======
>>>>>>> f646ad27af57caa9c44566e3a298f1d68ed2e136
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { setApp } from "./actions/app.action";
import { connect } from "react-redux";
import { key, YES } from './constants';


const isLoggedIn = () => {
  return localStorage.getItem(key.LOGIN_PASSED) === YES;
};

const isPowerUser = () => {
  if (
    localStorage.getItem(key.USER_LV) === "power" ||
    localStorage.getItem(key.USER_LV) === "admin"
  ) {
    return true;
  } else {
    return false;
  }
};

// Protected Route
const SecuredRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn() === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

const SecuredLVRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn() === true ? (
        isPowerUser() === true ? (
          <Component {...props} />
        ) : (
          <Redirect to="/home" />
        )
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

class App extends Component {

  componentDidMount() {
    this.props.setApp(this);
  }

  redirectToLogin = () => {
    return <Redirect to="/login" />;
  };

  render() {
    return (
      <Router>
        { isLoggedIn() && <Header />}
        { isLoggedIn() && <SideMenu />}
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />

          <SecuredRoute path="/changePassword" component={ChangePassword} />
          <SecuredRoute path="/home" component={Home} />
          
          {/* master */}
          <SecuredLVRoute path="/master/user" component={User} />
          <SecuredLVRoute path="/master/weightScales" component={WeightScales}/>
          <SecuredLVRoute path="/master/weightModels" component={WeightModels} />
          <SecuredLVRoute path="/master/weight_calculation/:model" component={model_calibration}/>

          <SecuredRoute path="/weightDeviceDetail/:device_id" component={WeightDeviceDetail} />
<<<<<<< HEAD
          <Route path="/VerifyFunction" component={VerifyFunction} />
=======
>>>>>>> f646ad27af57caa9c44566e3a298f1d68ed2e136
          
          <Route exact={true} path="/" component={this.redirectToLogin} />
          <Route exact={true} path="*" component={this.redirectToLogin} />
        </Switch>
        {isLoggedIn() && <Footer />}
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  setApp,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);