export interface BookCollection {
  id?: string; // Firebase document ID
  name: string;
  userId: string;
  description?: string;
  books: string[]; // Array of book IDs
  isPublic: boolean;
  createdAt: Date | number;
  updatedAt?: Date | number;
}