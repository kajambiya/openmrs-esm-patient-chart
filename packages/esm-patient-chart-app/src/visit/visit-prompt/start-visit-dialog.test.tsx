import React from 'react';
import StartVisitDialog from './start-visit-dialog.component';
import { render, screen } from '@testing-library/react';
import * as mockUseVisitDialog from '../useVisitDialog';
import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import userEvent from '@testing-library/user-event';

jest.mock('@openmrs/esm-patient-common-lib', () => {
  const originalModule = jest.requireActual('@openmrs/esm-patient-common-lib');

  return {
    ...originalModule,
    launchPatientWorkspace: jest.fn(),
  };
});

describe('StartVisit', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should launch start visit form', () => {
    spyOn(mockUseVisitDialog, 'useVisitDialog').and.returnValue({ type: 'prompt' });
    render(<StartVisitDialog patientUuid="some-uuid" />);

    expect(
      screen.getByText(
        `You can't add data to the patient chart without an active visit. Choose from one of the options below to continue.`,
      ),
    ).toBeInTheDocument();

    const startNewVisitButton = screen.getByRole('button', { name: /Start new visit/i });
    userEvent.click(startNewVisitButton);

    expect(launchPatientWorkspace).toHaveBeenCalledWith('start-visit-workspace-form');
  });

  test('should launch edit past visit form', () => {
    spyOn(mockUseVisitDialog, 'useVisitDialog').and.returnValue({ type: 'prompt', state: { type: 'past' } });
    render(<StartVisitDialog patientUuid="some-uuid" />);

    expect(
      screen.getByText(
        `You can add a new past visit or update an old one. Choose from one of the options below to continue.`,
      ),
    ).toBeInTheDocument();

    const editPastVisitButton = screen.getByRole('button', { name: /Edit past visit/i });
    userEvent.click(editPastVisitButton);

    expect(launchPatientWorkspace).toHaveBeenCalledWith('past-visits-overview');
  });
});
