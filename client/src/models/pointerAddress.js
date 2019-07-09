import {fetch, remove, create, submit, update} from '../services/pointer';

export const Constant = {
  status: {
    STATUS_WAIT_SUBMIT: 'waitSubmit',
    STATUS_WAIT_ESTIMATE: 'waitEstimate',
    STATUS_NOT_ESTIMATE: 'notEstimate',
    STATUS_ESTIMATE_FINISH: 'estimateFinished',
    STATUS_ALL_FINISH: 'allFinished',
    STATUS_DELETE: 'deleted',
  },

  statusLabels: {
    waitSubmit: '待提交',
    waitEstimate: '待评估',
    notEstimate: '未评估',
    estimateFinished: '评估完成',
    waitConclusion: '等待结论',
    allFinished: '结论完成',
    deleted: '已删除',
  },

  type: {
    TYPPE_CHANCE: 'chance', //机会点
    TYPPE_EXIST_SHOP: 'existShop', //已有店
    TYPPE_COMPETITION_SHOP: 'competitionShop', //竞品店
  },
  typeLabel: {
    chance: '机会点',
    existShop: '已有店',
    competitionShop: '竞品店', //竞品店
  },
};

export default {
  namespace: 'pointerAddress',
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

  reducers: {
    saveList(state, action) {
      const retData = action.payload.data;
      return {
        ...state,
        data: {
          list: retData.records,
          pagination: {
            total: retData.total,
            pageSize: retData.size,
            current: retData.current,
          },
        },
      };
    },
  },
};
