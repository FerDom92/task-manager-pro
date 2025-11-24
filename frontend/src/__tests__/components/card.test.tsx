import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

describe('Card', () => {
  it('renders card with content', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content')).toHaveAttribute('data-slot', 'card');
  });

  it('applies custom className', () => {
    render(<Card className="custom-class">Content</Card>);
    expect(screen.getByText('Content')).toHaveClass('custom-class');
  });
});

describe('CardHeader', () => {
  it('renders header content', () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText('Header')).toHaveAttribute('data-slot', 'card-header');
  });
});

describe('CardTitle', () => {
  it('renders title text', () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText('Title')).toHaveAttribute('data-slot', 'card-title');
  });

  it('has font-semibold class', () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText('Title')).toHaveClass('font-semibold');
  });
});

describe('CardDescription', () => {
  it('renders description text', () => {
    render(<CardDescription>Description</CardDescription>);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardDescription>Description</CardDescription>);
    expect(screen.getByText('Description')).toHaveAttribute(
      'data-slot',
      'card-description'
    );
  });

  it('has muted text color', () => {
    render(<CardDescription>Description</CardDescription>);
    expect(screen.getByText('Description')).toHaveClass('text-muted-foreground');
  });
});

describe('CardContent', () => {
  it('renders content', () => {
    render(<CardContent>Content</CardContent>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardContent>Content</CardContent>);
    expect(screen.getByText('Content')).toHaveAttribute('data-slot', 'card-content');
  });
});

describe('CardFooter', () => {
  it('renders footer content', () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText('Footer')).toHaveAttribute('data-slot', 'card-footer');
  });
});

describe('Card composition', () => {
  it('renders full card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });
});
