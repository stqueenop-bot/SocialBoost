import { getServiceBySlug, getAllServices } from '@/lib/services-data';
import ServicePageClient from './ServicePageClient';
import { Metadata } from 'next';
import Schema from '@/components/Schema';

interface Props {
  params: Promise<{ serviceName: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const serviceName = (await params).serviceName;
  const service = getServiceBySlug(serviceName);
  if (service == undefined) {
    return {
      title: 'Service Not Found - Fastxera',
    };
  }

  const title = `Buy ${service.name} ${service.packages[0]?.serviceCategory || 'Services'} - Fastxera`;
  const description = `Get high-quality ${service.name} ${service.description.toLowerCase()} with fast delivery and best prices. 100% safe and secure services from Fastxera.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${service.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://fastxera.com/${service.slug}`,
      siteName: 'Fastxera',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const serviceName = (await params).serviceName;
  const service = getServiceBySlug(serviceName);
  const allServices = getAllServices();
  const otherServices = allServices.filter((s) => s.slug !== serviceName);

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-400 mb-4">Service not found</p>
          <a href="/" className="text-indigo-600 hover:text-indigo-700 font-semibold">← Go back to home</a>
        </div>
      </div>
    );
  }

  // Product Structured Data
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${service.name} Growth Services`,
    description: service.description,
    brand: {
      '@type': 'Brand',
      name: 'Fastxera',
    },
    offers: {
      '@type': 'AggregateOffer',
      offerCount: service.packages.length,
      lowPrice: Math.min(...service.packages.map(p => p.price)),
      highPrice: Math.max(...service.packages.map(p => p.price)),
      priceCurrency: 'INR',
    },
  };

  return (
    <>
      <Schema data={productSchema} />
      <ServicePageClient service={service} otherServices={otherServices} />
    </>
  );
}
