import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { updateUser } from '../features/auth/authSlice';
import api from '../services/api';
import { handleSuccess, handleError } from '../utils/errorHandler';

const settingsSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Username must be at least 3 characters'),
  email: Yup.string().email('Invalid email'),
  currentPassword: Yup.string().min(6, 'Password must be at least 6 characters'),
  newPassword: Yup.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.put('/users/profile', values);
      dispatch(updateUser(response.data));
      handleSuccess('Profile updated successfully');
    } catch (error) {
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <Formik
          initialValues={{
            username: user.username || '',
            email: user.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }}
          validationSchema={settingsSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, getFieldProps }) => (
            <Form className="space-y-6">
              <Input
                label="Username"
                error={touched.username && errors.username}
                {...getFieldProps('username')}
              />

              <Input
                label="Email"
                type="email"
                error={touched.email && errors.email}
                {...getFieldProps('email')}
              />

              <div className="border-t pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
                
                <Input
                  label="Current Password"
                  type="password"
                  error={touched.currentPassword && errors.currentPassword}
                  {...getFieldProps('currentPassword')}
                />

                <Input
                  label="New Password"
                  type="password"
                  error={touched.newPassword && errors.newPassword}
                  {...getFieldProps('newPassword')}
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  error={touched.confirmPassword && errors.confirmPassword}
                  {...getFieldProps('confirmPassword')}
                />
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
              >
                Save Changes
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SettingsPage; 