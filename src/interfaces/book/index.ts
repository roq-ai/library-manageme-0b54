import { BorrowingInterface } from 'interfaces/borrowing';
import { ReservationInterface } from 'interfaces/reservation';
import { LibraryInterface } from 'interfaces/library';
import { GetQueryInterface } from 'interfaces';

export interface BookInterface {
  id?: string;
  title: string;
  author: string;
  library_id?: string;
  created_at?: any;
  updated_at?: any;
  borrowing?: BorrowingInterface[];
  reservation?: ReservationInterface[];
  library?: LibraryInterface;
  _count?: {
    borrowing?: number;
    reservation?: number;
  };
}

export interface BookGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  author?: string;
  library_id?: string;
}
