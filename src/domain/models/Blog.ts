import { BaseEntity, Image, BlogCategory } from '../../shared/types';

export interface BlogAuthor {
  id: string;
  name: string;
  bio: string;
  avatar: Image;
  socialLinks: Record<string, string>;
}

export interface BlogPost extends BaseEntity {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  heroImage: Image;
  gallery?: Image[];
  author: BlogAuthor;
  publishedAt: string;
  featured: boolean;
  readTime: number;
  viewCount: number;
  relatedPosts?: string[];
}

export interface BlogSummary extends Pick<BlogPost,
  'id' | 'title' | 'slug' | 'excerpt' | 'category' | 'heroImage' |
  'author' | 'publishedAt' | 'featured' | 'readTime' | 'tags'
> {}