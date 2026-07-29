export type Result<T> =
  { readonly ok: true; readonly data: T } | { readonly ok: false; readonly error: RepositoryError };

export interface RepositoryError {
  readonly code: string;
  readonly message: string;
}

export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function err<T>(code: string, message: string): Result<T> {
  return { ok: false, error: { code, message } };
}
