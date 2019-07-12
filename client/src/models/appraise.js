export const Constant = {
  status: {
    STATUS_WAIT_COMMIT: 0,
    STATUS_COMMITED: 1,
  },

  execState: {
    EXEC_STATUS_NULL: 0,
    EXEC_STATUS_CALCULATED_FENCE: 1,
    EXEC_STATUS_REQUESTED_FENCE_DATA: 2,
    EXEC_STATUS_REQUESTED_FENCE_HOT_DATA: 4,
    EXEC_STATUS_FINISH_CODE: 7,
  },

  dateReaultState: {
    /**
     * 结果等待提交
     */
    RESULT_DATE_STATUS_WAIT_SUBMIT: 'waitSubmit',
    /**
     * 结果已经提交，就是结论
     */
    RESULT_DATE_STATUS_SUBMITED: 'submited',
  },
};
