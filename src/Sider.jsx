import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import map from 'lodash/map';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';
import 'antd/lib/menu/style';
import 'antd/lib/icon/style';
import formatMenuPath from './utils/formatMenuPath';
import getFlatMenuKeys from './utils/getFlatMenuKeys';
import getMeunMatchKeys from './utils/getMeunMatchKeys';
import urlToList from './utils/urlToList';

const { SubMenu } = Menu;

const propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  appName: PropTypes.string,
  appLogo: PropTypes.string,
  appBaseUrl: PropTypes.string,
  width: PropTypes.number,
  menuData: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    path: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.array,
  })),
  pathname: PropTypes.string,
};

const defaultProps = {
  prefixCls: 'react-sider',
  className: '',
  style: {},
  appName: '',
  appLogo: '',
  appBaseUrl: '/',
  width: 256,
  menuData: [],
  pathname: '/',
};

const getOpenKeys = (pathname, flatMenuKeys) => (
  getMeunMatchKeys(flatMenuKeys, urlToList(pathname))
);

class Sider extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.pathname !== prevState.pathname) {
      return {
        pathname: nextProps.pathname,
        openKeys: getOpenKeys(
          nextProps.pathname,
          getFlatMenuKeys(formatMenuPath(nextProps.menuData)),
        ),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const { menuData, pathname } = props;

    this.fullPathMenuData = formatMenuPath(menuData);
    this.flatMenuKeys = getFlatMenuKeys(this.fullPathMenuData);

    this.state = {
      pathname,
      openKeys: getOpenKeys(pathname, this.flatMenuKeys),
    };
  }

  handleOpenChange = (openKeys) => {
    this.setState({
      openKeys,
    });
  };

  renderMenu = data => (
    map(data, (item) => {
      if (item.children) {
        return (
          <SubMenu
            key={item.path}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.name}</span>
              </span>
            }
          >
            {this.renderMenu(item.children)}
          </SubMenu>
        );
      }

      return (
        <Menu.Item key={item.path}>
          <Link to={item.path} href={item.path}>
            <Icon type={item.icon} />
            <span>{item.name}</span>
          </Link>
        </Menu.Item>
      );
    })
  )

  renderSiderHeader = () => {
    const {
      appBaseUrl,
      prefixCls,
      appLogo,
      appName,
    } = this.props;

    return (
      <Link to={appBaseUrl} href={appBaseUrl}>
        <div className={`${prefixCls}-header`}>
          <img
            className={`${prefixCls}-logo`}
            src={appLogo}
            alt="logo"
          />
          <div className={`${prefixCls}-appName`}>
            {appName}
          </div>
        </div>
      </Link>
    );
  }

  renderSiderBody = () => {
    const { prefixCls } = this.props;
    const { openKeys } = this.state;

    return (
      <div className={`${prefixCls}-body`}>
        <Menu
          style={{ padding: '16px 0', width: '100%' }}
          mode="inline"
          theme="dark"
          openKeys={openKeys}
          selectedKeys={openKeys}
          onOpenChange={this.handleOpenChange}
        >
          {this.renderMenu(this.fullPathMenuData)}
        </Menu>
      </div>
    );
  }

  render() {
    const {
      prefixCls,
      className,
      style,
      width,
    } = this.props;

    const classes = `${prefixCls} ${className}`;
    const styles = {
      ...style,
      width,
    };

    return (
      <div className={classes} style={styles}>
        {this.renderSiderHeader()}
        {this.renderSiderBody()}
      </div>
    );
  }
}

Sider.propTypes = propTypes;
Sider.defaultProps = defaultProps;
export default Sider;
