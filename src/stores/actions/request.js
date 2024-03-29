import { ROUTE_PATH } from 'src/constants/key';
import { formatDate, formatDateTimeScheduleToString, formatDateTimeToString, parseLocalTime } from 'src/utils/datetimeUtils';
import { handleExceptions } from 'src/utils/handleExceptions';
import { api } from '../apis/index';
import { REDUX_STATE } from '../states';

export const fetchLeaveRequests = (params, setLoading) => {
  return (dispatch, getState) => {
    api.leaveRequest
      .getAll(params)
      .then(({ payload, total }) => {
        payload =
          payload && payload?.length > 0
            ? payload.reduce((accumulator, req) => {
                if (req?.profile?.id === 1) {
                  total -= 1;
                  return accumulator;
                }
                req.fullname = req?.profile?.fullname ?? '';
                req.createdAt = formatDateTimeToString(req.createdAt);
                accumulator.push(req);
                return accumulator;
              }, [])
            : [];
        payload = {
          payload: payload,
          total: total,
        };
        dispatch({ type: REDUX_STATE.leaveReq.SET_LEAVE_REQUESTS, payload });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'fetchLeaveRequests');
      })
      .finally(() => {
        if (setLoading) setLoading(false);
      });
  };
};

export const fetchLeaveRequest = (id, setLoading) => {
  return (dispatch, getState) => {
    api.leaveRequest
      .get(id)
      .then(async ({ payload }) => {
        payload.createdAt = formatDateTimeScheduleToString(payload.createdAt);
        payload.handleDate = payload.approverId ? formatDateTimeScheduleToString(payload.approver.createdAt) : '';
        payload.handler = payload.approverId ? payload.approver.profile.code + ' - ' + payload.approver.profile.fullname : '';
        payload.profileCode = payload.profileId ? payload.profile.code : '';
        payload.profileFullName = payload.profileId ? payload.profile.fullname : '';
        payload.phone = payload.profileId ? payload.profile.phone : '';
        payload.email = payload.profileId ? payload.profile.email : '';
        let workingAt = await api.profile.getActiveWorking(payload.profileId);
        if (workingAt?.payload) {
          payload.branch = workingAt.payload.branch.code + ' - ' + workingAt.payload.branch.name;
          payload.department = workingAt.payload.department.code + ' - ' + workingAt.payload.department.name;
          payload.position = workingAt.payload.position.code + ' - ' + workingAt.payload.position.name;
        }

        payload.assignments =
          payload.assignments && payload.assignments.length > 0
            ? payload.assignments.map((ass) => {
                ass.name = parseLocalTime(ass.shift.startCC) + ' - ' + parseLocalTime(ass.shift.endCC) + ' - ' + formatDate(ass.startTime);
                return ass;
              })
            : [];
        dispatch({ type: REDUX_STATE.leaveReq.SET_LEAVE_REQUEST, payload });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'fetchLeaveRequest');
      })
      .finally(() => {
        if (setLoading) setLoading(false);
      });
  };
};

export const createLeaveRequest = (data, history, success_msg) => {
  return (dispatch, getState) => {
    api.leaveRequest
      .post(data)
      .then(({ payload }) => {
        history.push(ROUTE_PATH.LEAVE + `/${payload.id}`);
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'createLeaveRequest');
      });
  };
};

export const approveLeaveRequest = (id, success_msg) => {
  return (dispatch, getState) => {
    api.leaveRequest
      .approve(id)
      .then(({ payload }) => {
        // payload.fullname = payload.profile.fullname;
        dispatch(fetchLeaveRequest(id));
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'approveLeaveRequest');
      });
  };
};

export const rejectLeaveRequest = (id, success_msg) => {
  return (dispatch, getState) => {
    api.leaveRequest
      .reject(id)
      .then(({ payload }) => {
        dispatch(fetchLeaveRequest(id));
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'rejectLeaveRequest ');
      });
  };
};

export const fetchRemoteRequests = (params, setLoading) => {
  return (dispatch, getState) => {
    api.remoteRequest
      .getAll(params)
      .then(({ payload, total }) => {
        payload =
          payload && payload?.length > 0
            ? payload.reduce((accumulator, req) => {
                if (req?.profile?.id === 1) {
                  total -= 1;
                  return accumulator;
                }
                req.fullname = req?.profile?.fullname ?? '';
                req.createdAt = formatDateTimeToString(req.createdAt);
                accumulator.push(req);
                return accumulator;
              }, [])
            : [];
        payload = {
          payload: payload,
          total: total,
        };

        dispatch({ type: REDUX_STATE.remoteReq.SET_REMOTE_REQUESTS, payload });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'fetchRemoteRequests');
      })
      .finally(() => {
        if (setLoading) setLoading(false);
      });
  };
};

