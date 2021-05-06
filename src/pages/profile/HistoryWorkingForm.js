import { CContainer } from '@coreui/react';
import { Add } from '@material-ui/icons';
import { Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WarningAlertDialog from 'src/components/dialog/WarningAlertDialog';
import CommonSelectInput from 'src/components/input/CommonSelectInput';
import CommonTextInput from 'src/components/input/CommonTextInput';
import { PERMISSION } from 'src/constants/key';
import { NewHistoryWorkingSchema } from 'src/schema/formSchema';
import { fetchBranches } from 'src/stores/actions/contract';
import { fetchDepartments } from 'src/stores/actions/department';
import { createHistoryWork, deleteHistoryWork, fetchHistoriesWork, setEmptyHistories, updateHistoryWork } from 'src/stores/actions/historyWork';
import { fetchPositions } from 'src/stores/actions/position';
import { renderButtons } from 'src/utils/formUtils';

const HistoryWorkingForm = ({ t, match }) => {
  const permissionIds = JSON.parse(localStorage.getItem('permissionIds'));
  const dispatch = useDispatch();
  let branches = useSelector((state) => state.contract.branches);
  const positions = useSelector((state) => state.position.positions);
  const histories = useSelector((state) => state.historyWork.histories);
  const historyWorkingForm = {};
  historyWorkingForm.histories = histories;
  const departments = useSelector((state) => state.department.departments);
  const profileId = +match?.params?.id;
  const newHistory = {
    profileId: profileId,
    branchId: '',
    departmentId: '',
    positionId: '',
    from: '',
    to: '',
  };
  useEffect(() => {
    if (permissionIds.includes(PERMISSION.LIST_WORK_HISTORY)) {
      dispatch(fetchBranches());
      dispatch(
        fetchHistoriesWork({
          profileId: profileId,
        }),
      );
    }
    return () => {
      dispatch(setEmptyHistories());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create(form) {
    // form.provinceId = form.provinceId || null;
    form.profileId = profileId;
    form.branchId = parseInt(form.branchId);
    form.departmentId = parseInt(form.departmentId);
    form.positionId = parseInt(form.positionId);

    if (form.id) {
      dispatch(updateHistoryWork(form, t('message.successful_update')));
    } else {
      dispatch(createHistoryWork(form, t('message.successful_create'), handleResetNewHistory));
    }
  }

  const BodyItem = ({ values, handleBlur, handleChange, touched, errors }) => {
    return (
      <>
        <div className="row">
          <CommonSelectInput
            containerClassName={'form-group col-lg-4'}
            value={values.branchId ?? ''}
            onBlur={handleBlur(`branchId`)}
            onChange={(e) => {
              dispatch(fetchDepartments({ branchId: e.target.value }));
              handleChange('branchId')(e);
            }}
            inputID={`branchId`}
            labelText={t('label.branch')}
            selectClassName={'form-control'}
            placeholder={t('placeholder.select_branch')}
            isRequiredField
            isTouched={touched.branchId}
            isError={errors.branchId && touched.branchId}
            errorMessage={t(errors.branchId)}
            lstSelectOptions={branches}
          />
          <CommonSelectInput
            containerClassName={'form-group col-lg-4'}
            value={values.departmentId ?? ''}
            onBlur={handleBlur(`departmentId`)}
            onChange={(e) => {
              dispatch(fetchPositions({ departmentId: e.target.value }));
              handleChange('departmentId')(e);
            }}
            inputID={`departmentId`}
            labelText={t('label.department')}
            selectClassName={'form-control'}
            placeholder={t('placeholder.select_department')}
            isRequiredField
            isTouched={touched.departmentId}
            isError={errors.departmentId && touched.departmentId}
            errorMessage={t(errors.departmentId)}
            lstSelectOptions={departments}
          />
          <CommonSelectInput
            containerClassName={'form-group col-lg-4'}
            value={values.positionId ?? ''}
            onBlur={handleBlur(`positionId`)}
            onChange={(e) => {
              handleChange('positionId')(e);
            }}
            inputID={`positionId`}
            labelText={t('label.position')}
            selectClassName={'form-control'}
            placeholder={t('placeholder.select_position')}
            isRequiredField
            isTouched={touched.positionId}
            isError={errors.positionId && touched.positionId}
            errorMessage={t(errors.positionId)}
            lstSelectOptions={positions}
          />
        </div>
        <div className="row">
          <CommonTextInput
            containerClassName={'form-group col-lg-4'}
            value={values.from ?? ''}
            onBlur={handleBlur(`from`)}
            onChange={handleChange(`from`)}
            inputID={`from`}
            labelText={t('label.start_date')}
            inputType={'date'}
            inputClassName={'form-control'}
            isRequiredField
            isTouched={touched.from}
            isError={errors.from && touched.from}
            errorMessage={t(errors.from)}
          />
          <CommonTextInput
            containerClassName={'form-group col-lg-4'}
            value={values.to ?? ''}
            onBlur={handleBlur(`to`)}
            onChange={handleChange(`to`)}
            inputID={`to`}
            labelText={t('label.end_date')}
            inputType={'date'}
            inputClassName={'form-control'}
            isRequiredField
            isTouched={touched.to}
            isError={errors.to && touched.to}
            errorMessage={t(errors.to)}
          />
        </div>
      </>
    );
  };
  const newHistoryRef = useRef();

  const handleResetNewHistory = () => {
    newHistoryRef.current.handleReset();
    document.getElementById('newHistory').hidden = true;
    document.getElementById('addBtn').disabled = false;
  };
  const [isVisibleDeleteAlert, setIsVisibleDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const handleCloseDeleteAlert = () => {
    setIsVisibleDeleteAlert(false);
  };
  return (
    <CContainer fluid className="c-main">
      <div style={{ position: 'fixed', bottom: 40, right: 40, zIndex: 1000 }}>
        <button
          type="button"
          hidden={!permissionIds.includes(PERMISSION.CREATE_WORK_HISTORY)}
          className="btn btn-success rounded-circle p-3"
          id="addBtn"
          onClick={() => {
            document.getElementById('newHistory').hidden = false;
            document.getElementById('addBtn').disabled = true;
          }}
        >
          <Add fontSize="large" />
        </button>
      </div>
      <div className="m-auto">
        <div className="">
          <Formik
            innerRef={newHistoryRef}
            initialValues={newHistory}
            validationSchema={NewHistoryWorkingSchema}
            enableReinitialize
            onSubmit={(values) => {
              create(values);
            }}
          >
            {(props) => {
              return (
                <Form id="newHistory" hidden={true} className="p-0 m-0">
                  <div className="shadow bg-white rounded mx-4 p-4">
                    <h5>{'Tạo mới'}.</h5>
                    <hr className="mt-1" />
                    <BodyItem {...props} />
                    <hr className="mt-1" />
                    {renderButtons([
                      {
                        type: 'button',
                        className: `btn btn-primary  mx-2`,
                        onClick: () => {
                          handleResetNewHistory();
                        },
                        name: t('label.cancel'),
                        position: 'right',
                      },

                      {
                        type: 'button',
                        className: `btn btn-primary px-4 ml-4`,
                        onClick: async (e) => {
                          props.handleSubmit(e);
                        },
                        name: t('label.save'),
                      },
                    ])}
                  </div>
                  <br />
                </Form>
              );
            }}
          </Formik>
          {permissionIds.includes(PERMISSION.LIST_WORK_HISTORY) && historyWorkingForm.histories && historyWorkingForm.histories.length > 0 ? (
            historyWorkingForm.histories.map((history, index) => {
              return (
                <Formik
                  key={'history ' + index}
                  initialValues={history}
                  validationSchema={NewHistoryWorkingSchema}
                  enableReinitialize
                  onSubmit={async (values) => {
                    create(values);
                  }}
                >
                  {(props) => {
                    return (
                      <Form className="p-0 m-0">
                        <div className="shadow bg-white rounded mx-4 p-4 mb-4">
                          <h5>{index + 1}.</h5>
                          <hr className="mt-1" />
                          <BodyItem {...props} />
                          <hr className="mt-1" />

                          {renderButtons(
                            permissionIds.includes(PERMISSION.UPDATE_WORK_HISTORY)
                              ? [
                                  {
                                    type: 'button',
                                    className: `btn btn-primary  mx-2`,
                                    onClick: (e) => {
                                      setIsVisibleDeleteAlert(true);
                                      setDeleteId(history.id);
                                    },
                                    name: t('label.delete'),
                                    position: 'right',
                                  },
                                  {
                                    type: 'button',
                                    className: `btn btn-primary  mx-2`,
                                    onClick: (e) => {
                                      props.handleReset(e);
                                    },
                                    name: t('label.reset'),
                                    position: 'right',
                                  },
                                  {
                                    type: 'button',
                                    className: `btn btn-primary px-4 ml-4`,
                                    onClick: async (e) => {
                                      props.handleSubmit(e);
                                    },
                                    name: t('label.save'),
                                  },
                                ]
                              : [],
                          )}
                        </div>
                        <br />
                      </Form>
                    );
                  }}
                </Formik>
              );
            })
          ) : (
            <div />
          )}
          {isVisibleDeleteAlert ? (
            <WarningAlertDialog
              isVisible={isVisibleDeleteAlert}
              title={t('title.confirm')}
              warningMessage={t('message.confirm_delete_academic')}
              titleConfirm={t('label.agree')}
              titleCancel={t('label.cancel')}
              handleCancel={(e) => {
                handleCloseDeleteAlert();
              }}
              handleConfirm={(e) => {
                dispatch(deleteHistoryWork(deleteId, t('message.successful_delete'), handleCloseDeleteAlert));
              }}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </CContainer>
  );
};
export default HistoryWorkingForm;
