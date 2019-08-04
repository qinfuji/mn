import dynamic from './core/dynamic';
import {getQueryString} from './utils/misc';
export default [
  {
    path: '/',
    component: dynamic({
      loader: () => import('./layouts/Layout'),
    }),
    routes: [
      {
        path: '/',
        redirect: {pathname: '/listPointAddress', search: '?token=' + getQueryString('token')},
        exact: true,
      },

      {
        path: '/createPointAddress',
        authority: '/pointAddressManager/save',
        name: '新建点址',
        component: dynamic({
          loader: () => import('./pages/pointer'),
        }),
        exact: true,
      },

      {
        path: '/createPointAddress/:id',
        authority: '/pointAddressManager',
        name: '点址管理',
        component: dynamic({
          loader: () => import('./pages/pointer'),
        }),
        exact: true,
      },

      {
        path: '/listPointAddress',
        authority: '/listPointAddress',
        name: '点址列表',
        component: dynamic({
          loader: () => import('./pages/list'),
        }),
        exact: true,
      },

      {
        path: '/createAppraise/pointerAddressId/:pointerAddressId/appraise',
        name: '评估管理',
        authority: '/appraiseManager',
        component: dynamic({
          loader: () => import('./pages/appraise'),
        }),
        exact: true,
      },

      {
        path: '/createAppraise/pointerAddressId/:pointerAddressId/conclusion',
        name: '任务结论',
        authority: '/conclusionManager',
        component: dynamic({
          loader: () => import('./pages/appraise'),
        }),
        exact: true,
      },

      {
        path: '/categroyLabel',
        authority: '/categroyLabel',
        name: '分类管理',
        component: dynamic({
          loader: () => import('./pages/categroyLabels'),
        }),
        exact: true,
      },
    ],
  },
];