export const fetchRemoteRequest = (id, setLoading) => {
  return (dispatch, getState) => {
    api.remoteRequest
      .get(id)
      .then(async ({ payload }) => {
        payload.createdAt = formatDateTimeScheduleToString(payload.createdAt);
        payload.handler = payload.approverId ? payload.approver.profile.code + ' - ' + payload.approver.profile.fullname : '';
        payload.handleDate = payload.approverId ? formatDateTimeScheduleToString(payload.approver.createdAt) : '';
        payload.profileCode = payload.profileId ? payload.profile.code : '';
        payload.profileFullName = payload.profileId ? payload.profile.fullname : '';
        payload.phone = payload.profileId ? payload.profile.phone : '';
        payload.email = payload.profileId ? payload.profile.email : '';
        let workingAt = await api.profile.getActiveWorking(payload.profileId);
        if (workingAt?.payload) {
          payload.branch = workingAt.payload?.branch.code + ' - ' + workingAt.payload.branch.name;
          payload.department = workingAt.payload.department.code + ' - ' + workingAt.payload.department.name;
          payload.position = workingAt.payload.position.code + ' - ' + workingAt.payload.position.name;
        }
        payload.assignments =
          payload.assignments && payload.assignments.length > 0
            ? payload.assignments.map((ass) => {
                ass.name = parseLocalTime(ass.shift.startCC) + ' - ' + parseLocalTime(ass.shift.endCC) + ' - ' + formatDate(ass.startTime);
                return ass;
              })
            : [];
        dispatch({ type: REDUX_STATE.remoteReq.SET_REMOTE_REQUEST, payload });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'fetchRemoteRequest');
      })
      .finally(() => {
        if (setLoading) setLoading(false);
      });
  };
};
export const createRemoteRequest = (data, history, success_msg) => {
  return (dispatch, getState) => {
    api.remoteRequest
      .post(data)
      .then(({ payload }) => {
        history.push(ROUTE_PATH.REMOTE + `/${payload.id}`);
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'createRemoteRequest');
      });
  };
};

export const approveRemoteRequest = (id, success_msg) => {
  return (dispatch, getState) => {
    api.remoteRequest
      .approve(id)
      .then(({ payload }) => {
        dispatch(fetchRemoteRequest(id));
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'approveRemoteRequest');
      });
  };
};

export const rejectRemoteRequest = (id, success_msg) => {
  return (dispatch, getState) => {
    api.remoteRequest
      .reject(id)
      .then(({ payload }) => {
        dispatch(fetchRemoteRequest(id));
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'rejectRemoteRequest');
      });
  };
};

export const fetchOvertimeRequests = (params, setLoading) => {
  return (dispatch, getState) => {
    api.overtimeRequest
      .getAll(params)
      .then(({ payload, total }) => {
        payload =
          payload && payload?.length > 0
            ? payload.reduce((accumulator, req) => {
                if (req?.profile?.id === 1) {
                  total -= 1;
                  return accumulator;
                }
                req.fullname = req?.profile?.fullname ?? '';
                req.createdAt = formatDateTimeToString(req.createdAt);
                accumulator.push(req);
                return accumulator;
              }, [])
            : [];
        payload = {
          payload: payload,
          total: total,
        };
        dispatch({ type: REDUX_STATE.overtimeReq.SET_OVERTIME_REQUESTS, payload });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'fetchOvertimeRequests');
      })
      .finally(() => {
        if (setLoading) setLoading(false);
      });
  };
};

