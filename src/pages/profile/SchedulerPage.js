import { CContainer } from '@coreui/react';
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
import {
  Appointments,
  AppointmentTooltip,
  DateNavigator,
  EditRecurrenceMenu,
  Resources,
  Scheduler,
  TodayButton,
  Toolbar,
  WeekView,
} from '@devexpress/dx-react-scheduler-material-ui';
import { CircularProgress, IconButton } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Delete, Room } from '@material-ui/icons';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CalendarForm from 'src/components/calendar/CalendarForm';
import { PERMISSION } from 'src/constants/key';
import { COLORS } from 'src/constants/theme';
import { createAssignment, deleteAssignment, fetchAssignments, setEmptyAssignments } from 'src/stores/actions/assignment';
import { fetchHolidays } from 'src/stores/actions/holiday';
import { isSameBeforeTypeDate } from 'src/utils/datetimeUtils';
import Page404 from '../page404/Page404';
import NoteScheduler from './NoteSchedule';

const useStyles = makeStyles((theme) => ({
  todayCell: {
    backgroundColor: COLORS.TODAY_BODY_CELL,
    '&:hover': {
      backgroundColor: COLORS.TODAY_BODY_CELL,
    },
    '&:focus': {
      backgroundColor: COLORS.TODAY_BODY_CELL,
    },
  },
  weekendCell: {
    backgroundColor: COLORS.WEEKEND_BODY_CELL,
    '&:hover': {
      backgroundColor: COLORS.WEEKEND_BODY_CELL,
    },
    '&:focus': {
      backgroundColor: COLORS.WEEKEND_BODY_CELL,
    },
  },
  holidayCell: {
    backgroundColor: COLORS.HOLIDAY_CELL,
    '&:hover': {
      backgroundColor: COLORS.HOLIDAY_CELL,
    },
    '&:focus': {
      backgroundColor: COLORS.HOLIDAY_CELL,
    },
  },
  today: {
    backgroundColor: COLORS.TODAY_HEADER_CELL,
  },
  weekend: {
    backgroundColor: COLORS.WEEKEND_HEADER_CELL,
  },
  holiday: {
    backgroundColor: COLORS.HOLIDAY_HEADER,
  },
}));

