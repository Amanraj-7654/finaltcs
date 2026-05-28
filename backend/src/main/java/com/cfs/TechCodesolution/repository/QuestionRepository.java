package com.cfs.TechCodesolution.repository;

import com.cfs.TechCodesolution.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByDifficulty(String difficulty);
    List<Question> findByType(String type);
    List<Question> findByDifficultyAndType(String difficulty, String type);
    List<Question> findByTitleContainingIgnoreCase(String title);
}
