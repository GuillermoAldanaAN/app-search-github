import React from 'react';
import { render, screen} from '@testing-library/react';
import GithubSearchPage from './github-search-page';

describe('When the GithubSearchPage is mounted', () => {
    it('Must display the title' ,() => {
        render(<GithubSearchPage />)
        const caseHeading = screen.getByRole('heading',{name: /Github repositories list/i})
        expect(caseHeading).toBeInTheDocument()
    })
})