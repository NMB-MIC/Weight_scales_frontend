import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { key } from "../../../constants";

class SideMenu extends Component {
  renderMasters = (pathname) => {
    if (
      localStorage.getItem(key.USER_LV) === "power" ||
      localStorage.getItem(key.USER_LV) === "admin"
    ) {
      return (
        <li className="nav-item has-treeview">
          <a
            className={
              pathname.includes('/master')
                ? "nav-link active"
                : "nav-link"
            }
          >
            <i className="nav-icon fas fa-clipboard-list" />
            <p>
              Manage master
              <i className="fas fa-angle-left right" />
            </p>
          </a>
          <ul className="nav nav-treeview" style={{ display: "none" }}>
            <li className="nav-item">
              <Link
                to="/master/user"
                className={
                  pathname === "/master/user"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>User manage</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/master/weightScales"
                className={
                  pathname === "/master/weightScales"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>Weight scales</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/master/weightModels"
                className={
                  pathname === "/master/weightModels"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>Weight Models</p>
              </Link>
            </li>
          </ul>
        </li>
      )
    }
  }

<<<<<<< HEAD
  renderVerify = (pathname) => {
    return (
      <li className="nav-item has-treeview">
        <a
          className={
            pathname.includes('/VerifyFunction')
              ? "nav-link active"
              : "nav-link"
          }
        >
          <i className="nav-icon fas fa-clipboard-list" />
          <p>
            Verify
            <i className="fas fa-angle-left right" />
          </p>
        </a>
        <ul className="nav nav-treeview" style={{ display: "none" }}>
          <li className="nav-item">
            <Link
              to="/VerifyFunction"
              className={
                pathname === "/VerifyFunction"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>Verify function</p>
            </Link>
          </li>
        </ul>
      </li>
    )
  }

=======
>>>>>>> f646ad27af57caa9c44566e3a298f1d68ed2e136
  render() {
    const { pathname } = this.props.location;

    return (
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="/home" className="brand-link">
          <img
            src="/icon/weightscaleslogo_MIa_1.ico"
            alt="Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: '.8', backgroundColor: '#FEFEFE' }} />
          <span className="brand-text font-weight-light">Weight scales</span>
        </a>
        {/* Sidebar */}
        <div className="sidebar os-host os-theme-light os-host-overflow os-host-overflow-y os-host-resize-disabled os-host-transition os-host-scrollbar-horizontal-hidden">
          <div className="os-resize-observer-host observed"><div className="os-resize-observer" style={{ left: 0, right: 'auto' }} /></div><div className="os-size-auto-observer observed" style={{ height: 'calc(100% + 1px)', float: 'left' }}><div className="os-resize-observer" /></div><div className="os-content-glue" style={{ margin: '0px -8px', width: 249, height: 520 }} /><div className="os-padding"><div className="os-viewport os-viewport-native-scrollbars-invisible" style={{ overflowY: 'scroll' }}>
            <div className="os-content" style={{ padding: '0px 8px', height: '100%', width: '100%' }}>
              {/* Sidebar Menu */}
              <nav className="mt-2">

                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                  {this.renderMasters(pathname)}
<<<<<<< HEAD
                  {this.renderVerify(pathname)}
=======
>>>>>>> f646ad27af57caa9c44566e3a298f1d68ed2e136
                </ul>
              </nav>
              {/* /.sidebar-menu */}
            </div></div></div><div className="os-scrollbar os-scrollbar-horizontal os-scrollbar-unusable os-scrollbar-auto-hidden"><div className="os-scrollbar-track"><div className="os-scrollbar-handle" style={{ width: '100%', transform: 'translate(0px, 0px)' }} /></div></div><div className="os-scrollbar os-scrollbar-vertical os-scrollbar-auto-hidden"><div className="os-scrollbar-track"><div className="os-scrollbar-handle" style={{ height: '38.3652%', transform: 'translate(0px, 0px)' }} /></div></div><div className="os-scrollbar-corner" /></div>
        {/* /.sidebar */}
      </aside>
    )
  }
}

export default withRouter(SideMenu);
