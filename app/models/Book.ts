// Google Books API interfaces
export interface GoogleBooksApiResponse {
  kind: string;
  totalItems: number;
  items: GoogleBookItem[];
}

export interface GoogleBookItem {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
  saleInfo?: SaleInfo;
  accessInfo?: AccessInfo;
  searchInfo?: SearchInfo;
}

export interface VolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: IndustryIdentifier[];
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  maturityRating?: string;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    extraLarge?: string;
  };
  language?: string;
  previewLink?: string;
  infoLink?: string;
  canonicalVolumeLink?: string;
}

export interface IndustryIdentifier {
  type: string;
  identifier: string;
}

export interface SaleInfo {
  country: string;
  saleability: string;
  isEbook: boolean;
  listPrice?: {
    amount: number;
    currencyCode: string;
  };
  retailPrice?: {
    amount: number;
    currencyCode: string;
  };
  buyLink?: string;
}

export interface AccessInfo {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub: {
    isAvailable: boolean;
    acsTokenLink?: string;
  };
  pdf: {
    isAvailable: boolean;
    acsTokenLink?: string;
  };
  webReaderLink?: string;
  accessViewStatus?: string;
  quoteSharingAllowed?: boolean;
}

export interface SearchInfo {
  textSnippet?: string;
}

// Simplified Book model for storing in Firebase
export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  thumbnail?: string;
  smallThumbnail?: string;
  language?: string;
  previewLink?: string;
  infoLink?: string;
  isbn10?: string;
  isbn13?: string;
}

// Function to convert from Google Books API format to our app's format
export function convertGoogleBookToBook(googleBook: GoogleBookItem): Book {
  // Find ISBN numbers if available
  const isbn10 = googleBook.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier;
  const isbn13 = googleBook.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier;
  
  return {
    id: googleBook.id,
    title: googleBook.volumeInfo.title,
    subtitle: googleBook.volumeInfo.subtitle,
    authors: googleBook.volumeInfo.authors || ['Unknown Author'],
    publisher: googleBook.volumeInfo.publisher,
    publishedDate: googleBook.volumeInfo.publishedDate,
    description: googleBook.volumeInfo.description,
    pageCount: googleBook.volumeInfo.pageCount,
    categories: googleBook.volumeInfo.categories,
    averageRating: googleBook.volumeInfo.averageRating,
    ratingsCount: googleBook.volumeInfo.ratingsCount,
    thumbnail: googleBook.volumeInfo.imageLinks?.thumbnail,
    smallThumbnail: googleBook.volumeInfo.imageLinks?.smallThumbnail,
    language: googleBook.volumeInfo.language,
    previewLink: googleBook.volumeInfo.previewLink,
    infoLink: googleBook.volumeInfo.infoLink,
    isbn10,
    isbn13
  };
}