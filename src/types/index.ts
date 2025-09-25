export interface User {
  id: string;
  email: string;
  name: string;
  role: 'author' | 'super_admin';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  readingTime: number;
  views: number;
  featured: boolean;
}

export interface Issue {
  id: string;
  title: string;
  month: number;
  year: number;
  coverImage: string;
  description: string;
  articles: string[]; // article IDs
  pdfUrl?: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
  };
}

export interface UploadLog {
  id: string;
  fileName: string;
  fileType: 'article' | 'issue' | 'image' | 'pdf';
  fileUrl: string;
  uploadedBy: {
    id: string;
    name: string;
    role: string;
  };
  uploadedAt: Date;
  fileSize: number;
  status: 'success' | 'failed';
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  logo: string;
  isMaintenanceMode: boolean;
  allowRegistration: boolean;
  updatedBy: {
    id: string;
    name: string;
  };
  updatedAt: Date;
}