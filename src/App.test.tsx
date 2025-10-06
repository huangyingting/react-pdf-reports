import { render, screen } from '@testing-library/react';
import App from './App';

test('renders healthcare document generator', () => {
  render(<App />);
  const headerElement = screen.getByText(/HealthCare Document Generator/i);
  expect(headerElement).toBeInTheDocument();
});
