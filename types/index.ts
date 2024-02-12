type SortOption = 'date' | 'title';
type OrderBy = 'asc' | 'desc';
type QueryMenu = 'sort' | 'search' | 'update';

// type QueryParamKeys = "sorted" | "orderBy" | "q" | "page"
type QueryParam = {
  sorted?: SortOption;
  orderBy?: OrderBy;
  q?: string;
  page?: string;
};

type ApiResponse<T> = {
  total_page: number;
  current_page: number;
  data: T[];
};

type Token = {
  accessToken: string;
  refreshToken: string;
};
type LoginResponse = Token & {
  message: string;
};

type MailTemplate = {
  from_name: string;
  to_email: string;
  link: string;
  message: string;
};

export type {
  SortOption,
  OrderBy,
  QueryMenu,
  QueryParam,
  ApiResponse,
  LoginResponse,
  Token,
  MailTemplate,
};
