export type ApiProject = {
  id: number;
  title: string;
  url: string;
  target: string;
  task: string;
  about_company: string | { title: string; description: string } | null;
  stages: string | Array<{ title: string; description: string; img: string | null }> | null;
  result: string | { description: string; images: Array<{ type: string; img: string | null }> } | null;
  progress: string | Array<{ digit: number; text: string }> | null;
  preview_img: string | null;
  notebook_img: string | null;
  main_img: string | null;
  created_at?: string | null;
};

export type ApiRole = {
  id: number;
  name: string;
};

export type ApiUser = {
  id: number;
  email: string;
  fullname: string | null;
  role_ids: string | null;
  created_at?: string | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type RefreshTokenRequest = {
  refresh_token: string;
};

export type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type CreateRoleRequest = {
  name: string;
};

export type UpdateRoleRequest = {
  name: string;
};

export type CreateUserRequest = {
  email: string;
  password: string;
  fullname?: string;
  role_ids: string; // comma-separated role IDs
};

export type UpdateUserRequest = {
  email?: string;
  password?: string;
  fullname?: string;
  role_ids?: string; // comma-separated role IDs
};

const BASE_URL = ('http://localhost:8000').replace(/\/$/, '').replace(/\/api$/, '');
const API_BASE_URL = `${BASE_URL}/api`;

export const getImageUrl = (path: string | null) => {
  if (!path) return '';
  // If it's already a full URL or blob URL, return as-is
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  // If it's an asset path, return as-is
  if (path.startsWith('/assets') || path.startsWith('assets/')) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  // Always use full backend URL for uploads (both client and server)
  // This ensures images are loaded from the backend server
  return `${BASE_URL}/uploads/${path.replace(/^\//, '')}`;
};

// Token helpers
export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }
};

export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', token.startsWith('Bearer ') ? token : `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    // не кешируем, чтобы админ всегда видел актуальные данные
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `API error ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json() as Promise<T>;
}

async function apiFormUrlEncoded<T>(
  path: string,
  data: Record<string, string>,
  init?: RequestInit
): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', token.startsWith('Bearer ') ? token : `Bearer ${token}`);
  }

  const formData = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    method: init?.method || 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...Object.fromEntries(headers.entries()),
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `API error ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json() as Promise<T>;
}

// ===== Projects =====

// Список проектов (GET /projects)
export async function fetchProjectsFromApi(): Promise<ApiProject[]> {
  return apiJson<ApiProject[]>('/projects');
}

// Полный проект по id (GET /projects/{project_id})
export async function fetchProjectFromApi(
  projectId: number | string
): Promise<ApiProject> {
  return apiJson<ApiProject>(`/projects/${projectId}`);
}

// Создать проект (POST /projects, multipart/form-data)
export async function createProjectOnApi(formData: FormData) {
  const token = getAccessToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Create project failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json();
}

// Обновить проект (PUT /projects/{project_id}, multipart/form-data)
export async function updateProjectOnApi(
  projectId: number | string,
  formData: FormData
) {
  const token = getAccessToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'PUT',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Update project failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json();
}

// Удалить проект (DELETE /projects/{project_id})
export async function deleteProjectOnApi(projectId: number | string) {
  const token = getAccessToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Delete project failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json();
}

// ===== Auth =====

// Вход (POST /auth/login)
export async function loginOnApi(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append('email', credentials.email);
  formData.append('password', credentials.password);

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Login failed: ${text || res.statusText}`);
  }

  const resData = await res.json();
  const authHeader = res.headers.get('Authorization');
  const refreshHeader = res.headers.get('X-Refresh-Token');

  const access_token = resData.access_token || authHeader?.replace('Bearer ', '');
  const refresh_token = resData.refresh_token || refreshHeader;

  if (!access_token || !refresh_token) {
    throw new Error('Tokens not found in response');
  }

  setTokens(access_token, refresh_token);

  return {
    access_token,
    refresh_token,
    token_type: 'bearer',
  };
}

// Обновить токен (POST /auth/refresh)
export async function refreshTokenOnApi(
  request: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  return apiFormUrlEncoded<RefreshTokenResponse>('/auth/refresh', request);
}

// ===== Admin Roles =====

// Получить список ролей (GET /admin/roles)
export async function fetchRolesFromApi(): Promise<ApiRole[]> {
  return apiJson<ApiRole[]>('/admin/roles');
}

// Создать роль (POST /admin/roles)
export async function createRoleOnApi(
  request: CreateRoleRequest
): Promise<ApiRole> {
  return apiFormUrlEncoded<ApiRole>('/admin/roles', request);
}

// Обновить роль (PUT /admin/roles/{role_id})
export async function updateRoleOnApi(
  roleId: number | string,
  request: UpdateRoleRequest
): Promise<ApiRole> {
  return apiFormUrlEncoded<ApiRole>(
    `/admin/roles/${roleId}`,
    request,
    { method: 'PUT' }
  );
}

// Удалить роль (DELETE /admin/roles/{role_id})
export async function deleteRoleOnApi(roleId: number | string) {
  const token = getAccessToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/admin/roles/${roleId}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Delete role failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json();
}

// ===== Admin Users =====

// Получить список пользователей (GET /admin/users)
export async function fetchUsersFromApi(): Promise<ApiUser[]> {
  return apiJson<ApiUser[]>('/admin/users');
}

// Получить пользователя по id (GET /admin/users/{user_id})
export async function fetchUserFromApi(
  userId: number | string
): Promise<ApiUser> {
  return apiJson<ApiUser>(`/admin/users/${userId}`);
}

// Создать пользователя (POST /admin/users)
export async function createUserOnApi(
  request: CreateUserRequest
): Promise<ApiUser> {
  return apiFormUrlEncoded<ApiUser>('/admin/users', request);
}

// Обновить пользователя (PUT /admin/users/{user_id})
export async function updateUserOnApi(
  userId: number | string,
  request: UpdateUserRequest
): Promise<ApiUser> {
  return apiFormUrlEncoded<ApiUser>(
    `/admin/users/${userId}`,
    request,
    { method: 'PUT' }
  );
}

// Удалить пользователя (DELETE /admin/users/{user_id})
export async function deleteUserOnApi(userId: number | string) {
  const token = getAccessToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Delete user failed ${res.status}: ${res.statusText}${
        text ? ` – ${text.slice(0, 200)}` : ''
      }`
    );
  }

  return res.json();
}

// ===== Debug =====

// Получить список таблиц БД (GET /tables)
export async function fetchTablesFromApi(): Promise<string[]> {
  return apiJson<string[]>('/tables');
}
