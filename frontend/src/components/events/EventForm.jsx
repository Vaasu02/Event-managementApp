import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Input from '../common/Input';
import Button from '../common/Button';
import api from '../../services/api';
import { useSelector } from 'react-redux';

// Create two different validation schemas - one for create and one for edit
const createEventSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  date: Yup.date().required('Date is required'),
  time: Yup.string().required('Time is required'),
  location: Yup.string().required('Location is required'),
  maxAttendees: Yup.number()
    .min(1, 'Must allow at least 1 attendee')
    .required('Maximum attendees is required'),
  isPrivate: Yup.boolean(),
  image: Yup.mixed()
});

// Edit schema makes all fields optional
const editEventSchema = Yup.object().shape({
  title: Yup.string(),
  description: Yup.string(),
  category: Yup.string(),
  date: Yup.date(),
  time: Yup.string(),
  location: Yup.string(),
  maxAttendees: Yup.number().min(1, 'Must allow at least 1 attendee'),
  isPrivate: Yup.boolean(),
  image: Yup.mixed().nullable(),
  imageUrl: Yup.string()
});

const EventForm = ({ initialValues, onSubmit, buttonText = 'Create Event' }) => {
  const [imagePreview, setImagePreview] = useState(initialValues?.imageUrl || null);
  const isEditing = buttonText.toLowerCase().includes('update');

  const defaultValues = {
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: 50,
    isPrivate: false,
    image: null,
    ...initialValues
  };

  return (
    <Formik
      initialValues={{
        ...defaultValues,
        imageUrl: initialValues?.imageUrl || ''
      }}
      validationSchema={isEditing ? editEventSchema : createEventSchema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          const formData = new FormData();
          
          if (isEditing) {
            // For editing, only include fields that have changed
            Object.keys(values).forEach(key => {
              // Skip imageUrl field as it's only for display
              if (key === 'imageUrl') return;
              
              // Only include changed fields
              if (values[key] !== initialValues[key]) {
                if (key === 'image') {
                  // Only append image if a new file was selected
                  if (values[key] instanceof File) {
                    formData.append('image', values[key], values[key].name);
                  }
                } else {
                  formData.append(key, values[key]);
                }
              }
            });
          } else {
            // For creating, include all fields
            Object.keys(values).forEach(key => {
              if (key === 'imageUrl') return;
              if (key === 'image' && values[key]) {
                formData.append('image', values[key], values[key].name);
              } else if (key !== 'image') {
                formData.append(key, values[key]);
              }
            });
          }

          await onSubmit(formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } catch (error) {
          setErrors({ submit: error.message });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors, touched, setFieldValue, getFieldProps }) => {
        const handleImageChange = (e) => {
          const file = e.currentTarget.files[0];
          if (file) {
            setFieldValue('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
              setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
          }
        };

        return (
          <Form className="space-y-6">
            <Input
              label="Title"
              error={touched.title && errors.title}
              {...getFieldProps('title')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows="4"
                {...getFieldProps('description')}
              />
              {touched.description && errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <Input
              label="Category"
              error={touched.category && errors.category}
              {...getFieldProps('category')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                error={touched.date && errors.date}
                {...getFieldProps('date')}
              />

              <Input
                label="Time"
                type="time"
                error={touched.time && errors.time}
                {...getFieldProps('time')}
              />
            </div>

            <Input
              label="Location"
              error={touched.location && errors.location}
              {...getFieldProps('location')}
            />

            <Input
              label="Maximum Attendees"
              type="number"
              error={touched.maxAttendees && errors.maxAttendees}
              {...getFieldProps('maxAttendees')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Image
              </label>
              {imagePreview && (
                <div className="mb-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                checked={getFieldProps('isPrivate').value}
                {...getFieldProps('isPrivate')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900">
                Make this event private
              </label>
            </div>

            {errors.submit && (
              <div className="text-red-600 text-sm">{errors.submit}</div>
            )}

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full"
            >
              {buttonText}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EventForm; 