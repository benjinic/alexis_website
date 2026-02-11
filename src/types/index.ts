
import type { Timestamp } from 'firebase/firestore';

export type Booking = {
  id?: string;
  name: string;
  phone: string;
  date: Date;
  style: 'business' | 'casual' | 'wedding' | 'tuxedo' | string;
  notes: string;
  userId: string;
  createdAt: Timestamp;
  status: 'pending' | 'confirmed';
};

export type CollectionLook = {
  id: string;
  title: string;
  description: string;
  image: {
    src: string;
    width: number;
    height: number;
    hint: string;
  };
};
