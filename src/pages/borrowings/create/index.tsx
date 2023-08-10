import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createBorrowing } from 'apiSdk/borrowings';
import { borrowingValidationSchema } from 'validationSchema/borrowings';
import { BookInterface } from 'interfaces/book';
import { UserInterface } from 'interfaces/user';
import { getBooks } from 'apiSdk/books';
import { getUsers } from 'apiSdk/users';
import { BorrowingInterface } from 'interfaces/borrowing';

function BorrowingCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: BorrowingInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createBorrowing(values);
      resetForm();
      router.push('/borrowings');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<BorrowingInterface>({
    initialValues: {
      borrow_date: new Date(new Date().toDateString()),
      return_date: new Date(new Date().toDateString()),
      book_id: (router.query.book_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: borrowingValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Borrowings',
              link: '/borrowings',
            },
            {
              label: 'Create Borrowing',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Borrowing
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="borrow_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Borrow Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.borrow_date ? new Date(formik.values?.borrow_date) : null}
              onChange={(value: Date) => formik.setFieldValue('borrow_date', value)}
            />
          </FormControl>
          <FormControl id="return_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Return Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.return_date ? new Date(formik.values?.return_date) : null}
              onChange={(value: Date) => formik.setFieldValue('return_date', value)}
            />
          </FormControl>
          <AsyncSelect<BookInterface>
            formik={formik}
            name={'book_id'}
            label={'Select Book'}
            placeholder={'Select Book'}
            fetcher={getBooks}
            labelField={'title'}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/borrowings')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'borrowing',
    operation: AccessOperationEnum.CREATE,
  }),
)(BorrowingCreatePage);
