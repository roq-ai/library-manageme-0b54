import * as yup from 'yup';

export const reservationValidationSchema = yup.object().shape({
  due_date: yup.date().required(),
  book_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
