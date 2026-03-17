import {
  Banknote,
  Lock,
  type LucideIcon,
  PhoneCall,
  Truck,
} from 'lucide-react';

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}
const featuresData: FeatureItem[] = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Order above $200',
  },
  {
    icon: Banknote,
    title: 'Money-back',
    description: '30 days guarantee',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'Secured by Stripe',
  },
  {
    icon: PhoneCall,
    title: '24/7 Support',
    description: 'Phone and Email support',
  },
];

export const Features: React.FC = () => {
  return (
    <section className="px-4 py-8 lg:px-16">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-6">
        {featuresData.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-start gap-3 bg-gray-100 px-4 py-6 md:gap-4 md:px-8 md:py-12"
            >
              <Icon
                className="h-8 w-8 text-neutral-900 md:h-10 md:w-10"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <div>
                <h3 className="m-0 text-base leading-7 font-medium text-neutral-900 md:text-[20px]">
                  {feature.title}
                </h3>
                <p className="m-0 mt-1 text-xs leading-5 font-normal text-neutral-500 md:text-sm md:leading-6">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