export const fetchOvertimeRequest = (id, setLoading) => {
  return (dispatch, getState) => {
    api.overtimeRequest
      .get(id)
      .then(async ({ payload }) => {
        payload.createdAt = formatDateTimeScheduleToString(payload.createdAt);
        payload.handler = payload.approverId ? payload.approver.profile.code + ' - ' + payload.approver.profile.fullname : '';
        payload.handleDate = payload.approverId ? formatDateTimeScheduleToString(payload.approver.createdAt) : '';
        payload.profileCode = payload.profileId ? payload.profile.code : '';
        payload.profileFullName = payload.profileId ? payload.profile.fullname : '';
        payload.phone = payload.profileId ? payload.profile.phone : '';
        payload.email = payload.profileId ? payload.profile.email : '';
        let workingAt = await api.profile.getActiveWorking(payload.profileId);
        if (workingAt?.payload) {
          payload.branch = workingAt.payload?.branch.code + ' - ' + workingAt.payload.branch.name;
          payload.department = workingAt.payload.department.code + ' - ' + workingAt.payload.department.name;
          payload.position = workingAt.payload.position.code + ' - ' + workingAt.payload.position.name;
        }
        payload.assignment = parseLocalTime(payload.shift.startCC) + ' - ' + parseLocalTime(payload.shift.endCC) + ' - ' + formatDate(payload.date);
        dispatch({ type: REDUX_STATE.overtimeReq.SET_OVERTIME_REQUEST, payload });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'fetchOvertimeRequest');
      })
      .finally(() => {
        if (setLoading) setLoading(false);
      });
  };
};

export const createOvertimeRequest = (data, history, success_msg) => {
  return (dispatch, getState) => {
    api.overtimeRequest
      .post(data)
      .then(({ payload }) => {
        history.push(ROUTE_PATH.OVERTIME + `/${payload.id}`);
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'createOvertimeRequest');
      });
  };
};

export const approveOvertimeRequest = (id, success_msg) => {
  return (dispatch, getState) => {
    api.overtimeRequest
      .approve(id)
      .then(({ payload }) => {
        dispatch(fetchOvertimeRequest(id));
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'approveOvertimeRequest');
      });
  };
};

export const rejectOvertimeRequest = (id, success_msg) => {
  return (dispatch, getState) => {
    api.overtimeRequest
      .reject(id)
      .then(({ payload }) => {
        dispatch(fetchOvertimeRequest(id));
        dispatch({ type: REDUX_STATE.notification.SET_NOTI, payload: { open: true, type: 'success', message: success_msg } });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'rejectOvertimeRequest');
      });
  };
};

export const setEmptyLeaveRequests = () => {
  return {
    type: REDUX_STATE.leaveReq.EMPTY_LIST_LEAVE_REQUEST,
    payload: [],
  };
};
export const setEmptyLeaveRequest = () => {
  return {
    type: REDUX_STATE.leaveReq.EMPTY_FORM_LEAVE_REQUEST,
    payload: [],
  };
};
export const setEmptyRemoteRequests = () => {
  return {
    type: REDUX_STATE.remoteReq.EMPTY_LIST_REMOTE_REQUEST,
    payload: [],
  };
};
export const setEmptyRemoteRequest = () => {
  return {
    type: REDUX_STATE.remoteReq.EMPTY_FORM_REMOTE_REQUEST,
    payload: [],
  };
};
export const setEmptyOverTimeRequests = () => {
  return {
    type: REDUX_STATE.overtimeReq.EMPTY_LIST_OVERTIME_REQUEST,
    payload: [],
  };
};
export const setEmptyOverTimeRequest = () => {
  return {
    type: REDUX_STATE.overtimeReq.EMPTY_FORM_OVERTIME_REQUEST,
    payload: [],
  };
};

export const countLeaveRequests = (params) => {
  return (dispatch, getState) => {
    api.leaveRequest
      .count(params)
      .then(({ payload, total }) => {
        dispatch({ type: REDUX_STATE.leaveReq.COUNT_LEAVE_REQUESTS, payload });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'countLeaveRequests');
      });
  };
};

export const countRemoteRequests = (params) => {
  return (dispatch, getState) => {
    api.remoteRequest
      .count(params)
      .then(({ payload, total }) => {
        dispatch({ type: REDUX_STATE.remoteReq.COUNT_REMOTE_REQUESTS, payload });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'countRemoteRequests');
      });
  };
};

export const countOvertimeRequests = (params) => {
  return (dispatch, getState) => {
    api.overtimeRequest
      .count(params)
      .then(({ payload, total }) => {
        dispatch({ type: REDUX_STATE.overtimeReq.COUNT_OVERTIME_REQUESTS, payload });
      })
      .catch((err) => {
        handleExceptions(err, dispatch, getState, 'countOvertimeRequests');
      });
  };
};
