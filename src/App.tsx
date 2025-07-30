import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './ui/Layout/Layout'
import HomePage from './pages/HomePage/HomePage'
import GenresPage from './pages/GenresPage/GenresPage'
import { MoviePage } from './pages/MoviePage/MoviePage';
import AccountPage from './pages/AccountPage/AccountPage';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoriteContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movie/:id" element={<MoviePage />} />
                <Route path="/genres" element={<GenresPage />} />
                <Route path="/account" element={<AccountPage />} />
              </Routes>
            </Layout>
          </Router>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App