import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EngineerCard, type EngineerCardProps } from './EngineerCard';

describe('EngineerCard Component', () => {
  const defaultProps: EngineerCardProps = {
    name: 'John Doe',
    email: '',
    linkedin: '',
    photoUrl: '',
    github: '',
  };

  it('should render the engineer name', () => {
    render(<EngineerCard {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  describe('Avatar rendering', () => {
    it('should render the first letter of the name if photoUrl is not provided', () => {
      render(<EngineerCard {...defaultProps} />);

      expect(screen.getByText('J')).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('should render the image if photoUrl is provided', () => {
      const propsWithPhoto = {
        ...defaultProps,
        photoUrl: 'https://example.com/photo.jpg',
      };

      render(<EngineerCard {...propsWithPhoto} />);

      const image = screen.getByRole('img', { name: 'John Doe' });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/photo.jpg');

      expect(screen.queryByText('J')).not.toBeInTheDocument();
    });
  });

  describe('Social links rendering', () => {
    it('should not render icons if links are not provided', () => {
      render(<EngineerCard {...defaultProps} />);

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('should render email link with correct href', () => {
      render(<EngineerCard {...defaultProps} email="john@example.com" />);

      const emailLink = screen.getByRole('link', { name: 'Email John Doe' });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', 'mailto:john@example.com');
    });

    it('should render LinkedIn link with correct attributes', () => {
      render(
        <EngineerCard
          {...defaultProps}
          linkedin="https://linkedin.com/in/johndoe"
        />,
      );

      const linkedinLink = screen.getByRole('link', {
        name: 'John Doe on LinkedIn',
      });
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute(
        'href',
        'https://linkedin.com/in/johndoe',
      );
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render GitHub link with correct attributes', () => {
      render(
        <EngineerCard {...defaultProps} github="https://github.com/johndoe" />,
      );

      const githubLink = screen.getByRole('link', {
        name: 'John Doe on GitHub',
      });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com/johndoe');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render all links together if all data is provided', () => {
      render(
        <EngineerCard
          {...defaultProps}
          email="john@example.com"
          linkedin="https://linkedin.com"
          github="https://github.com"
        />,
      );

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3);
    });
  });
});
