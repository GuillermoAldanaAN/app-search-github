import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {ErrorBoundary} from './error-boundary';

jest.spyOn(console, 'error');
const ThrowError = () => {
    throw new Error('Ha fallado');
}
describe('When the component works without errors', () => {
    it('must render the componet content', () => {
        render(
        <ErrorBoundary>
            <h1>Test pass</h1>
        </ErrorBoundary>
        )
        expect(screen.getByText(/test pass/i)).toBeInTheDocument();
    })
}) 
describe('When the component throws an error', () => {
    it('must render the message "there is an unexcepted error" and a reload button', () => {

        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
            )
        expect(screen.getByText(/there is an unexpected error/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /reload/i})).toBeInTheDocument()
    })
})
describe('When the user clicks on reload button', () => {
    it('must reload the app',() => {
        delete window.location
        window.location = {reload: jest.fn()}
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
            )
        fireEvent.click(screen.getByRole('button', {name: /reload/i}))
        expect(window.location.reload).toHaveBeenCalledTimes(1);
    })
})