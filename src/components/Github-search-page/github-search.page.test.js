import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { makeFakeResponse, getReposListBy, makeFakeRepo, makeFakeError } from '../../__fixtures__/repositories';
import { handlerPaginated } from '../../__fixtures__/handlers';
import { STATUS_OK } from '../../constants/statusHttp';
import GithubSearchPage from './github-search-page';

const fakeResponse = makeFakeResponse({totalCount: 1})

const fakeRepo = makeFakeRepo()

fakeResponse.items = [fakeRepo]

const server = setupServer(
    rest.get('/search/repositories', (req, res, ctx) => {
        return res(
            ctx.status(STATUS_OK),
            ctx.json(fakeResponse),
        )
    }),
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())

afterAll(() => server.close())
beforeEach(() => render(<GithubSearchPage />))

const fireClickSearch = () => fireEvent.click(screen.getByRole('button', { name: /search/i }))

describe('When the GithubSearchPage is mounted', () => {

    it('Must display the title', () => {
        const caseHeading = screen.getByRole('heading', { name: /Github repositories list/i })
        expect(caseHeading).toBeInTheDocument()
    })
    it("Must be a input text with label 'filter by' field", () => {
        const caseLabelField = screen.getByLabelText(/filter by/i);
        expect(caseLabelField).toBeInTheDocument()
    })
    it("Must be a search button", () => {
        const caseButton = screen.getByRole('button', { name: /search/i })
        expect(caseButton).toBeInTheDocument();
    })
    it("Must be a initial message 'Please provide a search option and click in the search button'", () => {
        const caseInitialMessage = screen.getByText(/Please provide a search option and click in the search button/i);
        expect(caseInitialMessage).toBeInTheDocument();
    })

})

