import dva from 'dva';
import createLoading from 'dva-loading';
import history from './core/history';

const app = dva({
  history,
});
app.use(createLoading());
window.g_app = app;
// app.model({
//   namespace: 'course',
//   ...require('./models/course').default,
// });

export default app;
