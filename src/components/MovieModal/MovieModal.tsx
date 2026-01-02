import css from './MovieModal.module.css';

import { createPortal } from 'react-dom';
import React, { useEffect } from 'react';

import { type Movie } from '../../types/movie.ts';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  function clickBackdrop(ev: React.MouseEvent) {
    if (ev.target != ev.currentTarget) {
      return;
    }
    onClose();
  }
  useEffect(() => {
    function closeModal(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', closeModal);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', closeModal);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (movie === null) {
    return;
  }

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={clickBackdrop}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
          alt={movie.title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong>
            {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong>
            {movie.vote_average}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
