import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTE_PATH } from 'src/constants/key';
import { fetchBranches } from 'src/stores/actions/branch';
import { createPosition, setEmptyPosition } from 'src/stores/actions/position';
import PositionItemBody from './PositionItemBody';

const NewPositionPage = ({ t, location, match, history }) => {
  const positionRef = useRef();
  const dispatch = useDispatch();
  const shifts = useSelector((state) => state.shift.shifts);
  const departments = useSelector((state) => state.department.departments);
  const branches = useSelector((state) => state.branch.branches);
  const position = useSelector((state) => state.position.position);

  useEffect(() => {
    dispatch(fetchBranches());
    return () => {
      dispatch(setEmptyPosition());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitForm = (values) => {
    const form = values;
    form.branchId = parseInt(form.branchId);
    form.departmentId = parseInt(form.departmentId);
    dispatch(createPosition(form, history, t('message.successful_create')));
  };

  const buttons = [
    {
      type: 'button',
      className: `btn btn-primary mr-4`,
      onClick: (e) => {
        history.push(ROUTE_PATH.POSITION);
      },
      name: t('label.back'),
      position: 'left',
    },
    {
      type: 'button',
      className: `btn btn-primary`,
      onClick: (e) => {
        positionRef.current.handleSubmit(e);
      },
      name: t('label.create_new'),
    },
  ];
  return (
    <PositionItemBody
      t={t}
      positionRef={positionRef}
      position={position}
      departments={departments}
      branches={branches}
      shifts={shifts}
      submitForm={submitForm}
      buttons={buttons}
    />
  );
};

export default NewPositionPage;
