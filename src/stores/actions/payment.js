import { RESPONSE_CODE, ROUTE_PATH } from 'src/constants/key';
import { formatDateTimeToString } from 'src/utils/datetimeUtils';
import { api } from '../apis/index';
import { REDUX_STATE } from '../states';
//TODO
const handlePaymentExceptions = (err, dispatch, functionName) => {
  console.log(functionName + ' errors', err.response);
  let errorMessage = 'Đã có lỗi bất thường xảy ra';
  if (err?.response?.status) {
    switch (err.response.status) {
      case RESPONSE_CODE.SE_BAD_GATEWAY:
        errorMessage = 'Server bad gateway';
        break;
      case RESPONSE_CODE.SE_INTERNAL_SERVER_ERROR:
        errorMessage = 'Đã xảy ra lỗi ở server';
        break;
      case RESPONSE_CODE.CE_FORBIDDEN:
        errorMessage = 'Bạn không thể thực hiện chức năng này';
        break;
      case RESPONSE_CODE.CE_UNAUTHORIZED:
        errorMessage = 'Token bị quá hạn';
        break;
      default:
        break;
    }
  }
  dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: errorMessage } });
};
export const fetchPayments = (params, onTotalChange, setLoading, t) => {
  if (setLoading) setLoading(true);
  let type = {
    value: 'label.payment_value',
    percent: 'label.percent',
  };
  const _by = {
    gross: 'label.gross_salary',
    insurrance: 'label.social_insurance',
  };
  return (dispatch, getState) => {
    api.payment
      .getAll(params)
      .then(({ payload, total }) => {
        payload =
          payload && payload.length > 0
            ? payload.map((f) => {
                let by = t(_by[f.by]);
                f.type = f.type === 'value' ? t(type[f.type]) : f.value + ' % ' + by;
                f.createdAt = formatDateTimeToString(f.createdAt);
                return f;
              })
            : [];
        dispatch({ type: REDUX_STATE.payment.SET_PAYMENTS, payload });
        if (onTotalChange) onTotalChange(total);
      })
      .catch((err) => {
        handlePaymentExceptions(err, dispatch, 'fetchPayments');
      })
      .finally(() => {
        if (setLoading) setLoading(false);
      });
  };
};

export const fetchPayment = (id, setLoading) => {
  if (setLoading) setLoading(true);
  return (dispatch, getState) => {
    api.payment
      .get(id)
      .then(({ payload }) => {
        dispatch({ type: REDUX_STATE.payment.SET_PAYMENT, payload });
      })
      .catch((err) => {
        handlePaymentExceptions(err, dispatch, 'fetchPayment');
      })
      .finally(() => {
        if (setLoading) setLoading(false);
      });
  };
};

export const createPayment = (params, history, success_msg) => {
  return (dispatch, getState) => {
    api.payment
      .post(params)
      .then(({ payload }) => {
        dispatch({ type: REDUX_STATE.payment.SET_PAYMENT, payload });
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
        history.push(ROUTE_PATH.TAX_DETAIL + `/${payload.id}`);
      })
      .catch((err) => {
        handlePaymentExceptions(err, dispatch, 'createPayment');
      });
  };
};

export const updatePayment = (data, success_msg) => {
  return (dispatch, getState) => {
    api.payment
      .put(data)
      .then(({ payload }) => {
        dispatch({ type: REDUX_STATE.payment.SET_PAYMENT, payload });
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
      })
      .catch((err) => {
        handlePaymentExceptions(err, dispatch, 'updatePayment');
      });
  };
};

export const deletePayment = (id, success_msg, handleAfterDelete) => {
  return (dispatch, getState) => {
    api.payment
      .delete(id)
      .then(({ payload }) => {
        if (handleAfterDelete) handleAfterDelete();
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
      })
      .catch((err) => {
        handlePaymentExceptions(err, dispatch, 'deletePayment');
      });
  };
};

export const setEmptyPayment = () => {
  return {
    type: REDUX_STATE.payment.EMPTY_VALUE,
    payload: [],
  };
};
