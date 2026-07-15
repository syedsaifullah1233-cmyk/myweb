import { ContactMessagePayload, Project, WebsiteContent, TestimonialItem } from '../types';

const API_BASE = '/api';

// Retrieve auth token from localStorage
export function getAuthToken(): string | null {
  return localStorage.getItem('aura_pixel_admin_token');
}

// Set auth token to localStorage
export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('aura_pixel_admin_token', token);
  } else {
    localStorage.removeItem('aura_pixel_admin_token');
  }
}

// Generate Authorization Headers
function getHeaders(extraHeaders: Record<string, string> = {}): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // --- AUTHENTICATION ---
  async login(email: string, password: string): Promise<{ success: boolean; token: string; admin: { email: string } }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Authentication failed. Incorrect email or password.');
    }
    const data = await res.json();
    setAuthToken(data.token);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/admin/logout`, {
        method: 'POST',
        headers: getHeaders()
      });
    } catch (e) {
      console.warn('Network logout failed, clearing local token anyway');
    } finally {
      setAuthToken(null);
    }
  },

  async verifyStatus(): Promise<boolean> {
    const token = getAuthToken();
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/admin/status`, {
        headers: getHeaders()
      });
      if (!res.ok) return false;
      const data = await res.json();
      return !!data.authenticated;
    } catch {
      return false;
    }
  },

  // --- PROJECTS ---
  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/projects`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to retrieve portfolio projects.');
    }
    return res.json();
  },

  async addProject(project: Omit<Project, 'id'>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(project)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to create new portfolio project.');
    }
    return res.json();
  },

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(project)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to update portfolio project.');
    }
    return res.json();
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to delete portfolio project.');
    }
  },

  // --- CONTENT ---
  async getContent(): Promise<WebsiteContent> {
    const res = await fetch(`${API_BASE}/content`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to retrieve website content sections.');
    }
    return res.json();
  },

  async updateContent(content: WebsiteContent): Promise<void> {
    const res = await fetch(`${API_BASE}/content`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(content)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to update website content details.');
    }
  },

  // --- MEDIA ---
  async uploadFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const res = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
              fileData: reader.result as string,
              originalName: file.name
            })
          });
          if (!res.ok) {
            const data = await res.json();
            reject(new Error(data.error || 'File upload rejected by backend.'));
            return;
          }
          const data = await res.json();
          resolve(data.url);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
    });
  },

  // --- TESTIMONIALS ---
  async submitTestimonial(testimonial: Omit<TestimonialItem, 'id'>): Promise<{ success: boolean; message: string; testimonial: TestimonialItem }> {
    const res = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonial)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to submit review.');
    }
    return res.json();
  },

  // --- CONTACT FORM ---
  async submitContact(payload: ContactMessagePayload): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Submission failed. Please check field validation and try again.');
    }
    return res.json();
  }
};
