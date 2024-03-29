import { CContainer } from '@coreui/react';
import { CircularProgress } from '@material-ui/core';
import { Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CommonMultipleTextInput from 'src/components/input/CommonMultipleTextInput';
import CommonTextInput from 'src/components/input/CommonTextInput';
import { PERMISSION } from 'src/constants/key';
import { fetchProfile, updateOtherInfo } from 'src/stores/actions/profile';
import { renderButtons } from 'src/utils/formUtils';

const OtherInfo = ({ t, match, history }) => {
  const permissionIds = JSON.parse(localStorage.getItem('permissionIds'));
  const otherInfoRef = useRef();
  const profile = useSelector((state) => state.profile.profile);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
    if (permissionIds.includes(PERMISSION.GET_PROFILE)) dispatch(fetchProfile(+match.params.id, setLoading));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getButtonsUpdate = (action) => {
    return permissionIds.includes(PERMISSION.UPDATE_PROFILE)
      ? [
          {
            type: 'reset',
            className: `btn btn-primary mr-4`,
            onClick: (e) => {
              otherInfoRef.current.handleReset(e);
            },
            name: t('label.reset'),
          },
          {
            type: 'button',
            className: `btn btn-primary`,
            onClick: (e) => {
              otherInfoRef.current.handleSubmit(e);
            },
            name: t('label.update'),
            position: 'right',
          },
        ]
      : [];
  };
  return (
    <>
      {loading ? (
        <div className="text-center pt-4">
          <CircularProgress />
        </div>
      ) : (
        <CContainer fluid className="c-main m-auto p-4">
          <div className="m-auto">
            <div className="shadow bg-white rounded p-4">
              <Formik
                initialValues={profile}
                enableReinitialize
                innerRef={otherInfoRef}
                onSubmit={(values) => {
                  dispatch(updateOtherInfo(values, t('message.successful_update')));
                }}
              >
                {({ values, handleBlur, handleChange }) => (
                  <form>
                    <div className="row">
                      <CommonTextInput
                        containerClassName={'form-group col-xl-4'}
                        value={values.taxCode ?? ''}
                        onBlur={handleBlur('taxCode')}
                        onChange={handleChange('taxCode')}
                        inputID={'taxCode'}
                        labelText={t('label.personal_income_tax')}
                        inputType={'text'}
                        placeholder={t('placeholder.enter_personal_income_tax')}
                        inputClassName={'form-control'}
                      />

                      <CommonTextInput
                        containerClassName={'form-group col-xl-4'}
                        value={values.nationality ?? ''}
                        onBlur={handleBlur('nationality')}
                        onChange={handleChange('nationality')}
                        inputID={'nationality'}
                        labelText={t('label.nationality')}
                        inputType={'text'}
                        placeholder={t('placeholder.select_nationality')}
                        inputClassName={'form-control'}
                      />
                      <CommonTextInput
                        containerClassName={'form-group col-xl-4'}
                        value={values.religion ?? ''}
                        onBlur={handleBlur('religion')}
                        onChange={handleChange('religion')}
                        inputID={'religion'}
                        labelText={t('label.religion')}
                        inputType={'text'}
                        placeholder={t('placeholder.enter_religion')}
                        inputClassName={'form-control'}
                      />
                    </div>
                    <div className="row">
                      <CommonMultipleTextInput
                        containerClassName={'form-group col-xl-12'}
                        value={values.note ?? ''}
                        onBlur={handleBlur('note')}
                        onChange={handleChange('note')}
                        inputID={'note'}
                        labelText={t('label.note')}
                        inputClassName={'form-control'}
                      />
                    </div>
                    {renderButtons(getButtonsUpdate())}
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </CContainer>
      )}
    </>
  );
};
export default OtherInfo;
