import dva from 'dva';
import createLoading from 'dva-loading';
import history from './core/history';

const app = dva({
  history,
});
app.use(createLoading());
window.g_app = app;

app.model({
  namespace: 'pointer',
  ...require('./models/pointer').default,
});

export default app;
