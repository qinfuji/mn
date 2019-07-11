import dynamic from './core/dynamic';
export default [
  {
    path: '/',
    component: dynamic({
      loader: () => import('./layouts/Layout'),
    }),
    routes: [
      {
        path: '/',
        redirect: '/listPointAddress',
        exact: true,
      },

      {
        path: '/createPointAddress',
        component: dynamic({
          loader: () => import('./pages/pointer'),
        }),
        exact: true,
      },

      {
        path: '/createPointAddress/:id',
        component: dynamic({
          loader: () => import('./pages/pointer'),
        }),
        exact: true,
      },

      {
        path: '/listPointAddress',
        component: dynamic({
          loader: () => import('./pages/list'),
        }),
        exact: true,
      },

      {
        path: '/createAppraise/pointerAddressId/:pointerAddressId/:vtype',
        component: dynamic({
          loader: () => import('./pages/appraise'),
        }),
        exact: true,
      },

      {
        path: '/categroyLabel',
        component: dynamic({
          loader: () => import('./pages/categroyLabels'),
        }),
        exact: true,
      },
    ],
  },
];
