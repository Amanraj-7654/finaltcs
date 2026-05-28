import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './Home';

// Mock the AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ isAdmin: false })
}));

// Mock the API calls
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn(),
    delete: vi.fn(),
  }
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => {
  return {
    motion: {
      h1: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
      p: ({ children, className }: any) => <p className={className}>{children}</p>,
    }
  };
});

describe('Home Component', () => {
  it('renders the hero section correctly', () => {
    render(<Home />);
    
    // Check if main title is present
    expect(screen.getByText(/Master the Art of/i)).toBeInTheDocument();
    expect(screen.getByText(/Coding/i)).toBeInTheDocument();
    
    // Check if features grid is present
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Practice')).toBeInTheDocument();
    expect(screen.getByText('Compete')).toBeInTheDocument();
  });
});
