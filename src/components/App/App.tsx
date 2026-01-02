import css from './App.module.css';

import SearchBar from '../SearchBar/SearchBar.tsx';
import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import MovieGrid from '../MovieGrid/MovieGrid.tsx';
import MovieModal from '../MovieModal/MovieModal.tsx';

import fetchMovies from '../../services/movieService.ts';
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

import { type Movie } from '../../types/movie.ts';

export default function App() {
  const [modal, setModal] = useState<Movie | null>(null);
  const [word, setWord] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['films', word, page],
    queryFn: () => fetchMovies(word, page),
    enabled: word !== '',
    placeholderData: keepPreviousData,
  });

  function onClickCard(movie: Movie): void {
    setModal(movie);
  }

  function closeModal() {
    setModal(null);
  }

  async function findFilms(query: string): Promise<void> {
    setWord(query);
    setPage(1);
  }

  const totalPages = data?.total_pages ?? 0;

  return (
    <>
      <SearchBar onSubmit={findFilms} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {data && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={onClickCard} />
      )}
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {modal && <MovieModal movie={modal} onClose={closeModal} />}
    </>
  );
}
