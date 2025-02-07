import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Input from '../common/Input';
import Button from '../common/Button';
import { loginSuccess } from '../../features/auth/authSlice';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
});

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await api.post('/auth/register', {
        username: values.username,
        email: values.email,
        password: values.password
      });
      
      toast.success('Registration successful! Please login to continue.');
      navigate('/login');
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Registration failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={registerSchema}
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

          <Input
            label="Password"
            type="password"
            error={touched.password && errors.password}
            {...getFieldProps('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            error={touched.confirmPassword && errors.confirmPassword}
            {...getFieldProps('confirmPassword')}
          />

          {errors.submit && (
            <div className="text-red-600 text-sm">{errors.submit}</div>
          )}

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full"
          >
            Register
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm; 