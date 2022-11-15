import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { makeFakeResponse, makeFakeRepo } from '../../__fixtures__/repositories';
import { handlerPaginated } from '../../__fixtures__/handlers';
import { STATUS_OK } from '../../constants/statusHttp';
import GithubSearchPage from './github-search-page';

const fakeResponse = makeFakeResponse({ totalCount: 1 })

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

        expect(screen.getByRole('cell', { name: /1-0/ })).toBeInTheDocument()

        expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled()

        fireEvent.click(screen.getByRole('button', { name: /next page/i }))

        expect(screen.getByRole('button', { name: /search/i })).toBeDisabled()

        await waitFor(
            () =>
                expect(
                    screen.getByRole('button', { name: /search/i }),
                ).not.toBeDisabled(),
            { timeout: 3000 },
        )

        expect(screen.getByRole('cell', { name: /2-0/ })).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: /previous page/i }))

        await waitFor(
            () =>
                expect(
                    screen.getByRole('button', { name: /search/i }),
                ).not.toBeDisabled(),
            { timeout: 3000 },
        )

        expect(screen.getByRole('cell', { name: /1-0/ })).toBeInTheDocument()
    }, 30000)
})
describe('when the developer dodes a search and clicks on next page button and selects 50 rows per page', () => {
    it('must display the results of the first page', async () => {
        server.use(rest.get('/search/repositories', handlerPaginated))

        fireClickSearch()

        expect(await screen.findByRole('table')).toBeInTheDocument()

        expect(screen.getByRole('cell', { name: /1-0/ })).toBeInTheDocument()

        expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled()

        fireEvent.click(screen.getByRole('button', { name: /next page/i }))

        expect(screen.getByRole('button', { name: /search/i })).toBeDisabled()

        await waitFor(
            () =>
                expect(
                    screen.getByRole('button', { name: /search/i }),
                ).not.toBeDisabled(),
            { timeout: 3000 },
        )

        expect(screen.getByRole('cell', { name: /2-0/ })).toBeInTheDocument()

        fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))
        fireEvent.click(screen.getByRole('option', { name: '50' }))
        await waitFor(() =>
            expect(screen.getByRole('button', { name: /search/i })).not.toBeDisabled(), { timeout: 3000 }
        )
        expect(screen.getByRole('cell', { name: /1-0/ })).toBeInTheDocument()
    }, 5000)
})
describe('when the developer odes a search and clicks on next page button and clicks on search again', () => {
    it('must display the results of the first page', async () => {
        server.use(rest.get('/search/repositories', handlerPaginated))

        fireClickSearch()

        expect(await screen.findByRole('table')).toBeInTheDocument()

        expect(screen.getByRole('cell', { name: /1-0/ })).toBeInTheDocument()

        expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled()

        fireEvent.click(screen.getByRole('button', { name: /next page/i }))

        expect(screen.getByRole('button', { name: /search/i })).toBeDisabled()

        await waitFor(
            () =>
                expect(
                    screen.getByRole('button', { name: /search/i }),
                ).not.toBeDisabled(),
            { timeout: 3000 },
        )

        expect(screen.getByRole('cell', { name: /2-0/ })).toBeInTheDocument()
        fireClickSearch();

        await waitFor(
            () =>
                expect(
                    screen.getByRole('button', { name: /search/i }),
                ).not.toBeDisabled(),
            { timeout: 3000 },
        )
        expect(screen.getByRole('cell', { name: /1-0/ })).toBeInTheDocument()
    }, 5000)
})
