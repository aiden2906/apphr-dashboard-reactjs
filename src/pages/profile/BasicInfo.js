import { CContainer } from '@coreui/react';
import { Field, Formik } from 'formik';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CommonCheckbox from 'src/components/checkox/CommonCheckbox';
import AutoSubmitToken from 'src/components/form/AutoSubmitToken';
import CommonSelectInput from 'src/components/input/CommonSelectInput';
import CommonTextInput from 'src/components/input/CommonTextInput';
import FormHeader from 'src/components/text/FormHeader';
import Label from 'src/components/text/Label';
import { ROUTE_PATH } from 'src/constants/key';
import { BasicInfoCreateSchema } from 'src/schema/formSchema';
import { fetchProvinces } from 'src/stores/actions/location';
import { REDUX_STATE } from 'src/stores/states/index';
import { renderButtons } from 'src/utils/formUtils';
import { joinClassName } from 'src/utils/stringUtils';
import { createProfile, updateProfile } from 'src/stores/actions/profile';
import UploadImageSingle from 'src/components/button/UploadImageSingle';

const BasicInfo = ({ t, isCreate, profile, history }) => {
  const provinces = useSelector((state) => state.location.provinces);

  const dispatch = useDispatch();
  const refInfo = useRef();

  useEffect(() => {
    if (provinces.length === 0) dispatch(fetchProvinces());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    profile.have_id = profile.cmnd && profile.cmnd !== '';
    profile.have_passport = profile.passport && profile.passport !== '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.cmnd, profile.passport]);

  const genders = [
    { id: 'male', name: t('label.male') },
    { id: 'female', name: t('label.female') },
  ];
  const academicLevels = [
    { id: 'not_require', name: t('label.not_require') },
    { id: 'intermediate', name: t('label.intermediate') },
    { id: 'college', name: t('label.college') },
    { id: 'university', name: t('label.university') },
    { id: 'master', name: t('label.master') },
    { id: 'doctor_of_philosophy', name: t('label.doctor_of_philosophy') },
  ];
  const buttonsCreate = [
    {
      type: 'button',
      className: `btn btn-primary mr-4`,
      onClick: (e) => {
        history.push(ROUTE_PATH.PROFILE);
      },
      name: t('label.back'),
      position: 'left',
    },
    {
      type: 'button',
      className: `btn btn-primary`,
      onClick: async (e) => {
        refInfo.current.handleSubmit(e);
        let errors = await refInfo.current.validateForm();
        let a =
          errors && // 👈 null and undefined check
          Object.keys(errors).length === 0 &&
          errors.constructor === Object;
        if (!a) return;
        dispatch(createProfile(refInfo.current.values, history, t('message.successful_create')));
      },
      name: t('label.create_new'),
      position: 'right',
    },
  ];

  const buttonsUpdate = [
    {
      type: 'button',
      className: `btn btn-primary mr-4`,
      onClick: (e) => {
        history.push(ROUTE_PATH.PROFILE);
      },
      name: t('label.back'),
      position: 'left',
    },
    {
      type: 'reset',
      className: `btn btn-primary mr-4`,
      onClick: (e) => {
        refInfo.current.handleReset(e);
      },
      name: t('label.reset'),
    },
    {
      type: 'button',
      className: `btn btn-primary`,
      onClick: (e) => {
        refInfo.current.handleSubmit(e);
        refInfo.current.validateForm().then((errors) => {
          let a =
            errors && // 👈 null and undefined check
            Object.keys(errors).length === 0 &&
            errors.constructor === Object;
          if (!a) return;
          dispatch(updateProfile(refInfo.current.values, history, t('message.successful_update')));
        });

        dispatch(updateProfile(refInfo.current.values, history, t('message.successful_update')));
      },
      name: t('label.update'),
      position: 'right',
    },
  ];

  function handleChangeUpload(fileUrl) {
    dispatch({ type: REDUX_STATE.profile.SET_PROFILE, payload: { avatar: fileUrl } });
  }

  return (
    <CContainer fluid className={joinClassName(['c-main mb-3 px-4'])}>
      <div className="row">
        <div className="col-xl-2 mb-4">
          <div className="shadow bg-white rounded p-4">
            <FormHeader text={t('label.avatar')} />
            <UploadImageSingle src={profile.avatar} handleChangeUpload={handleChangeUpload} />
          </div>
        </div>
        <div className=" col-xl-10">
          <div className="shadow bg-white rounded p-4">
            <FormHeader text={t('label.profile_basic_info')} />
            <Formik
              initialValues={profile}
              innerRef={refInfo}
              validationSchema={BasicInfoCreateSchema}
              enableReinitialize
              onSubmit={(values) => {
                dispatch({
                  type: REDUX_STATE.profile.SET_PROFILE,
                  payload: values,
                });
              }}
            >
              {({ values, errors, touched, handleBlur, handleChange, setFieldValue }) => (
                <form>
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="row">
                        <CommonTextInput
                          containerClassName={'form-group col-lg-6'}
                          value={values.code ?? ''}
                          onBlur={handleBlur('code')}
                          onChange={handleChange('code')}
                          inputID={'code'}
                          labelText={t('label.employee_code')}
                          inputType={'text'}
                          placeholder={t('placeholder.enter_employee_code')}
                          inputClassName={'form-control'}
                          isDisable={true}
                        />
                        <CommonTextInput
                          containerClassName={'form-group col-lg-6'}
                          value={values.firstname ?? ''}
                          onBlur={handleBlur('firstname')}
                          onChange={handleChange('firstname')}
                          inputID={'firstname'}
                          labelText={t('label.employee_first_name')}
                          inputType={'text'}
                          placeholder={t('placeholder.enter_employee_firstname')}
                          inputClassName={'form-control'}
                          isRequiredField
                          isTouched={touched.firstname}
                          isError={errors.firstname && touched.firstname}
                          errorMessage={t(errors.firstname)}
                        />
                      </div>
                      <div className="row">
                        <CommonTextInput
                          containerClassName={'form-group col-lg-6'}
                          value={values.lastname ?? ''}
                          onBlur={handleBlur('lastname')}
                          onChange={handleChange('lastname')}
                          inputID={'lastname'}
                          labelText={t('label.employee_last_name')}
                          inputType={'text'}
                          placeholder={t('placeholder.enter_employee_lastname')}
                          inputClassName={'form-control'}
                          isRequiredField
                          isTouched={touched.lastname}
                          isError={errors.lastname && touched.lastname}
                          errorMessage={t(errors.lastname)}
                        />
                        <CommonTextInput
                          containerClassName={'form-group col-lg-6'}
                          value={values.phone ?? ''}
                          onBlur={handleBlur('phone')}
                          onChange={handleChange('phone')}
                          inputID={'phone'}
                          labelText={t('label.phone_number')}
                          inputType={'text'}
                          placeholder={t('placeholder.enter_phone_number')}
                          inputClassName={'form-control'}
                          isRequiredField
                          isTouched={touched.phone}
                          isError={errors.phone && touched.phone}
                          errorMessage={t(errors.phone)}
                        />
                      </div>
                      <div className="row">
                        <CommonTextInput
                          containerClassName={'form-group col-lg-6'}
                          value={values.email ?? ''}
                          onBlur={handleBlur('email')}
                          onChange={handleChange('email')}
                          inputID={'email'}
                          labelText={t('label.email')}
                          inputType={'email'}
                          placeholder={t('placeholder.enter_email')}
                          inputClassName={'form-control'}
                          isRequiredField
                          isTouched={touched.email}
                          isError={errors.email && touched.email}
                          errorMessage={t(errors.email)}
                        />

                        <CommonSelectInput
                          containerClassName={'form-group col-lg-6'}
                          value={values.gender ?? ''}
                          onBlur={handleBlur('gender')}
                          onChange={handleChange('gender')}
                          inputID={'gender'}
                          labelText={t('label.sex')}
                          selectClassName={'form-control'}
                          isRequiredField
                          isTouched={touched.gender}
                          isError={errors.gender && touched.gender}
                          errorMessage={t(errors.gender)}
                          lstSelectOptions={genders}
                          placeholder={t('placeholder.select_sex')}
                        />
                      </div>
                      <div className="row">
                        <CommonTextInput
                          containerClassName={'form-group col-lg-6'}
                          value={values.dateOfBirth ?? undefined}
                          onBlur={handleBlur('dateOfBirth')}
                          onChange={handleChange('dateOfBirth')}
                          inputID={'dateOfBirth'}
                          labelText={t('label.birthday')}
                          inputType={'date'}
                          inputClassName={'form-control'}
                        />
                        <div className="form-group col-lg-6">
                          <Label text={t('label.academic_level')} />
                          <Field className={'form-control'} name={`academicLevel`} component="select">
                            {academicLevels.map((ch, idx) => (
                              <option key={idx} value={ch.id}>
                                {ch.name}
                              </option>
                            ))}
                          </Field>
                        </div>
                      </div>
                      <div className="row"></div>
                      <Label text={t('label.ID_passport')} labelID="checkbox-id-password" className="py-2" />
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="pl-2">
                            <CommonCheckbox
                              label={t('label.ID')}
                              value={values.have_id ?? false}
                              onBlur={handleBlur('have_id')}
                              onChange={handleChange('have_id')}
                            />
                          </div>
                          {values.have_id && (
                            <>
                              <CommonTextInput
                                containerClassName={'form-group'}
                                value={values.cmnd ?? ''}
                                onBlur={handleBlur('cmnd')}
                                onChange={handleChange('cmnd')}
                                inputID={'cmnd'}
                                labelText={t('label.ID_number')}
                                inputType={'text'}
                                placeholder={t('placeholder.enter_ID_number')}
                                inputClassName={'form-control'}
                              />
                              <CommonTextInput
                                containerClassName={'form-group'}
                                value={values.cmndIssuedDate ?? ''}
                                onBlur={handleBlur('cmndIssuedDate')}
                                onChange={handleChange('cmndIssuedDate')}
                                inputID={'cmndIssuedDate'}
                                labelText={t('label.start_date2')}
                                inputType={'date'}
                                inputClassName={'form-control'}
                              />
                              <CommonSelectInput
                                containerClassName={'form-group'}
                                value={values.cmndProvinceId ?? '0'}
                                onBlur={handleBlur('cmndProvinceId')}
                                onChange={handleChange('cmndProvinceId')}
                                inputID={'cmndProvinceId'}
                                labelText={t('label.grant_place')}
                                selectClassName={'form-control'}
                                placeholder={t('placeholder.select_province')}
                                lstSelectOptions={provinces}
                              />
                            </>
                          )}
                        </div>
                        <div className="col-lg-6">
                          <div className="pl-2">
                            <CommonCheckbox
                              label={t('label.passport')}
                              value={values.have_passport ?? false}
                              onBlur={handleBlur('have_passport')}
                              onChange={handleChange('have_passport')}
                            />
                          </div>
                          {values.have_passport && (
                            <>
                              <CommonTextInput
                                containerClassName={'form-group'}
                                value={values.passport ?? ''}
                                onBlur={handleBlur('passport')}
                                onChange={handleChange('passport')}
                                inputID={'passport'}
                                labelText={t('label.passport')}
                                inputType={'text'}
                                placeholder={t('placeholder.enter_passport_number')}
                                inputClassName={'form-control'}
                              />
                              <div className="row">
                                <CommonTextInput
                                  containerClassName={'form-group col-6'}
                                  value={values.passportIssuedDate ?? ''}
                                  onBlur={handleBlur('passportIssuedDate')}
                                  onChange={handleChange('passportIssuedDate')}
                                  inputID={'passportIssuedDate'}
                                  labelText={t('label.start_date2')}
                                  inputType={'date'}
                                  inputClassName={'form-control'}
                                />
                                <CommonTextInput
                                  containerClassName={'form-group col-6'}
                                  value={values.passport_end ?? ''}
                                  onBlur={handleBlur('passport_end')}
                                  onChange={handleChange('passport_end')}
                                  inputID={'passport_end'}
                                  labelText={t('label.expiration_date')}
                                  inputType={'date'}
                                  inputClassName={'form-control'}
                                />
                              </div>
                              <CommonSelectInput
                                containerClassName={'form-group'}
                                value={values.passportProvinceId ?? '0'}
                                onBlur={handleBlur('passportProvinceId')}
                                onChange={handleChange('passportProvinceId')}
                                inputID={'passportProvinceId'}
                                labelText={t('label.grant_place')}
                                selectClassName={'form-control'}
                                placeholder={t('placeholder.select_province')}
                                lstSelectOptions={provinces}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <AutoSubmitToken />
                  </div>
                  {renderButtons(isCreate ? buttonsCreate : buttonsUpdate)}
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </CContainer>
  );
};
export default BasicInfo;
