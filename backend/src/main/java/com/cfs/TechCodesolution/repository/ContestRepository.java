package com.cfs.TechCodesolution.repository;

import com.cfs.TechCodesolution.model.Contest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ContestRepository extends JpaRepository<Contest, Long> {
    @Query("SELECT c FROM Contest c JOIN c.questions q WHERE q.id = :questionId")
    List<Contest> findContestsByQuestionId(@Param("questionId") Long questionId);
}