describe("When the developer does a search", () => {

    it("The search button should be disabled until the search is done", async () => {
        const caseButtonSearch = screen.getByRole('button', { name: /search/i })
        expect(caseButtonSearch).not.toBeDisabled();

        fireEvent.change(screen.getByLabelText(/filter by/i), { target: { value: 'test' } })
        expect(caseButtonSearch).not.toBeDisabled();

        fireClickSearch()
        expect(caseButtonSearch).toBeDisabled();
        await waitFor(() => {
            expect(caseButtonSearch).not.toBeDisabled();
        })

    })
    it('The data should be displayed as a sticky table', async () => {
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
    it(`Each table result  should have: owner avatar image, name, stars, updated at, forks, open issues,
        It should have a link that opens in a new tab the github`, async () => {
        fireClickSearch();
        const table = await screen.findByRole('table');
        const withInTable = within(table);
        const tableBody = withInTable.getAllByRole('cell')
        const [repository, stars, forks, openIssues, updatedAt] = tableBody;
        const avatarImage = within(repository).getByRole('img', { name: fakeRepo.name })
        expect(avatarImage).toBeInTheDocument();

        expect(tableBody).toHaveLength(5)

        expect(repository).toHaveTextContent(fakeRepo.name)
        expect(stars).toHaveTextContent(fakeRepo.stargazers_count)
        expect(forks).toHaveTextContent(fakeRepo.forks_count)
        expect(openIssues).toHaveTextContent(fakeRepo.open_issues_count)
        expect(updatedAt).toHaveTextContent(fakeRepo.updated_at)

        expect(withInTable.getByText(fakeRepo.name).closest('a')).toHaveAttribute(
            'href',
            fakeRepo.html_ur
        )
        expect(avatarImage).toHaveAttribute('src', fakeRepo.owner.avatar_url)
    })
    it('Must display total results number of the search and the current number of results', async () => {
        fireClickSearch()
        await screen.findByRole('table');
        expect(screen.getByText(/1–1 of 1/i)).toBeInTheDocument();
    })
    it(`A results size per page select/combobox with the options: 30, 50, 100. The default is 30.`, async () => {
        fireClickSearch();

        await screen.findByRole('table');
        const caseLabelPagination = screen.getByLabelText(/rows per page/i)

        fireEvent.mouseDown(caseLabelPagination)
        const listbox = screen.getByRole('listbox', { name: /rows per page/i })
        const options = within(listbox).getAllByRole('option')
        const [option30, option50, option100] = options;

        expect(caseLabelPagination).toBeInTheDocument();

        expect(option30).toHaveTextContent(/30/)
        expect(option50).toHaveTextContent(/50/)
        expect(option100).toHaveTextContent(/100/)
    })
    it('Must exists the Next and previous pagination button', async () => {
        fireClickSearch()
        await screen.findByRole('table');
        const previousPageButton = screen.getByRole('button', { name: /previous page/i })
        expect(previousPageButton).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
        expect(previousPageButton).toBeDisabled();
    })
})
describe('When the developer does a search without results', () => {
    it(`If there is no results, then show a empty state message “You search has no results”`, async () => {
        
        server.use(
            rest.get('/search/repositories', (req, res, ctx) =>
              res(ctx.status(STATUS_OK), ctx.json(makeFakeResponse({}))),
            ),
          )
      
          fireClickSearch()
      
          await waitFor(() =>
            expect(
              screen.getByText(/you search has no results/i),
            ).toBeInTheDocument(),
          )
      
          expect(screen.queryByRole('table')).not.toBeInTheDocument()
        })

})

describe('When the developer types on filter by and does a search', () => {

    it('Must display the related repos', async () => {
        const internalFakeResponse = makeFakeResponse();
        const REPO_NAME = 'laravel';

        const expectedRepo = getReposListBy({ name: REPO_NAME })[0];
        server.use(
            rest.get('/search/repositories', (req, res, ctx) =>
                res(
                    ctx.status(200), ctx.json({
                        ...internalFakeResponse,
                        items: getReposListBy({ name: req.url.searchParams.get('q') })
                    }),
                )
            ),
        )
        fireEvent.change(screen.getByLabelText(/filter by/i), { target: { value: 'laravel' } })
        fireClickSearch()
        const table = await screen.findByRole('table');
        expect(table).toBeInTheDocument()
        const withInTable = within(table);
        const tableBody = withInTable.getAllByRole('cell')
        const [repository] = tableBody;
        expect(repository).toHaveTextContent(expectedRepo.name)

    })
})
describe('When the developer does a search and selects 50 rows per page', () => {
    it('Must fetch a new search and display 50 rows results on the table', async () => {
        server.use(
            rest.get('/search/repositories', handlerPaginated
            ),
        )
        fireClickSearch()

        expect(await screen.findByRole('table')).toBeInTheDocument();
        expect(await screen.findAllByRole('row')).toHaveLength(31)
        fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))
        fireEvent.click(screen.getByRole('option', { name: '50' }))
        await waitFor(() =>
            expect(screen.getByRole('button', { name: /search/i })).not.toBeDisabled(), { timeout: 3000 }
        )
        expect(await screen.findAllByRole('row')).toHaveLength(51)

    })
})
describe('When the developer clicks on search and then on next page button', () => {

    it('Must display the next repositories page', async () => {
        server.use(
            rest.get('/search/repositories', handlerPaginated
            ),
        )
        fireClickSearch()

        expect(await screen.findByRole('table')).toBeInTheDocument();

        expect(screen.getByRole('cell', { name: /1-0/ })).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled();

        fireEvent.click(screen.getByRole('button', { name: /next page/i }))

        expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();

        await waitFor(() =>
            expect(screen.getByRole('button', { name: /search/i })).not.toBeDisabled(), { timeout: 3000 }
        )
        expect(screen.getByRole('cell', { name: /2-0/ })).toBeInTheDocument();

        
    })
    
})
describe('when the developer clicks on search and then on next page button and then on previous page button', () => {
    it('must display the previous repositories page', async () => {
      server.use(rest.get('/search/repositories', handlerPaginated))
  
      fireClickSearch()
  
      expect(await screen.findByRole('table')).toBeInTheDocument()
  
      expect(screen.getByRole('cell', {name: /1-0/})).toBeInTheDocument()
  
      expect(screen.getByRole('button', {name: /next page/i})).not.toBeDisabled()
  
      fireEvent.click(screen.getByRole('button', {name: /next page/i}))
  
      expect(screen.getByRole('button', {name: /search/i})).toBeDisabled()
  
      await waitFor(
        () =>
          expect(
            screen.getByRole('button', {name: /search/i}),
          ).not.toBeDisabled(),
        {timeout: 3000},
      )
  
      expect(screen.getByRole('cell', {name: /2-0/})).toBeInTheDocument()
  
      fireEvent.click(screen.getByRole('button', {name: /previous page/i}))
  
      await waitFor(
        () =>
          expect(
            screen.getByRole('button', {name: /search/i}),
          ).not.toBeDisabled(),
        {timeout: 3000},
      )
  
      expect(screen.getByRole('cell', {name: /1-0/})).toBeInTheDocument()
    }, 30000)
  })

describe('When there is an unexpected error from the backend', () => { 
    it('Must display an alert message error withe the message form the services', async () => {
        server.use(
            rest.get('/search/repositories', (req, res, ctx) =>
                res(
                    ctx.status(422), 
                    ctx.json(makeFakeError()),
                )
            ),
        )

        fireClickSearch();
        expect(await  screen.findByText(/Validation failed/)).toBeVisible();

    })
 })