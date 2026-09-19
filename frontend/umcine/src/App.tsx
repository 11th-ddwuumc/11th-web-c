import MovieListPage from "./pages/movie-list-page.tsx";
import Header from "./components/header/header.tsx";
import Footer from "./components/footer/footer.tsx";

export default function App() {
  return (
    <>
      <Header/>
      <MovieListPage/>
      <Footer/>
    </>
  );
}