import type { statusText } from '../utils/statusText'
import type { codes } from '../utils/codes'

export type Status = keyof typeof statusText
export type StatusText = (typeof statusText)[keyof typeof statusText]
export type Code = (typeof codes)[keyof typeof codes]

// Usage: useFetch<Posts[], NuxtError<ApiErrorData>>('/api/posts')
export type ApiErrorData = {
  code: Code,
  errors?: Record<string, string> | null
}

export type User = {
  id: string,
  name: string,
  email: string,
  createdAt: string
}

export type CreateUserInput = Omit<User, 'id' | 'createdAt'>
export type UpdateUserInput = Partial<Pick<User, 'name' | 'email'>>

/* ======================

====================== */

export type Post = {
  id: string,
  title: string,
  body: string,
  createdAt: string
}

export type CreatePostInput = Omit<User, 'id' | 'createdAt'>
export type UpdatePostInput = Partial<Pick<Post, 'title' | 'body'>>
