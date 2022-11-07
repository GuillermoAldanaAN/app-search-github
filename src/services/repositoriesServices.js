const baseUrl = process.env.NODE_ENV === 'test' ? '' : process.env.REACT_APP_BASE_URL;

export const getAllRepositories =  (q) => {
    return fetch(`${baseUrl}/search/repositories?q=${q}&page=2&per_page=50`);
}
