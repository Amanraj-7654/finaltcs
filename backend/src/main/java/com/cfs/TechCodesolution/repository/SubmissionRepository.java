package com.cfs.TechCodesolution.repository;

import com.cfs.TechCodesolution.model.Submission;
import com.cfs.TechCodesolution.model.User;
import com.cfs.TechCodesolution.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUser(User user);
    List<Submission> findByQuestion(Question question);
    List<Submission> findByQuestionIdOrderBySubmittedAtDesc(Long questionId);
    List<Submission> findByContestId(Long contestId);
    List<Submission> findByUserIdAndQuestionId(Long userId, Long questionId);
    long countByUserAndStatus(User user, String status);
}
