package com.cfs.TechCodesolution.repository;

import com.cfs.TechCodesolution.model.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByQuestionIdAndHidden(Long questionId, boolean hidden);
    List<TestCase> findByQuestionId(Long questionId);
}
