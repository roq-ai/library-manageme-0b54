import { BookInterface } from 'interfaces/book';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface BorrowingInterface {
  id?: string;
  book_id?: string;
  user_id?: string;
  borrow_date: any;
  return_date?: any;
  created_at?: any;
  updated_at?: any;

  book?: BookInterface;
  user?: UserInterface;
  _count?: {};
}

export interface BorrowingGetQueryInterface extends GetQueryInterface {
  id?: string;
  book_id?: string;
  user_id?: string;
}
