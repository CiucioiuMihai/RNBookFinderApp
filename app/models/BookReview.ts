export interface BookReview {
  id?: string; // Firebase document ID
  bookId: string;
  userId: string;
  userName?: string;
  rating: number; // 1-5
  review?: string;
  createdAt: Date | number;
  updatedAt?: Date | number;
}