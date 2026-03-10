import bannerImage from '../../assets/images/banner.png';

import styles from './ShopBanner.module.css';

export const ShopBanner = () => {
  return (
    <div className="relative mb-10 flex w-full flex-col items-center justify-center overflow-hidden py-24 md:py-32">
      <img
        src={bannerImage}
        alt="Shop Banner Background"
        className={`absolute inset-0 h-full w-full object-cover object-center ${styles.bannerImage}`}
      />
    </div>
  );
};
