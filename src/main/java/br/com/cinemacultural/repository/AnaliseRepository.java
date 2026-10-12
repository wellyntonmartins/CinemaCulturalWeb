package br.com.cinemacultural.repository;

import br.com.cinemacultural.model.Analise;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnaliseRepository extends JpaRepository<Analise, Long> {

    List<Analise> findByFilme_Id(Long filmeId);

    void deleteByFilme_Id(Long filmeId);
}
