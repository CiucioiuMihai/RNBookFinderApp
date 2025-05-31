export interface LocalUser {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  favorites?: string[]; // Book IDs that the user has favorited
  readingList?: string[]; // Book IDs on user's reading list
  readHistory?: string[]; // Book IDs the user has read
  reviews?: { [bookId: string]: string }; // Book IDs mapped to user's reviews
  createdAt?: Date | number; // Timestamp for when user was created
  lastLoginAt?: Date | number; // Timestamp for user's last login
}