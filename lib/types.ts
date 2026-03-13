
export interface Package {
  id: string;
  quantity: number;
  quantityLabel: string;
  price: number;
  description: string;
  deliveryTime: string;
  quality: string;
  /** SSM panel service ID for backend */
  ssmServiceId?: number;
  /** Best seller flag */
  isBestSeller?: boolean;
  /** Badge label e.g. "🎉 Holi Special" */
  badge?: string;
  /** Service category */
  serviceCategory?:
    | 'followers'
    | 'likes'
    | 'comments'
    | 'views'
    | 'story_views'
    | 'subscribers'
    | 'watchtime'
    | 'streams'
    | 'members'
    | 'subscription'
    | 'premium'
    | 'reactions';
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  isPrimary: boolean;
  bgGradient: string;
  /** Tailwind classes for primary accent (buttons, CTA) e.g. "bg-pink-500 hover:bg-pink-600" */
  accentColor: string;
  /** Tailwind text color class e.g. "text-pink-600" */
  accentText: string;
  /** Tailwind light bg for badges/pills e.g. "bg-pink-50" */
  accentBgLight: string;
  packages: Package[];
}

export interface Order {
  orderId: string;
  serviceId: string;
  serviceName: string;
  packageId: string;
  packageLabel: string;
  quantity: number;
  price: number;
  instagramProfile?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: number;
  date: string;
  /** Backend order ID (UUID) */
  backendOrderId?: string;
  /** ZapUPI payment URL */
  paymentUrl?: string;
}
