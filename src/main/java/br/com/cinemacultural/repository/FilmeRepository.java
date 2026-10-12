package br.com.cinemacultural.repository;

import br.com.cinemacultural.model.Filme;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FilmeRepository extends JpaRepository<Filme, Long> {
}
