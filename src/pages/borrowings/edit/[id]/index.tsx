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
  Center,
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
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getBorrowingById, updateBorrowingById } from 'apiSdk/borrowings';
import { borrowingValidationSchema } from 'validationSchema/borrowings';
import { BorrowingInterface } from 'interfaces/borrowing';
import { BookInterface } from 'interfaces/book';
import { UserInterface } from 'interfaces/user';
import { getBooks } from 'apiSdk/books';
import { getUsers } from 'apiSdk/users';

function BorrowingEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<BorrowingInterface>(
    () => (id ? `/borrowings/${id}` : null),
    () => getBorrowingById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BorrowingInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateBorrowingById(id, values);
      mutate(updated);
      resetForm();
      router.push('/borrowings');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<BorrowingInterface>({
    initialValues: data,
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
              label: 'Update Borrowing',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Borrowing
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(BorrowingEditPage);
