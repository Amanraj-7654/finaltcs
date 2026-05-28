package com.cfs.TechCodesolution.controller;

import com.cfs.TechCodesolution.dto.QuestionPublicDTO;
import com.cfs.TechCodesolution.model.Question;
import com.cfs.TechCodesolution.model.Contest;
import com.cfs.TechCodesolution.model.TestCase;
import com.cfs.TechCodesolution.model.Submission;
import com.cfs.TechCodesolution.repository.QuestionRepository;
import com.cfs.TechCodesolution.repository.ContestRepository;
import com.cfs.TechCodesolution.repository.TestCaseRepository;
import com.cfs.TechCodesolution.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    TestCaseRepository testCaseRepository;

    @Autowired
    SubmissionRepository submissionRepository;

    @Autowired
    ContestRepository contestRepository;

    /** PUBLIC: returns all questions without hidden test cases */
    @GetMapping
    public List<QuestionPublicDTO> getAllQuestions() {
        return questionRepository.findAll()
                .stream()
                .map(QuestionPublicDTO::from)
                .collect(Collectors.toList());
    }

    /** PUBLIC: returns single question without hidden test cases */
    @GetMapping("/{id}")
    public ResponseEntity<QuestionPublicDTO> getQuestionById(@PathVariable Long id) {
        return questionRepository.findById(id)
                .map(QuestionPublicDTO::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** ADMIN ONLY: returns full question including hiddenTestCases */
    @GetMapping("/{id}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Question> getQuestionByIdAdmin(@PathVariable Long id) {
        return questionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public QuestionPublicDTO createQuestion(@RequestBody Question question) {
        return QuestionPublicDTO.from(questionRepository.save(question));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionPublicDTO> updateQuestion(@PathVariable Long id, @RequestBody Question questionDetails) {
        return questionRepository.findById(id)
                .map(question -> {
                    question.setTitle(questionDetails.getTitle());
                    question.setDescription(questionDetails.getDescription());
                    question.setDifficulty(questionDetails.getDifficulty());
                    question.setType(questionDetails.getType());
                    question.setTestCases(questionDetails.getTestCases());
                    question.setHiddenTestCases(questionDetails.getHiddenTestCases());
                    question.setConstraints(questionDetails.getConstraints());
                    question.setInputFormat(questionDetails.getInputFormat());
                    question.setOutputFormat(questionDetails.getOutputFormat());
                    question.setTimeLimit(questionDetails.getTimeLimit());
                    question.setMemoryLimit(questionDetails.getMemoryLimit());
                    question.setTags(questionDetails.getTags());
                    question.setBoilerplates(questionDetails.getBoilerplates());
                    question.setDriverCode(questionDetails.getDriverCode());
                    question.setLink(questionDetails.getLink());
                    return ResponseEntity.ok(QuestionPublicDTO.from(questionRepository.save(question)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        return questionRepository.findById(id)
                .map(question -> {
                    // 1. Disassociate from all contests
                    List<Contest> contests = contestRepository.findContestsByQuestionId(id);
                    for (Contest contest : contests) {
                        contest.getQuestions().remove(question);
                        contestRepository.save(contest);
                    }

                    // 2. Delete all test cases associated with this question
                    List<TestCase> testCases = testCaseRepository.findByQuestionId(id);
                    testCaseRepository.deleteAll(testCases);

                    // 3. Delete all submissions associated with this question
                    List<Submission> submissions = submissionRepository.findByQuestion(question);
                    submissionRepository.deleteAll(submissions);

                    // 4. Delete the question itself
                    questionRepository.delete(question);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<QuestionPublicDTO> searchQuestions(@RequestParam String query) {
        return questionRepository.findByTitleContainingIgnoreCase(query)
                .stream().map(QuestionPublicDTO::from).collect(Collectors.toList());
    }

    @GetMapping("/filter")
    public List<QuestionPublicDTO> filterQuestions(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String type) {
        List<Question> result;
        if (difficulty != null && type != null) {
            result = questionRepository.findByDifficultyAndType(difficulty, type);
        } else if (difficulty != null) {
            result = questionRepository.findByDifficulty(difficulty);
        } else if (type != null) {
            result = questionRepository.findByType(type);
        } else {
            result = questionRepository.findAll();
        }
        return result.stream().map(QuestionPublicDTO::from).collect(Collectors.toList());
    }
}
