import { CContainer } from '@coreui/react';
import { CircularProgress } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WarningAlertDialog from 'src/components/dialog/WarningAlertDialog';
import CommonMultipleTextInput from 'src/components/input/CommonMultipleTextInput';
import CommonSelectInput from 'src/components/input/CommonSelectInput';
import CommonTextInput from 'src/components/input/CommonTextInput';
import CommonUploadFileButton from 'src/components/input/CommonUploadFileButton';
import Label from 'src/components/text/Label';
import { PERMISSION } from 'src/constants/key';
import { NewDegreeSchema } from 'src/schema/formSchema';
import { createDiploma, deleteDiploma, fetchDiplomaByType, setEmptyAcademic, updateDiploma } from 'src/stores/actions/diploma';
import { renderButtons } from 'src/utils/formUtils';
import { generateCode } from 'src/utils/randomCode';

const AcademicLevel = ({ t, match }) => {
  const permissionIds = JSON.parse(localStorage.getItem('permissionIds'));
  const dispatch = useDispatch();
  const initialValues = useSelector((state) => state.profile.profile);
  const [loading, setLoading] = useState(true);

  const newDegree = {
    level: '',
    name: '',
    issuedPlace: '',
    issuedDate: '',
    note: '',
    attaches: [],
    code: '',
  };

  const academicLevels = [
    { id: 'intermediate', name: t('label.intermediate') },
    { id: 'college', name: t('label.college') },
    { id: 'university', name: t('label.university') },
    { id: 'master', name: t('label.master') },
    { id: 'doctor_of_philosophy', name: t('label.doctor_of_philosophy') },
  ];
  useEffect(() => {
    if (permissionIds.includes(PERMISSION.LIST_DIPLOMA)) {
      dispatch(fetchDiplomaByType({ profileId: match.params.id, type: 'degree' }, setLoading));
      return () => {
        dispatch(setEmptyAcademic());
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createDegree = (values) => {
    let form = values;
    form.type = 'degree';
    form.profileId = +match.params.id;
    if (form.id) {
      dispatch(updateDiploma(form, t('message.successful_update')));
    } else {
      dispatch(createDiploma(form, t('message.successful_create'), handleResetNewDegree));
    }
  };
  const getFormBody = (title, values, handleChange, handleBlur, touched, errors, isCreate, setFieldValue) => {
    return (
      <>
        <h5>{title}.</h5>
        <hr className="mt-1" />
        <div className="row">
          {isCreate ? (
            <div className="form-group col-xl-4">
              <Label text={t('label.code')} required />
              <div className="input-group">
                <input
                  type="text"
                  className={'form-control col9'}
                  rows={5}
                  onBlur={handleBlur('code')}
                  name={`code`}
                  onChange={(e) => handleChange(`code`)(e)}
                  value={values.code}
                  disabled={!isCreate}
                  placeholder={t('placeholder.enter_code')}
                />
                <div
                  className="input-group-text col-3 d-flex justify-content-center"
                  id="basic-addon2"
                  type="button"
                  onClick={(e) => {
                    let randomCode = generateCode();
                    setFieldValue('code', randomCode);
                  }}
                >
                  {t('label.random')}
                </div>
              </div>
              {errors.code && touched.code && t(errors.code) ? (
                <div>
                  <small className={'text-danger'}>{t(errors.code)}</small>
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div className="form-group col-xl-4">
              <Label text={t('label.code')} required />
              <div className="input-group">
                <input
                  type="text"
                  className={'form-control col-12'}
                  rows={5}
                  onBlur={handleBlur('code')}
                  name={`code`}
                  onChange={(e) => handleChange(`code`)(e)}
                  value={values.code}
                  disabled={!isCreate}
                  placeholder={t('placeholder.enter_code')}
                />
              </div>
              {errors.code && touched.code && t(errors.code) ? (
                <div>
                  <small className={'text-danger'}>{t(errors.code)}</small>
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
          <CommonSelectInput
            containerClassName={'form-group col-lg-4'}
            value={values.level ?? ''}
            onBlur={handleBlur(`level`)}
            onChange={handleChange(`level`)}
            labelText={t('label.academic_level')}
            selectClassName={'form-control'}
            placeholder={t('placeholder.select_academic_level')}
            isRequiredField
            isTouched={touched.level}
            isError={errors.level && touched.level}
            errorMessage={t(errors.level)}
            lstSelectOptions={academicLevels}
          />
          <CommonTextInput
            containerClassName={'form-group col-lg-4'}
            value={values.name ?? ''}
            onBlur={handleBlur(`name`)}
            onChange={handleChange(`name`)}
            labelText={t('label.major')}
            inputType={'text'}
            placeholder={t('placeholder.enter_academic_major')}
            inputClassName={'form-control'}
            isRequiredField
            isTouched={touched.name}
            isError={errors.name && touched.name}
            errorMessage={t(errors.name)}
          />
          <CommonTextInput
            containerClassName={'form-group col-lg-4'}
            value={values.issuedPlace ?? ''}
            onBlur={handleBlur(`issuedPlace`)}
            onChange={handleChange(`issuedPlace`)}
            labelText={t('label.education_place')}
            inputType={'text'}
            placeholder={t('placeholder.enter_education_place')}
            inputClassName={'form-control'}
            isRequiredField
            isTouched={touched.issuedPlace}
            isError={errors.issuedPlace && touched.issuedPlace}
            errorMessage={t(errors.issuedPlace)}
          />

          <CommonTextInput
            containerClassName={'form-group col-lg-4'}
            value={values.issuedDate ?? ''}
            onBlur={handleBlur(`issuedDate`)}
            onChange={handleChange(`issuedDate`)}
            labelText={t('label.start_date2')}
            inputType={'date'}
            inputClassName={'form-control'}
            isRequiredField
            isTouched={touched.issuedDate}
            isError={errors.issuedDate && touched.issuedDate}
            errorMessage={t(errors.issuedDate)}
          />

          <CommonMultipleTextInput
            containerClassName={'form-group col-lg-12'}
            value={values.note}
            onBlur={handleBlur(`note`)}
            onChange={handleChange(`note`)}
            labelText={t('label.note')}
            inputClassName={'form-control'}
          />
        </div>
        <div className="row">
          {isCreate ? (
            <CommonUploadFileButton
              isHide={!permissionIds.includes(PERMISSION.CREATE_DIPLOMA)}
              name={`attaches`}
              containerClassName="form-group col-lg-12"
              buttonClassName="btn btn-primary"
              value={values.attaches}
            />
          ) : (
            <CommonUploadFileButton
              isHide={!permissionIds.includes(PERMISSION.UPDATE_DIPLOMA)}
              name={`attaches`}
              containerClassName="form-group col-lg-12"
              buttonClassName="btn btn-primary"
              value={values.attaches}
            />
          )}
        </div>
        <hr className="mt-1" />
      </>
    );
  };
  const newDegreeRef = useRef();
  const handleResetNewDegree = () => {
    newDegreeRef.current.handleReset();
    document.getElementById('newDegree').hidden = true;
    document.getElementById('addBtn').disabled = false;
  };
  const [isVisibleDeleteAlert, setIsVisibleDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const handleCloseDeleteAlert = () => {
    setIsVisibleDeleteAlert(false);
  };
  if (loading)
    return (
      <div className="text-center pt-4">
        <CircularProgress />
      </div>
    );
  else
    return (
      <>
        <CContainer fluid className="c-main m-auto p-4">
          <div style={{ position: 'fixed', bottom: 40, right: 40, zIndex: 1000 }}>
            <button
              type="button"
              className="btn btn-success rounded-circle p-3"
              id="addBtn"
              hidden={!permissionIds.includes(PERMISSION.CREATE_DIPLOMA)}
              onClick={(e) => {
                document.getElementById('newDegree').hidden = false;
                document.getElementById('addBtn').disabled = true;
              }}
            >
              <Add fontSize="large" />
            </button>
          </div>
          <div className="m-auto">
            <div>
              <Formik
                initialValues={newDegree}
                innerRef={newDegreeRef}
                validationSchema={NewDegreeSchema}
                enableReinitialize
                onSubmit={(values) => {
                  createDegree(values);
                }}
              >
                {({ values, errors, touched, handleReset, handleBlur, handleSubmit, handleChange, setFieldValue }) => {
                  let isCreate = true;
                  return (
                    <form id="newDegree" hidden={true} className="p-0 m-0">
                      <div className="shadow bg-white rounded p-4">
                        {getFormBody(t('label.create_new'), values, handleChange, handleBlur, touched, errors, isCreate, setFieldValue)}
                        {renderButtons([
                          {
                            type: 'button',
                            className: `btn btn-primary  mx-2`,
                            onClick: (e) => {
                              handleReset(e);
                              document.getElementById('newDegree').hidden = true;
                              document.getElementById('addBtn').disabled = false;
                            },
                            name: t('label.cancel'),
                          },

                          {
                            type: 'button',
                            className: `btn btn-primary px-4 ml-4`,
                            onClick: (e) => {
                              handleSubmit(e);
                            },
                            name: t('label.create_new'),
                          },
                        ])}
                      </div>
                      <br />
                    </form>
                  );
                }}
              </Formik>
              {permissionIds.includes(PERMISSION.LIST_DIPLOMA) &&
                initialValues.degrees &&
                initialValues.degrees.length > 0 &&
                initialValues.degrees.map((degree, index) => (
                  <Formik
                    initialValues={degree}
                    key={'degree' + index}
                    validationSchema={NewDegreeSchema}
                    onSubmit={(values) => {
                      createDegree(values);
                    }}
                  >
                    {({ values, errors, touched, handleBlur, handleSubmit, handleChange, handleReset, setFieldValue }) => (
                      <div className="shadow bg-white rounded p-4 mb-4">
                        {getFormBody(values?.code + ' - ' + values.name, values, handleChange, handleBlur, touched, errors, false, setFieldValue)}
                        {renderButtons(
                          permissionIds.includes(PERMISSION.UPDATE_DIPLOMA)
                            ? [
                                {
                                  type: 'button',
                                  className: `btn btn-primary px-4 mx-2`,
                                  onClick: (e) => {
                                    setIsVisibleDeleteAlert(true);
                                    setDeleteId(degree.id);
                                  },
                                  name: t('label.delete'),
                                },
                                {
                                  type: 'button',
                                  className: `btn btn-primary px-4 mx-2`,
                                  onClick: (e) => {
                                    handleReset(e);
                                  },
                                  name: t('label.reset'),
                                },
                                {
                                  type: 'button',
                                  className: `btn btn-primary px-4 ml-2`,
                                  onClick: (e) => {
                                    handleSubmit(e);
                                  },
                                  name: t('label.save'),
                                },
                              ]
                            : [],
                        )}
                      </div>
                    )}
                  </Formik>
                ))}
              {isVisibleDeleteAlert && (
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
                    dispatch(deleteDiploma(deleteId, t('message.successful_delete'), handleCloseDeleteAlert));
                  }}
                />
              )}
            </div>
          </div>
        </CContainer>
      </>
    );
};
export default AcademicLevel;
