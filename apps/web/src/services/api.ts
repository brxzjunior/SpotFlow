import {
  ApiResponse,
  AIStudioPromptRequest,
  AIPlaylistPreview,
  SpotifyPlaylist,
  SpotifyPlaylistWithTracks,
  CreatePlaylistRequest
} from '@spotflow/shared';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function getStoredToken(): string | null {
  return localStorage.getItem('spotflow_token');
}

export function setStoredToken(token: string): void {
  localStorage.setItem('spotflow_token', token);
}

export function removeStoredToken(): void {
  localStorage.removeItem('spotflow_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    const errorMsg = body.error?.message || `Erro na requisição (${response.status})`;
    throw new Error(errorMsg);
  }

  return body.data as T;
}

export const api = {
  // Auth
  async loginDemo(): Promise<{ token: string; user: unknown }> {
    const data = await request<{ token: string; user: unknown }>('/api/auth/demo', {
      method: 'POST'
    });
    setStoredToken(data.token);
    return data;
  },

  async getAuthStatus() {
    return request<any>('/api/auth/me');
  },

  async getSpotifyConfig(): Promise<{ isConfigured: boolean; clientId: string | null }> {
    return request<{ isConfigured: boolean; clientId: string | null }>('/api/auth/spotify/config');
  },

  async saveSpotifyCredentials(clientId: string, clientSecret: string): Promise<{ message: string }> {
    return request<{ message: string }>('/api/auth/spotify/credentials', {
      method: 'POST',
      body: JSON.stringify({ clientId, clientSecret })
    });
  },

  async logout(): Promise<void> {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      removeStoredToken();
    }
  },

  // Spotify
  async getPlaylists(limit = 20, offset = 0): Promise<SpotifyPlaylist[]> {
    return request<SpotifyPlaylist[]>(`/api/spotify/playlists?limit=${limit}&offset=${offset}`);
  },

  async getPlaylistDetails(id: string): Promise<SpotifyPlaylistWithTracks> {
    return request<SpotifyPlaylistWithTracks>(`/api/spotify/playlists/${id}`);
  },

  // Studio
  async generateStudioPreview(payload: AIStudioPromptRequest): Promise<AIPlaylistPreview> {
    return request<AIPlaylistPreview>('/api/studio/preview', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async confirmCreatePlaylist(payload: CreatePlaylistRequest, idempotencyKey: string): Promise<SpotifyPlaylist> {
    return request<SpotifyPlaylist>('/api/studio/confirm', {
      method: 'POST',
      headers: {
        'X-Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(payload)
    });
  },

  // Automations
  async getAutomations() {
    return request<any[]>('/api/automations');
  },

  async getAutomationDetails(id: string) {
    return request<any>(`/api/automations/${id}`);
  },

  async triggerAutomation(id: string, isDryRun = false) {
    return request<any>(`/api/automations/${id}/trigger`, {
      method: 'POST',
      body: JSON.stringify({ isDryRun })
    });
  },

  async updateAutomationStatus(id: string, isEnabled: boolean) {
    return request<any>(`/api/automations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isEnabled })
    });
  },

  // Insights
  async getInsightsSummary() {
    return request<any>('/api/insights/summary');
  },

  async getDuplicateAudits() {
    return request<any>('/api/insights/duplicates');
  },

  // Copilot
  async sendCopilotMessage(message: string) {
    return request<any>('/api/copilot/message', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  },

  async executeCopilotAction(action: any) {
    return request<any>('/api/copilot/execute-action', {
      method: 'POST',
      body: JSON.stringify({ action })
    });
  }
};
