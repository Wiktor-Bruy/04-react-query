import axios from 'axios';
import { type Movie } from '../types/movie.ts';

interface Answer {
  data: MovArr;
  Status: number;
  StatusText: string;
}

interface MovArr {
  results: Movie[];
  page: number;
  total_pages: number;
}

export default async function fetchMovies(
  query: string,
  page: number
): Promise<MovArr> {
  const token: string = import.meta.env.VITE_TMDB_TOKEN;

  const res: Answer = await axios.get(
    `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // if (res.data.results) {
  //   return res.data;
  // }
  // return [];

  return res.data;
}
