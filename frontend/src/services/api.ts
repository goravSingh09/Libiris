import { Book, CategoryId, UserProfile, UserLibraryItem } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private getToken(): string | null {
    try {
      return localStorage.getItem('libris_jwt_token');
    } catch {
      return null;
    }
  }

  public setToken(token: string | null): void {
    try {
      if (token) {
        localStorage.setItem('libris_jwt_token', token);
      } else {
        localStorage.removeItem('libris_jwt_token');
      }
    } catch (e) {
      console.warn('Failed to save token to localStorage:', e);
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to complete request`);
      }

      return data as T;
    } catch (err: any) {
      // Re-throw for caller to catch and gracefully fallback if offline
      throw err;
    }
  }

  // Auth APIs
  async register(name: string, email: string, password: string) {
    return this.request<{ token: string; user: UserProfile; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  }

  async login(email: string, password: string) {
    return this.request<{ token: string; user: UserProfile; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getMe() {
    return this.request<{ user: UserProfile }>('/auth/me');
  }

  async logout() {
    this.setToken(null);
    return this.request<{ message: string }>('/auth/logout', { method: 'POST' });
  }

  // Books APIs
  async getBooks(params: {
    q?: string;
    category?: CategoryId | 'all';
    author?: string;
    language?: string;
    price?: 'all' | 'free' | 'under10' | 'under20';
    sort?: 'popularity' | 'rating' | 'newest' | 'priceLow';
    page?: number;
    limit?: number;
  } = {}) {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append('q', params.q);
    if (params.category && params.category !== 'all') searchParams.append('category', params.category);
    if (params.author && params.author !== 'all') searchParams.append('author', params.author);
    if (params.language && params.language !== 'all') searchParams.append('language', params.language);
    if (params.price && params.price !== 'all') searchParams.append('price', params.price);
    if (params.sort) searchParams.append('sort', params.sort);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const qs = searchParams.toString();
    return this.request<{ books: Book[]; pagination: any }>(`/books${qs ? `?${qs}` : ''}`);
  }

  async getBookById(id: string) {
    return this.request<Book>(`/books/${id}`);
  }

  async adminCreateBook(bookData: Partial<Book>) {
    return this.request<{ message: string; book: Book }>('/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
  }

  async adminUpdateBook(id: string, updates: Partial<Book>) {
    return this.request<{ message: string; book: Book }>(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async adminDeleteBook(id: string) {
    return this.request<{ message: string }>(`/books/${id}`, {
      method: 'DELETE'
    });
  }

  // Categories APIs
  async getCategories() {
    return this.request<any[]>('/categories');
  }

  // Library APIs
  async getLibrary() {
    return this.request<{ items: any[]; libraryMap: Record<string, UserLibraryItem> }>('/library');
  }

  async saveBook(bookId: string) {
    return this.request<{ saved: boolean; message: string }>('/library/save/' + bookId, {
      method: 'POST'
    });
  }

  async syncProgress(data: { bookId: string; chapterId?: string; page: number; totalPages?: number }) {
    return this.request<{ message: string; item: any }>('/library/progress', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async toggleBookmark(data: { bookId: string; page: number; chapterTitle: string; note?: string }) {
    return this.request<{ bookmarked: boolean; message: string; bookmarks: any[] }>('/library/bookmark', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Purchases APIs
  async checkout(bookId: string, paymentMethod: string = 'upi', isDemo: boolean = true) {
    return this.request<{ message: string; purchase: any; unlockedBookIds: string[] }>('/purchases/checkout', {
      method: 'POST',
      body: JSON.stringify({ bookId, paymentMethod, isDemo })
    });
  }

  async getMyPurchases() {
    return this.request<any[]>('/purchases/my');
  }

  // Admin APIs
  async getAdminMetrics() {
    return this.request<{ metrics: any; recentPurchases: any[] }>('/admin/metrics');
  }

  async getAdminUsers() {
    return this.request<any[]>('/admin/users');
  }
}

export const api = new ApiClient();
