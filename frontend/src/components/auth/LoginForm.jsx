import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Input from '../common/Input';
import Button from '../common/Button';
import { loginSuccess } from '../../features/auth/authSlice';
import api from '../../services/api';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await api.post('/auth/login', values);
      dispatch(loginSuccess(response.data));
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Login failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched, getFieldProps }) => (
        <Form className="space-y-6">
          <Input
            label="Email"
            type="email"
            error={touched.email && errors.email}
            {...getFieldProps('email')}
          />

          <Input
            label="Password"
            type="password"
            error={touched.password && errors.password}
            {...getFieldProps('password')}
          />

          {errors.submit && (
            <div className="text-red-600 text-sm">{errors.submit}</div>
          )}

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full"
          >
            Login
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm; 