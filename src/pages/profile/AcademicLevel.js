import { CContainer } from '@coreui/react';
import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Field, FieldArray, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import AutoSubmitToken from 'src/components/form/AutoSubmitToken';
import CommonUploadFileButton from 'src/components/input/CommonUploadFileButton';
import Label from 'src/components/text/Label';
import { createDiploma, deleteDiploma, fetchDiplomaByType, updateDiploma } from 'src/stores/actions/diploma';
import { renderButtons } from 'src/utils/formUtils';
import CommonSelectInput from 'src/components/input/CommonSelectInput';
import { NewDegreeSchema, DegreesSchema } from 'src/schema/formSchema';
import CommonTextInput from 'src/components/input/CommonTextInput';
import CommonMultipleTextInput from 'src/components/input/CommonMultipleTextInput';
import { REDUX_STATE } from 'src/stores/states';

const AcademicLevel = ({ t, match }) => {
  const dispatch = useDispatch();
  const initialValues = useSelector((state) => state.profile.profile);
  const newDegree = useSelector((state) => state.profile.profile.newDegree);

  const academicLevels = [
    { id: 'intermediate', name: t('label.intermediate') },
    { id: 'college', name: t('label.college') },
    { id: 'university', name: t('label.university') },
    { id: 'master', name: t('label.master') },
    { id: 'doctor_of_philosophy', name: t('label.doctor_of_philosophy') },
  ];
  useEffect(() => {
    dispatch(fetchDiplomaByType({ profileId: match.params.id, type: 'degree' }));
  }, []);

  function create(form) {
    form.type = 'degree';
    // form.provinceId = form.provinceId || null;
    form.profileId = +match.params.id;
    if (form.id) {
      dispatch(updateDiploma(form, t('message.successful_update')));
    } else {
      dispatch(createDiploma(form, t('message.successful_create')));
    }
  }

  function removeCertificate(form, cb) {
    if (form.id) {
      dispatch(deleteDiploma(form.id));
    } else {
      cb();
    }
  }

  return (
    <CContainer fluid className="c-main">
      <div className="m-auto">
        <div className="">
          <div className="d-flex justify-content-center mb-4">
            <button
              type="button"
              className="btn btn-success"
              id="addBtn"
              onClick={() => {
                document.getElementById('newDegree').hidden = false;
                document.getElementById('addBtn').disabled = true;
              }}
            >
              <Add /> {t('label.add')}
            </button>
          </div>
          <Formik initialValues={newDegree} validationSchema={NewDegreeSchema} enableReinitialize onSubmit={() => {}}>
            {({ values, errors, touched, handleReset, handleBlur, handleSubmit, handleChange, validateForm, setTouched }) => {
              return (
                <Form id="newDegree" hidden={true} className="p-0 m-0">
                  <div className="shadow bg-white rounded mx-4 p-4">
                    <h5>{'Tạo mới'}.</h5>
                    <hr className="mt-1" />
                    <div className="row">
                      <CommonSelectInput
                        containerClassName={'form-group col-lg-4'}
                        value={values.level ?? ''}
                        onBlur={handleBlur(`level`)}
                        onChange={handleChange(`level`)}
                        inputID={`level`}
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
                        inputID={`name`}
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
                        inputID={`issuedPlace`}
                        labelText={t('label.education_place')}
                        inputType={'text'}
                        placeholder={t('placeholder.enter_education_place')}
                        inputClassName={'form-control'}
                        isRequiredField
                        isTouched={touched.issuedPlace}
                        isError={errors.issuedPlace && touched.issuedPlace}
                        errorMessage={t(errors.issuedPlace)}
                      />
                    </div>
                    <div className="row">
                      <CommonTextInput
                        containerClassName={'form-group col-lg-4'}
                        value={values.issuedDate ?? ''}
                        onBlur={handleBlur(`issuedDate`)}
                        onChange={handleChange(`issuedDate`)}
                        inputID={`issuedDate`}
                        labelText={t('label.start_date2')}
                        inputType={'date'}
                        inputClassName={'form-control'}
                        isRequiredField
                        isTouched={touched.issuedDate}
                        isError={errors.issuedDate && touched.issuedDate}
                        errorMessage={t(errors.issuedDate)}
                      />
                    </div>
                    <div className="row">
                      <CommonMultipleTextInput
                        containerClassName={'form-group col-xl-12'}
                        value={values.note}
                        onBlur={handleBlur('note')}
                        onChange={handleChange('note')}
                        inputID={'note'}
                        labelText={t('label.note')}
                        inputClassName={'form-control'}
                      />
                    </div>
                    <div className="row">
                      <CommonUploadFileButton
                        name={`attaches`}
                        containerClassName="form-group col-xl-12"
                        buttonClassName="btn btn-primary"
                        value={values.attaches}
                      />
                    </div>
                    <hr className="mt-1" />
                    {renderButtons([
                      {
                        type: 'button',
                        className: `btn btn-primary  mx-2`,
                        onClick: () => {
                          handleReset();
                          document.getElementById('newDegree').hidden = true;
                          document.getElementById('addBtn').disabled = false;
                        },
                        name: t('label.cancel'),
                        position: 'right',
                      },

                      {
                        type: 'button',
                        className: `btn btn-primary px-4 ml-4`,
                        onClick: async () => {
                          let err = await validateForm();
                          if (err !== undefined) setTouched(err);
                          console.log(values);
                          create(values);
                          dispatch(fetchDiplomaByType({ profileId: match.params.id, type: 'degree' }));
                          handleReset();
                          document.getElementById('newDegree').hidden = true;
                          document.getElementById('addBtn').disabled = false;
                        },
                        name: t('label.save'),
                      },
                    ])}
                  </div>

                  <br />

                  <AutoSubmitToken />
                </Form>
              );
            }}
          </Formik>
          <Formik initialValues={initialValues} enableReinitialize validationSchema={DegreesSchema} onSubmit={() => {}}>
            {({ values, errors, touched, handleReset, handleBlur, handleSubmit, handleChange, validateForm, setFieldValue }) => {
              return (
                <Form>
                  <FieldArray
                    name="degrees"
                    render={({ insert, remove, push }) => (
                      <div>
                        {values.degrees &&
                          values.degrees.length > 0 &&
                          values.degrees.map((friend, index) => (
                            <div key={index} className="shadow bg-white rounded m-4 p-4">
                              <h5>{index + 1}.</h5>
                              <hr className="mt-1" />
                              <div className="row">
                                <CommonSelectInput
                                  containerClassName={'form-group col-lg-4'}
                                  value={friend.level ?? ''}
                                  onBlur={handleBlur(`degrees.${index}.level`)}
                                  onChange={handleChange(`degrees.${index}.level`)}
                                  inputID={`degrees.${index}.level`}
                                  labelText={t('label.academic_level')}
                                  selectClassName={'form-control'}
                                  placeholder={t('placeholder.select_academic_level')}
                                  isRequiredField
                                  isTouched={touched && touched.degrees && touched.degrees[index]?.level}
                                  isError={
                                    errors &&
                                    errors.degrees &&
                                    errors.degrees[index]?.level &&
                                    touched &&
                                    touched.degrees &&
                                    touched.degrees[index]?.level
                                  }
                                  errorMessage={t(errors && errors.degrees && errors.degrees[index]?.level)}
                                  lstSelectOptions={academicLevels}
                                />
                                <CommonTextInput
                                  containerClassName={'form-group col-lg-4'}
                                  value={friend.name ?? ''}
                                  onBlur={handleBlur(`degrees.${index}.name`)}
                                  onChange={handleChange(`degrees.${index}.name`)}
                                  inputID={`degrees.${index}.name`}
                                  labelText={t('label.major')}
                                  inputType={'text'}
                                  placeholder={t('placeholder.enter_academic_major')}
                                  inputClassName={'form-control'}
                                  isRequiredField
                                  isTouched={touched && touched.degrees && touched.degrees[index]?.name}
                                  isError={
                                    errors &&
                                    errors.degrees &&
                                    errors.degrees[index]?.name &&
                                    touched &&
                                    touched.degrees &&
                                    touched.degrees[index]?.name
                                  }
                                  errorMessage={t(errors && errors.degrees && errors.degrees[index]?.name)}
                                />
                                <CommonTextInput
                                  containerClassName={'form-group col-lg-4'}
                                  value={friend.issuedPlace ?? ''}
                                  onBlur={handleBlur(`degrees.${index}.issuedPlace`)}
                                  onChange={handleChange(`degrees.${index}.issuedPlace`)}
                                  inputID={`degrees.${index}.issuedPlace`}
                                  labelText={t('label.education_place')}
                                  inputType={'text'}
                                  placeholder={t('placeholder.enter_education_place')}
                                  inputClassName={'form-control'}
                                  isRequiredField
                                  isTouched={touched && touched.degrees && touched.degrees[index]?.issuedPlace}
                                  isError={
                                    errors &&
                                    errors.degrees &&
                                    errors.degrees[index]?.issuedPlace &&
                                    touched &&
                                    touched.degrees &&
                                    touched.degrees[index]?.issuedPlace
                                  }
                                  errorMessage={t(errors && errors.degrees && errors.degrees[index]?.issuedPlace)}
                                />
                              </div>
                              <div className="row">
                                <CommonTextInput
                                  containerClassName={'form-group col-lg-4'}
                                  value={friend.issuedDate ?? ''}
                                  onBlur={handleBlur(`degrees.${index}.issuedDate`)}
                                  onChange={handleChange(`degrees.${index}.issuedDate`)}
                                  inputID={`degrees.${index}.issuedDate`}
                                  labelText={t('label.start_date2')}
                                  inputType={'date'}
                                  inputClassName={'form-control'}
                                  isRequiredField
                                  isTouched={touched && touched.degrees && touched.degrees[index]?.issuedDate}
                                  isError={
                                    errors &&
                                    errors.degrees &&
                                    errors.degrees[index]?.issuedDate &&
                                    touched &&
                                    touched.degrees &&
                                    touched.degrees[index]?.issuedDate
                                  }
                                  errorMessage={t(errors && errors.degrees && errors.degrees[index]?.issuedDate)}
                                />
                              </div>
                              <div className="row">
                                <CommonMultipleTextInput
                                  containerClassName={'form-group col-xl-12'}
                                  value={friend.note}
                                  onBlur={handleBlur(`degrees.${index}.note`)}
                                  onChange={handleChange(`degrees.${index}.note`)}
                                  inputID={`degrees.${index}.note`}
                                  labelText={t('label.note')}
                                  inputClassName={'form-control'}
                                />
                              </div>
                              <div className="row">
                                <CommonUploadFileButton
                                  name={`degrees.${index}.attaches`}
                                  containerClassName="form-group col-xl-12"
                                  buttonClassName="btn btn-primary"
                                  value={values.degrees[index].attaches}
                                />
                              </div>
                              <hr className="mt-1" />
                              {renderButtons([
                                {
                                  type: 'button',
                                  className: `btn btn-primary px-4 mx-4`,
                                  onClick: () => {
                                    removeCertificate(friend, () => remove(index));
                                    dispatch({
                                      type: REDUX_STATE.notification.SET_NOTI,
                                      payload: { open: true, type: 'success', message: t('message.successful_delete') },
                                    });
                                  },
                                  name: t('label.delete'),
                                  position: 'right',
                                },
                                {
                                  type: 'button',
                                  className: `btn btn-primary px-4 mx-4`,
                                  onClick: () => {
                                    setFieldValue(`degrees.${index}`, initialValues.degrees[index]);
                                  },
                                  name: t('label.reset'),
                                  position: 'right',
                                },
                                {
                                  type: 'button',
                                  className: `btn btn-primary px-4 ml-4`,
                                  onClick: () => {
                                    create(friend);
                                    dispatch(fetchDiplomaByType({ profileId: match.params.id, type: 'degree' }));
                                  },
                                  name: friend.id ? t('label.save') : t('label.create_new'),
                                },
                              ])}
                            </div>
                          ))}
                      </div>
                    )}
                  />
                  <br />

                  <AutoSubmitToken />
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </CContainer>
  );
};
export default AcademicLevel;
