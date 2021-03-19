import { CContainer } from '@coreui/react';
import { Formik } from 'formik';
import CommonMultipleTextInput from 'src/components/input/CommonMultipleTextInput';
import CommonTextInput from 'src/components/input/CommonTextInput';

const OtherInfo = () => {
  const otherInfo = {
    taxCode: '',
    nationality: '',
    religion: '',
    note: '',
  };
  return (
    <CContainer fluid className="c-main mb-3 px-4">
      <div className="m-auto">
        <div className="shadow bg-white rounded p-4">
          <Formik initialValues={otherInfo}>
            {({ values, handleBlur, handleSubmit, handleChange, errors, touched }) => (
              <form>
                <div className="row">
                  <CommonTextInput
                    containerClassName={'form-group col-lg-4'}
                    value={values.taxCode}
                    onBlur={handleBlur('taxCode')}
                    onChange={handleChange('taxCode')}
                    inputID={'taxCode'}
                    labelText={'Mã số thuế thu thập cá nhân'}
                    inputType={'text'}
                    placeholder={'Nhập mã số thuế'}
                    inputClassName={'form-control'}
                  />

                  <CommonTextInput
                    containerClassName={'form-group col-lg-4'}
                    value={values.nationality}
                    onBlur={handleBlur('nationality')}
                    onChange={handleChange('nationality')}
                    inputID={'nationality'}
                    labelText={'Quốc tịch'}
                    inputType={'text'}
                    placeholder={'Nhập quốc tịch'}
                    inputClassName={'form-control'}
                  />
                  <CommonTextInput
                    containerClassName={'form-group col-lg-4'}
                    value={values.religion}
                    onBlur={handleBlur('religion')}
                    onChange={handleChange('religion')}
                    inputID={'religion'}
                    labelText={'Tôn giáo'}
                    inputType={'text'}
                    placeholder={'Nhập tôn giáo'}
                    inputClassName={'form-control'}
                  />
                </div>
                <div className="row">
                  <CommonMultipleTextInput
                    containerClassName={'form-group col-lg-12'}
                    value={values.note}
                    onBlur={handleBlur('note')}
                    onChange={handleChange('note')}
                    inputID={'note'}
                    labelText={'Ghi chú'}
                    inputClassName={'form-control'}
                  />
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </CContainer>
  );
};
export default OtherInfo;