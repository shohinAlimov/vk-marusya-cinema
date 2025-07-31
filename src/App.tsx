import { Suspense, lazy } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./ui/Layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoriteContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Loader from "./ui/Loader/Loader";

// Ленивая загрузка страниц - они загрузятся только когда понадобятся
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const GenresPage = lazy(() => import("./pages/GenresPage/GenresPage"));
const MoviePage = lazy(() => import("./pages/MoviePage/MoviePage"));
const AccountPage = lazy(() => import("./pages/AccountPage/AccountPage"));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          {/* Используем HashRouter для GitHub Pages */}
          <Router>
            <Layout>
              {/* Suspense оборачивает Routes для ленивой загрузки */}
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/movie/:id" element={<MoviePage />} />
                  <Route path="/genres" element={<GenresPage />} />
                  <Route path="/account" element={<AccountPage />} />

                  {/* Добавляем обработку 404 */}
                  <Route
                    path="*"
                    element={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "60vh",
                          flexDirection: "column",
                          gap: "1rem",
                          textAlign: "center",
                        }}
                      >
                        <h2>Страница не найдена</h2>
                        <p style={{ color: "#666" }}>
                          Возможно, вы перешли по неверной ссылке
                        </p>
                        <a
                          href="#/"
                          style={{
                            color: "#007bff",
                            textDecoration: "none",
                            padding: "0.5rem 1rem",
                            border: "1px solid #007bff",
                            borderRadius: "4px",
                          }}
                        >
                          На главную
                        </a>
                      </div>
                    }
                  />
                </Routes>
              </Suspense>
            </Layout>
          </Router>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
