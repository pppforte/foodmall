export interface PopupData {
  _id?: string;
  title: string;
  type: 'image' | 'youtube';
  imageUrl: string;
  youtubeUrl: string;
  top: number;
  left: number;
  width: number;
  height: number;
  linkUrl: string;
  linkTarget: '_self' | '_blank';
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface StoreData {
  _id?: string;
  name: string;
  region: string;
  address: string;
  jibunAddress: string;
  phone: string;
  latitude: number;
  longitude: number;
  businessHours: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface InquiryData {
  _id?: string;
  name: string;
  phone: string;
  hasStore: 'yes' | 'no';
  region: string;
  content: string;
  source: 'form' | 'sky';
  status: 'pending' | 'confirmed' | 'completed';
  privacyAgreed: boolean;
  emailSent: boolean;
  ipAddress: string;
  createdAt?: Date | string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface NoticeData {
  _id?: string;
  title: string;
  content: string;
  thumbnailUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface BlogPostData {
  _id?: string;
  title: string;
  description: string;
  link: string;
  bloggerName: string;
  source: 'naver' | 'manual';
  isActive: boolean;
  publishedAt: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
