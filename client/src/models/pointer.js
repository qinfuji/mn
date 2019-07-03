import {fetch, remove, create, submit, update} from '../services/pointer';

export default {
  namespace: 'pointer',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    detail: null,
  },

  effects: {
    *fetch({payload = {}}, {call, put}) {
      const response = yield call(fetch, payload);
      if (response) {
        yield put({
          type: 'saveList',
          payload: response,
        });
      }
    },
  },

  reducers: {},
};
