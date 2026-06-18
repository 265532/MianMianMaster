export interface ResponseModel<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedData<T = unknown> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}
