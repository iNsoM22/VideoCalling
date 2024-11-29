import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MeetingTypeList from '../MeetingTypeList';

describe('MeetingTypeList', () => {
  test('renders the component', () => {
    render(<MeetingTypeList />);
    expect(screen.getByText('New Meeting')).toBeInTheDocument();
    expect(screen.getByText('Join Meeting')).toBeInTheDocument();
    expect(screen.getByText('Schedule Meeting')).toBeInTheDocument();
    expect(screen.getByText('View Recordings')).toBeInTheDocument();
  });

  test('handles click events', () => {
    render(<MeetingTypeList />);
    fireEvent.click(screen.getByText('New Meeting'));
    expect(screen.getByText('Create Meeting')).toBeInTheDocument();
  });
});