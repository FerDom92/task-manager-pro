import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('accepts and displays value', () => {
    render(<Input defaultValue="test value" />);
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('handles onChange events', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('has data-slot attribute', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'input');
  });
});
