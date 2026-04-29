import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ImageSlider } from './ImageSlider';

const images = [
  'https://example.com/img1.png',
  'https://example.com/img2.png',
  'https://example.com/img3.png',
];

describe('ImageSlider', () => {
  it('renders the placeholder icon when images array is empty', () => {
    const { container } = render(<ImageSlider images={[]} alt="product" />);
    expect(container.querySelector('.lucide-image')).toBeInTheDocument();
  });

  it('renders the first image on mount', () => {
    render(<ImageSlider images={images} alt="product" />);
    const img = screen.getByRole('img', { name: 'product 1' });
    expect(img).toHaveAttribute('src', images[0]);
  });

  it('does not render prev/next buttons for a single image', () => {
    render(<ImageSlider images={[images[0]]} alt="product" />);
    expect(
      screen.queryByRole('button', { name: /previous image/i }),
    ).toBeNull();
    expect(screen.queryByRole('button', { name: /next image/i })).toBeNull();
  });

  it('does not render dot indicators for a single image', () => {
    render(<ImageSlider images={[images[0]]} alt="product" />);
    expect(screen.queryByRole('button', { name: /go to image/i })).toBeNull();
  });

  it('renders prev/next buttons and dots for multiple images', () => {
    render(<ImageSlider images={images} alt="product" />);
    expect(
      screen.getByRole('button', { name: /previous image/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /next image/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /go to image/i }),
    ).toHaveLength(images.length);
  });

  it('advances to the next image when Next is clicked', () => {
    render(<ImageSlider images={images} alt="product" />);
    fireEvent.click(screen.getByRole('button', { name: /next image/i }));
    expect(screen.getByRole('img')).toHaveAttribute('src', images[1]);
  });

  it('goes back to the previous image when Prev is clicked', () => {
    render(<ImageSlider images={images} alt="product" />);
    fireEvent.click(screen.getByRole('button', { name: /next image/i }));
    fireEvent.click(screen.getByRole('button', { name: /previous image/i }));
    expect(screen.getByRole('img')).toHaveAttribute('src', images[0]);
  });

  it('wraps around from last to first on Next click', () => {
    render(<ImageSlider images={images} alt="product" />);
    const next = screen.getByRole('button', { name: /next image/i });
    fireEvent.click(next);
    fireEvent.click(next);
    fireEvent.click(next);
    expect(screen.getByRole('img')).toHaveAttribute('src', images[0]);
  });

  it('wraps around from first to last on Prev click', () => {
    render(<ImageSlider images={images} alt="product" />);
    fireEvent.click(screen.getByRole('button', { name: /previous image/i }));
    expect(screen.getByRole('img')).toHaveAttribute('src', images[2]);
  });

  it('jumps to the correct image when a dot is clicked', () => {
    render(<ImageSlider images={images} alt="product" />);
    fireEvent.click(screen.getByRole('button', { name: 'Go to image 3' }));
    expect(screen.getByRole('img')).toHaveAttribute('src', images[2]);
  });

  it('swipes to the next image on left swipe', () => {
    render(<ImageSlider images={images} alt="product" />);
    const container = screen
      .getByRole('img')
      .closest('[class*="relative"]') as HTMLElement;
    fireEvent.touchStart(container, {
      touches: [{ clientX: 200 }],
    });
    fireEvent.touchEnd(container, {
      changedTouches: [{ clientX: 100 }],
    });
    expect(screen.getByRole('img')).toHaveAttribute('src', images[1]);
  });

  it('swipes to the previous image on right swipe', () => {
    render(<ImageSlider images={images} alt="product" />);
    const container = screen
      .getByRole('img')
      .closest('[class*="relative"]') as HTMLElement;
    fireEvent.touchStart(container, { touches: [{ clientX: 100 }] });
    fireEvent.touchEnd(container, { changedTouches: [{ clientX: 200 }] });
    expect(screen.getByRole('img')).toHaveAttribute('src', images[2]);
  });

  it('ignores swipes shorter than 40px', () => {
    render(<ImageSlider images={images} alt="product" />);
    const container = screen
      .getByRole('img')
      .closest('[class*="relative"]') as HTMLElement;
    fireEvent.touchStart(container, { touches: [{ clientX: 100 }] });
    fireEvent.touchEnd(container, { changedTouches: [{ clientX: 90 }] });
    expect(screen.getByRole('img')).toHaveAttribute('src', images[0]);
  });
});
