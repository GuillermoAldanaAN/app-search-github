import React from "react";
import GithubSearchPage from "./components/Github-search-page/";
import ErrorBoundary from "./components/Error-boundary";
function App() {
  return (
    <div>
      <ErrorBoundary>
        <GithubSearchPage />
      </ErrorBoundary>
     
    </div>
  );
}

export default App;
