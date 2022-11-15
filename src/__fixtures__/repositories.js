import repos30Paginated from './repos-30-paginated.json';
import repos50Paginated from './repos-50-paginated.json';

export const makeFakeResponse = ({ totalCount = 0 } = {}) => (
  {
    total_count: totalCount,
    items: []
  }
)
export const makeFakeError = ({ message = 'Validation Failed'} = {}) => ({
  message,
})
export const makeFakeRepo = ({
  name = 'Codecademy-UI-clone',
  id = '318064617',
} = {}) => ({
  id,
  name,
  owner: {
    avatar_url: 'https://avatars.githubusercontent.com/u/10425073?v=4',
  },
  html_ur: "https://github.com/shanoysinc/Codecademy-UI-clone",
  updated_at: "2022-10-14",
  stargazers_count: 23,
  forks_count: 9,
  open_issues_count: 0,
})

const reposData = ['go', 'freeCodeCamp', 'laravel', 'Python', 'Java'];

const reposList = reposData.map(name => makeFakeRepo({ name, id: name }));

export const getReposListBy = ({ name }) => reposList.filter(repo => repo.name === name);

export const getReposPerPage = ({ currentPage, perPage }) => {

  return perPage === 30
    ? repos30Paginated[currentPage]
    : repos50Paginated[currentPage]
}