import { render, screen } from '@testing-library/react';
import App from './App';

test('renders landing page hero', () => {
  render(<App />);
  expect(
    screen.getByText(/Turn long videos into clickable chapters/i)
  ).toBeInTheDocument();
});