const SchedulerPage = ({ t, history, match }) => {
  const permissionIds = JSON.parse(localStorage.getItem('permissionIds'));
  const assignments = useSelector((state) => state.assignment.assignments);
  const holidays = useSelector((state) => state.holiday.holidays);
  const profileId = +match?.params?.id;
  const dispatch = useDispatch();
  const [state, setState] = useState({
    currentDate: new Date(),
    isOpen: false,
    selectedDate: '',
    visible: false,
    day: 0,
  });
  const [loading, setLoading] = useState(true);
  const resources = [
    {
      fieldName: 'status',
      title: 'Status',
      instances: [
        { id: 'overtime', text: t('Overtime'), color: '#FFC107' },
        { id: 'remote_overtime', text: t('Overtime'), color: '#FFC107' },
      ],
    },
  ];

  const DayScaleCell = (props) => {
    const classes = useStyles();
    const { startDate, today } = props;
    const holiday = holidays?.payload
      ? holidays.payload.find(
          (e) => isSameBeforeTypeDate(e.startDate.replace('Z', ''), startDate) && isSameBeforeTypeDate(startDate, e.endDate.replace('Z', '')),
        )
        ? true
        : false
      : false;
    if (holiday) {
      return <WeekView.DayScaleCell {...props} className={classes.holiday} />;
    }
    if (today) {
      return <WeekView.DayScaleCell {...props} className={classes.today} />;
    }
    if (startDate.getDay() === 0 || startDate.getDay() === 6) {
      return <WeekView.DayScaleCell {...props} className={classes.weekend} />;
    }
    return <WeekView.DayScaleCell {...props} />;
  };

  const TimeTableCell = (props) => {
    const classes = useStyles();
    const { startDate } = props;
    const date = moment(startDate);
    const holiday = holidays?.payload
      ? holidays.payload.find(
          (e) => isSameBeforeTypeDate(e.startDate.replace('Z', ''), startDate) && isSameBeforeTypeDate(startDate, e.endDate.replace('Z', '')),
        )
        ? true
        : false
      : false;
    const onClickEvent = () => {
      if (permissionIds.includes(PERMISSION.CREATE_ASSIGNMENT))
        setState({
          ...state,
          selectedDate: moment(props.startDate).startOf('day').format('YYYY-MM-DD'),
          isOpen: true,
          day: date.day() + 1,
        });
    };
    if (holiday) {
      return <WeekView.TimeTableCell {...props} className={classes.holidayCell} onClick={onClickEvent} role="button" />;
    }
    if (date.isSame(moment(), 'day')) {
      return <WeekView.TimeTableCell {...props} className={classes.todayCell} onClick={onClickEvent} role="button" />;
    }
    if (date.day() === 0 || date.day() === 6) {
      return <WeekView.TimeTableCell {...props} className={classes.weekendCell} onClick={onClickEvent} role="button" />;
    }
    return <WeekView.TimeTableCell {...props} onClick={onClickEvent} role="button" />;
  };
  useEffect(() => {
    return () => {
      dispatch(setEmptyAssignments());
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (permissionIds.includes(PERMISSION.LIST_ASSIGNMENT)) {
      handleReload();
      dispatch(
        fetchHolidays({
          page: 0,
          perpage: 999,
        }),
      );
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentDate]);
  const changeCurrentDate = (currentDate) => {
    setState({
      ...state,
      currentDate: currentDate,
    });
  };
  const handleClose = () => {
    setState({ ...state, isOpen: false });
  };
  const handleReload = () => {
    var first = state.currentDate.getDate() - state.currentDate.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    var firstDay = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), first);
    var lastDay = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), last);
    lastDay.setHours(23, 59, 59, 0);
    dispatch(fetchAssignments({ profileId: profileId, from: firstDay, to: lastDay }, setLoading));
  };

  const handleConfirm = async (values) => {
    let { selectedDate } = state;
    const [sHH, sMM] = values.start.split(':');
    const [eHH, eMM] = values.end.split(':');
    let startTime = new Date(selectedDate);
    startTime.setHours(+sHH, +sMM, 0, 0);
    let endTime = new Date(selectedDate);
    endTime.setHours(+eHH, +eMM, 0, 0);

    let body = {
      shiftId: +values.shiftId,
      profileId: profileId,
      startTime: startTime,
      endTime: endTime,
      to: values.to ? new Date(values.to) : undefined,
    };
    dispatch(createAssignment(body, handleReload, t('message.successful_create')));
    handleClose();

    // let checkValidTask = assignments?.payload
    //   ? assignments.payload.every((x) => isSameBeforeTypeDate(x.endDate, startDate) || isSameBeforeTypeDate(endDate, x.startDate))
    //   : false; //bug
    // if (!checkValidTask) {
    //   dispatch({
    //     type: REDUX_STATE.notification.SET_NOTI,
    //     payload: { open: true, type: 'error', message: t('message.not_assign_in_this_time') },
    //   });
    //   setState({
    //     ...state,
    //     isOpen: false,
    //   });
    // } else {
    //   let body = {
    //     shiftId: +values.shiftId,
    //     profileId: profileId,
    //     date: new Date(selectedDate),
    //     endTime: values.endTime ? new Date(values.endTime) : undefined,
    //   };
    //   dispatch(createAssignment(body, t('message.successful_create')));
    //   handleClose();
    // }
  };
  const style = ({ palette }) => ({
    icon: {
      color: palette.action.active,
    },
    textCenter: {
      textAlign: 'center',
    },
    header: {
      backgroundSize: 'cover',
    },
    commandButton: {
      backgroundColor: 'rgba(255,255,255,0.65)',
    },
  });

  const Header = withStyles(style, { name: 'Header' })(({ children, appointmentData, classes, ...restProps }) => {
    return (
      <AppointmentTooltip.Header {...restProps} className={classes.header} appointmentData={appointmentData}>
        {permissionIds.includes(PERMISSION.DELETE_ASSIGNMENT) ? (
          <IconButton
            onClick={() => {
              dispatch(deleteAssignment(appointmentData.id, handleReload, t('message.successful_delete')));
              restProps.onHide();
            }}
            className={classes.commandButton}
          >
            <Delete />
          </IconButton>
        ) : (
          <div />
        )}
      </AppointmentTooltip.Header>
    );
  });

  const Content = withStyles(style, { name: 'Content' })(({ children, appointmentData, classes, ...restProps }) => {
    return (
      <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
        <Grid container alignItems="center">
          <Grid item xs={2} className={classes.textCenter}>
            <Room className={classes.icon} />
          </Grid>
          <Grid item xs={10}>
            <span>{appointmentData.shift.branch.name + ' - ' + appointmentData.shift.branch.address}</span>
          </Grid>
        </Grid>
      </AppointmentTooltip.Content>
    );
  });
  const Appointment = ({ children, style, ...restProps }) => {
    if (restProps?.data?.status?.includes('overtime'))
      return (
        <Appointments.Appointment
          {...restProps}
          style={{
            ...style,
            backgroundColor: COLORS.OVERTIME_ASSIGNMENT,
            borderRadius: '8px',
          }}
        >
          {children}
        </Appointments.Appointment>
      );
    else return <Appointments.Appointment {...restProps}>{children}</Appointments.Appointment>;
  };
  if (permissionIds.includes(PERMISSION.LIST_ASSIGNMENT)) {
    return (
      <CContainer fluid className="c-main m-auto p-4">
        {state.isOpen && <CalendarForm t={t} day={state.day} handleCancel={handleClose} isOpen={state.isOpen} handleConfirm={handleConfirm} />}
        <Paper>
          {loading ? (
            <div className="text-center pt-4">
              <CircularProgress />
            </div>
          ) : (
            <Scheduler data={assignments?.payload ?? []} height="auto">
              <ViewState currentDate={state.currentDate} onCurrentDateChange={changeCurrentDate} />
              <EditingState />
              <IntegratedEditing />
              <WeekView
                startDayHour={0}
                endDayHour={24}
                cellDuration={60}
                timeTableCellComponent={TimeTableCell}
                dayScaleCellComponent={DayScaleCell}
              />
              <Toolbar />
              <DateNavigator />
              <TodayButton />
              <EditRecurrenceMenu />
              <Appointments appointmentComponent={Appointment} />
              <AppointmentTooltip headerComponent={Header} contentComponent={Content} showCloseButton />
              <Resources data={resources} />
            </Scheduler>
          )}
          <div className="d-flex justify-content-end">
            <NoteScheduler t={t} />
          </div>
        </Paper>
      </CContainer>
    );
  } else return <Page404 />;
};
export default SchedulerPage;
