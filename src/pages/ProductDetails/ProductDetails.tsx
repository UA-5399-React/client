import { useParams } from "@tanstack/react-router";

export const ProductDetails = () => {
  const { productId } = useParams({ from: "/product/$productId" });

  return (
    <div className="p-10 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Product Details</h1>
      <p>
        Viewing details for product ID:
        <span className="font-mono text-blue-600 ml-2">{productId}</span>
      </p>
    </div>
  );
};
