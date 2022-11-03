import React from 'react';
import { fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import GithubSearchPage from './github-search-page';

beforeEach(()=> render(<GithubSearchPage />))

describe('When the GithubSearchPage is mounted', () => {
  
    it('Must display the title' ,() => {
        const caseHeading = screen.getByRole('heading',{name: /Github repositories list/i})
        expect(caseHeading).toBeInTheDocument()
    })
    it("Must be a input text with label 'filter by' field", () => {
        const caseLabelField = screen.getByLabelText(/filter by/i);
        expect(caseLabelField).toBeInTheDocument()
    })
    it("Must be a search button", () => {
        const caseButton = screen.getByRole('button', {name: /search/i})
        expect(caseButton).toBeInTheDocument();
    })
    it("Must be a initial message 'Please provide a search option and click in the search button'", () => {
        const caseInitialMessage = screen.getByText(/Please provide a search option and click in the search button/i);
        expect(caseInitialMessage).toBeInTheDocument();
    })
    
})

describe("When the developer does a search", () => {
    const fireClickSearch = () => fireEvent.click(screen.getByRole('button', {name: /search/i}))
    it("The search button should be disabled until the search is done",async () =>{
        const caseButtonSearch = screen.getByRole('button', {name: /search/i})
        expect(caseButtonSearch).not.toBeDisabled();

        fireClickSearch()
        expect(caseButtonSearch).toBeDisabled();
        await waitFor(()=> {
            expect(caseButtonSearch).not.toBeDisabled();
        })

    })
    it('The data should be displayed as a sticky table',async () => {
        fireClickSearch()

        await waitFor(() => {
            expect(screen.queryByText(/Please provide a search option and click in the search button/i)).not.toBeInTheDocument();
        })
        expect(screen.getByRole('table')).toBeInTheDocument()
    })
    it('The header table should contain: Repository, stars, forks, open issues and updated at', async () => {
        fireClickSearch()
        const table = await screen.findByRole('table')
        const tableHeaders = within(table).getAllByRole('columnheader')
        const [repository, stars, forks, openIssues, updatedAt] = tableHeaders;

        expect(tableHeaders).toHaveLength(5);

        expect(repository).toHaveTextContent(/repository/i)
        expect(stars).toHaveTextContent(/stars/i)
        expect(forks).toHaveTextContent(/forks/i)
        expect(openIssues).toHaveTextContent(/open issues/i)
        expect(updatedAt).toHaveTextContent(/updated at/i)
    })
})