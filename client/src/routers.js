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
        redirect: '/pointAddress',
        exact: true,
      },

      {
        path: '/pointAddress',
        component: dynamic({
          loader: () => import('./pages/pointer'),
        }),
        exact: true,
      },
    ],
  },
];
