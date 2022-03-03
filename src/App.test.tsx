import { render, screen } from '@testing-library/react';
import React from 'react';

import AppWrapper from './AppWrapper';

test('renders learn react link', () => {
  render(<AppWrapper />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
