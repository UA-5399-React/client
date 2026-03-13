import bannerImage from '../../assets/images/banner_3.png'; //banner.png, banner_shop_main.jpg

import styles from './ShopBanner.module.css';

export const ShopBanner = () => {
  return (
    <div className="relative mb-10 flex w-full flex-col items-center justify-center overflow-hidden">
      <img
        src={bannerImage}
        alt="Shop Banner Background"
        className={`block h-auto w-full ${styles.bannerImage}`}
      />
    </div>
  );
};
