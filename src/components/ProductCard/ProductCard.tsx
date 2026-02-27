import type { Product } from '../../types';
import { Button } from '../Button/Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { title, description, price, imageUrl, status, tags = [] } = product;

  return (
    <div>
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
      <span>{status}</span>
      <div>
        {tags.length > 0 && (
          <div>
            {tags.map((tag, index) => (
              <span key={`${tag}-${index}`}>
                {tag}
                {index < tags.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        )}
      </div>
      {description && <p>{description}</p>}
      <span>{price} ₴</span>
      <Button variant="primary">Add to Cart</Button>
    </div>
  );
};
