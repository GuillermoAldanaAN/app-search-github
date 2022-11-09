const baseUrl = process.env.NODE_ENV === 'test' ? '' : process.env.REACT_APP_BASE_URL;

export const getAllRepositories =  ({q , rowsPerPage, currentPage}) => {

    return fetch(`${baseUrl}/search/repositories?q=${q}&page=${currentPage}&per_page=${rowsPerPage}`)
}
