import { ROUTE_PATH } from 'src/constants/key';
import { api } from '../apis/index';
import { REDUX_STATE } from '../states';

export const fetchHolidays = (params, onTotalChange, setLoading) => {
  if (setLoading) setLoading(true);
  return (dispatch, getState) => {
    api.holiday
      .getAll(params)
      .then(({ payload, total }) => {
        // console.log('fetchHolidays', payload);
        dispatch({ type: REDUX_STATE.holiday.SET_HOLIDAYS, payload });
        if (onTotalChange) onTotalChange(total);
        if (setLoading) setLoading(false);
      })
      .catch((err) => {
        if (setLoading) setLoading(false);
        console.log(err);
        if (err.response?.status >= 500)
          dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi o server' } });
        else if (err.response?.status >= 400)
          dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi o client' } });
        else dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi' } });
      });
  };
};

export const fetchHoliday = (id, setLoading) => {
  if (setLoading) setLoading(true);
  return (dispatch, getState) => {
    api.holiday
      .get(id)
      .then(({ payload }) => {
        payload.startDate = payload.startDate.replace('T00:00:00.000Z', '');
        payload.endDate = payload.endDate.replace('T23:59:59.000Z', '');
        dispatch({ type: REDUX_STATE.holiday.SET_HOLIDAY, payload });
        if (setLoading) setLoading(false);
      })
      .catch((err) => {
        if (setLoading) setLoading(false);
        console.log(err);
      });
  };
};

export const createHoliday = (params, history, success_msg) => {
  return (dispatch, getState) => {
    api.holiday
      .post(params)
      .then(({ payload }) => {
        payload.startDate = payload.startDate.replace('T00:00:00.000Z', '');
        payload.endDate = payload.endDate.replace('T23:59:59.000Z', '');
        dispatch({ type: REDUX_STATE.holiday.SET_HOLIDAY, payload });
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
        history.push(ROUTE_PATH.HOLIDAY + `/tab1.id=${payload.id}`);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status >= 500)
          dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi o server' } });
        else if (err.response?.status >= 400)
          dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi o client' } });
        else dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi' } });
      });
  };
};

export const updateHoliday = (data, success_msg) => {
  return (dispatch, getState) => {
    api.holiday
      .put(data)
      .then(({ payload }) => {
        payload.startDate = payload.startDate.replace('T00:00:00.000Z', '');
        payload.endDate = payload.endDate.replace('T23:59:59.000Z', '');
        dispatch({ type: REDUX_STATE.holiday.SET_HOLIDAY, payload });
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status >= 500)
          dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi o server' } });
        else if (err.response?.status >= 400)
          dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi o client' } });
        else dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi' } });
      });
  };
};

export const deleteHoliday = (id, success_msg) => {
  return (dispatch, getState) => {
    api.holiday
      .delete(id)
      .then(({ payload }) => {
        dispatch({ type: REDUX_STATE.holiday.DELETE_HOLIDAY, payload });
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status >= 500)
          dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi o server' } });
        else if (err.response?.status >= 400)
          dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi o client' } });
        else dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi' } });
      });
  };
};

export const setEmptyHoliday = () => {
  return {
    type: REDUX_STATE.holiday.EMPTY_VALUE,
    payload: [],
  };
};

export const fetchAllRequest = (params, onTotalChange) => {
  return (dispatch, getState) => {
    api.holiday
      .getAllRequest(params)
      .then(({ payload, total }) => {
        dispatch({ type: REDUX_STATE.holiday.GET_REQUESTS, payload });
        onTotalChange(total);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status >= 500)
          dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi o server' } });
        else if (err.response?.status >= 400)
          dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi o client' } });
        else dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi' } });
      });
  };
};

export const fetchPolicy = () => {
  return (dispatch, getState) => {
    api.holiday
      .getPolicy()
      .then(({ payload }) => {
        dispatch({ type: REDUX_STATE.holiday.SET_POLICY, payload });
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status >= 500)
          dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi o server' } });
        else if (err.response?.status >= 400)
          dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi o client' } });
        else dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi' } });
      });
  };
};

export const updatePolicy = (params, success_msg) => {
  return (dispatch, getState) => {
    api.holiday
      .setPolicy(params)
      .then(({ payload }) => {
        dispatch({ type: REDUX_STATE.holiday.SET_POLICY, payload: payload.value });
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status >= 500)
          dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi o server' } });
        else if (err.response?.status >= 400)
          dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi o client' } });
        else dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'error', message: 'Loi' } });
      });
  };
};
