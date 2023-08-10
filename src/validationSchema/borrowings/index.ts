import * as yup from 'yup';

export const borrowingValidationSchema = yup.object().shape({
  borrow_date: yup.date().required(),
  return_date: yup.date().nullable(),
  book_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
