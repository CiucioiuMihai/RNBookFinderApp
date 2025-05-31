import { GoogleBooksApiResponse, Book, convertGoogleBookToBook } from '../models/book';

const API_URL = 'https://www.googleapis.com/books/v1/volumes';

export const searchBooks = async (query: string, maxResults: number = 10): Promise<Book[]> => {
  try {
    const response = await fetch(
      `${API_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}`
    );
    const data = await response.json() as GoogleBooksApiResponse;
    
    if (!data.items) {
      return [];
    }
    
    return data.items.map(item => convertGoogleBookToBook(item));
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const data = await response.json();
    
    if (response.ok) {
      return convertGoogleBookToBook(data);
    }
    return null;
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
};