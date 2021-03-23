import { Label } from '@material-ui/icons';
import { Formik } from 'formik';
import CommonMultipleTextInput from 'src/components/input/CommonMultipleTextInput';
import CommonMultiSelectInput from 'src/components/input/CommonMultiSelectInput';
import CommonTextInput from 'src/components/input/CommonTextInput';
import CommonUploadFileButton from 'src/components/input/CommonUploadFileButton';
import FormHeader from 'src/components/text/FormHeader';

const NotificationForm = ({ t, notificationInfo }) => {
  return (
    <div className="shadow bg-white rounded p-4 container">
      <FormHeader text="Thông báo" />
      <Formik initialValues={notificationInfo} enableReinitialize onSubmit={(values) => console.log(values)}>
        {({ values, handleChange, handleBlur, errors, touched, handleSubmit }) => (
          <form>
            <div className="form-group col-lg-12">
              <Label text="Đến" required={true} />
              <div className="d-flex flex-row flex-wrap justify-content-between border">
                <CommonMultiSelectInput values={values.to} listValues={[]} onChangeValues={handleChange('to')} />
              </div>
            </div>
            <CommonTextInput
              containerClassName={'form-group col-lg-12'}
              value={values.title}
              onBlur={handleBlur('title')}
              onChange={handleChange('title')}
              inputID={'title'}
              labelText={t('title.notification_title')}
              inputType={'text'}
              placeholder={t('placeholder.enter__notification_title')}
              inputClassName={'form-control'}
              isRequiredField
              isTouched={touched.title}
              isError={errors.title && touched.title}
              errorMessage={errors.title}
            />
            <CommonMultipleTextInput
              containerClassName={'form-group col-lg-12'}
              value={values.content}
              onBlur={handleBlur('content')}
              onChange={handleChange('content')}
              inputID={'content'}
              labelText={t('placeholder.notification_content')}
              placeholder={''}
              inputClassName={'form-control'}
              rows={10}
            />
            <CommonUploadFileButton name={'files'} containerClassName="form-group col-lg-12" buttonClassName="btn btn-primary" value={values.files} />
          </form>
        )}
      </Formik>
    </div>
  );
};
export default NotificationForm;
