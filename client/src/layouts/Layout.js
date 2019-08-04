import React, {Component} from 'react';
import Authorized from '../utils/Authorized';
import Exception403 from '@/components/Exception/403';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import pathToRegexp from 'path-to-regexp';

function formatter(data, parentAuthority) {
  return data
    .map((item) => {
      if (!item.path) {
        return null;
      }
      const result = {
        ...item,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority);
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter((item) => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

class Layout extends Component {
  constructor(props) {
    super(props);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  componentDidUpdate() {
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
  }

  getBreadcrumbNameMap = () => {
    const routerMap = {};
    const mergeMenuAndRouter = (data) => {
      data.forEach((menuItem) => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  };

  matchParamsPath = (pathname) => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find((key) => pathToRegexp(key).test(pathname));
    return this.breadcrumbNameMap[pathKey];
  };

  getMenuData = () => {
    const {
      route: {routes},
    } = this.props;
    return memoizeOneFormatter(routes);
  };

  render() {
    const {
      children,
      location: {pathname},
    } = this.props;
    const routerConfig = this.matchParamsPath(pathname);

    return (
      <Authorized authority={routerConfig && routerConfig.authority} noMatch={<Exception403 />}>
        {children}
      </Authorized>
    );
  }
}

export default Layout;
