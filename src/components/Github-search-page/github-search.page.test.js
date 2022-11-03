import React from 'react';
import { render, screen} from '@testing-library/react';
import GithubSearchPage from './github-search-page';

describe('When the GithubSearchPage is mounted', () => {
    beforeEach(()=> render(<GithubSearchPage />))

    it('Must display the title' ,() => {
        const caseHeading = screen.getByRole('heading',{name: /Github repositories list/i})
        expect(caseHeading).toBeInTheDocument()
    })
    it("Must be a input text with label 'filter by' field", () => {
        const caseLabelField = screen.getByLabelText(/filter by/i);
        expect(caseLabelField).toBeInTheDocument()
    })
})
