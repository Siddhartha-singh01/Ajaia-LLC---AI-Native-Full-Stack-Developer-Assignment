export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface Document {
  id: string
  title: string
  content: string
  ownerId: string
  owner: User
  createdAt: string
  updatedAt: string
}

export interface Share {
  id: string
  documentId: string
  userId: string
  grantedAt: string
}

export interface DocumentWithShared extends Document {
  sharedAt?: string
}
