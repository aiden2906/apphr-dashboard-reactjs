import { CircularProgress } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PERMISSION, ROUTE_PATH } from 'src/constants/key';
import Page404 from 'src/pages/page404/Page404';
import { fetchBranches } from 'src/stores/actions/branch';
import { fetchDepartment, resetDepartment, updateDepartment } from 'src/stores/actions/department';
import DepartmentItemBody from './DepartmentItemBody';

const EditDepartment = ({ t, location, match, history }) => {
  const permissionIds = JSON.parse(localStorage.getItem('permissionIds'));
  const departmentRef = useRef();
  const dispatch = useDispatch();
  const branches = useSelector((state) => state.branch.branches);
  const department = useSelector((state) => state.department.department);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (permissionIds.includes(PERMISSION.GET_DEPARTMENT)) {
      dispatch(fetchBranches());
      dispatch(fetchDepartment({ id: match.params.id }, setLoading));
      return () => {
        dispatch(resetDepartment());
      };
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitForm = (values) => {
    const form = values;
    form.branchId = parseInt(form.branchId);

    dispatch(updateDepartment(form, t('message.successful_update')));
  };
  const buttons = permissionIds.includes(PERMISSION.UPDATE_DEPARTMENT)
    ? [
        {
          type: 'button',
          className: `btn btn-primary mr-4`,
          onClick: (e) => {
            history.push(ROUTE_PATH.DEPARTMENT);
          },
          name: t('label.back'),
          position: 'left',
        },
        {
          type: 'reset',
          className: `btn btn-primary mr-4`,
          onClick: (e) => {
            departmentRef.current.handleReset(e);
          },
          name: t('label.reset'),
        },
        {
          type: 'button',
          className: `btn btn-primary`,
          onClick: (e) => {
            departmentRef.current.handleSubmit(e);
          },
          name: t('label.update'),
        },
      ]
    : [
        {
          type: 'button',
          className: `btn btn-primary mr-4`,
          onClick: (e) => {
            history.push(ROUTE_PATH.DEPARTMENT);
          },
          name: t('label.back'),
          position: 'left',
        },
      ];
  if (loading)
    return (
      <div className="text-center pt-4">
        <CircularProgress />
      </div>
    );
  if (permissionIds.includes(PERMISSION.GET_DEPARTMENT) && department.id !== '')
    return (
      <DepartmentItemBody
        t={t}
        departmentRef={departmentRef}
        department={department}
        branches={branches}
        submitForm={submitForm}
        buttons={buttons}
        loading={loading}
        isCreate={false}
      />
    );
  else return <Page404 />;
};

export default EditDepartment;
