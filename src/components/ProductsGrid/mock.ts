import type { Product } from '../../types';

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Loveseat Sofa',
    price: 399.99,
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80',
    status: 'active',
    tags: ['NEW'],
  },
  {
    id: '2',
    title: 'Luxury Sofa',
    price: 289.0,
    imageUrl:
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&q=80',
    status: 'active',
    tags: ['NEW'],
  },
  {
    id: '3',
    title: 'Table Lamp',
    price: 118.0,
    imageUrl:
      'https://www.ks-licht.de/images/product_images/popup_images/STE-3456ZW_1.jpg',
    status: 'active',
    tags: ['NEW'],
  },
  {
    id: '4',
    title: 'Cozy Sofa',
    price: 159.0,
    imageUrl:
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80',
    status: 'active',
    tags: ['NEW'],
  },
  {
    id: '5',
    title: 'White Drawer',
    price: 89.99,
    imageUrl:
      'https://laurajamesfurniture.com/cdn/shop/files/essie-8-chest-of-drawers-pure-white-laura-james-1_3245x.jpg?v=1722848553',
    status: 'active',
    tags: ['NEW', '-50%'],
  },
  {
    id: '6',
    title: 'Black Tray Table',
    price: 19.99,
    imageUrl:
      'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500&q=80',
    status: 'active',
    tags: ['NEW', '-50%'],
  },
  {
    id: '7',
    title: 'Wooden Lamp',
    price: 76.0,
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvGQ1j7KEPX3-wThM8eTjFHtfCaVeSqFMwCQ&s',
    status: 'active',
    tags: ['NEW', '-50%'],
  },
  {
    id: '8',
    title: 'Light Beige Pillow',
    price: 3.99,
    imageUrl:
      'https://www.chloeandolive.com/cdn/shop/products/Tay_Oyster_Beige_Solid_Linen_Decorative_Throw_Pillow_Cover_com_1600x.jpg?v=1625365428',
    status: 'active',
    tags: ['NEW', '-50%'],
  },
];

export { mockProducts };
