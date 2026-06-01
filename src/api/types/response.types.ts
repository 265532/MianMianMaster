export interface ResponseModel<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedData<T = any> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}
