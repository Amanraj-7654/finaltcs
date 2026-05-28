package com.cfs.TechCodesolution.service;

import com.cfs.TechCodesolution.dto.TestCaseDTO;
import com.cfs.TechCodesolution.model.Question;
import com.cfs.TechCodesolution.model.TestCase;
import com.cfs.TechCodesolution.repository.QuestionRepository;
import com.cfs.TechCodesolution.repository.TestCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TestCaseService {

    @Autowired
    private TestCaseRepository testCaseRepository;

    @Autowired
    private QuestionRepository questionRepository;

    /** Add a new test case (admin only). */
    public TestCase addTestCase(Long questionId, TestCaseDTO dto) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found: " + questionId));

        TestCase tc = new TestCase();
        tc.setQuestion(question);
        tc.setInput(dto.getInput());
        tc.setExpectedOutput(dto.getExpectedOutput());
        tc.setHidden(dto.getIsHidden() != null && dto.getIsHidden());
        tc.setExplanation(dto.getExplanation());
        return testCaseRepository.save(tc);
    }

    /** Return only the public (visible) test cases for a question. */
    public List<TestCase> getPublicTestCases(Long questionId) {
        return testCaseRepository.findByQuestionIdAndHidden(questionId, false);
    }

    /** Return hidden test cases — for internal use by submission pipeline ONLY. */
    public List<TestCase> getHiddenTestCases(Long questionId) {
        return testCaseRepository.findByQuestionIdAndHidden(questionId, true);
    }

    /** Return ALL test cases — admin use only. */
    public List<TestCase> getAllTestCases(Long questionId) {
        return testCaseRepository.findByQuestionId(questionId);
    }

    /** Delete a specific test case. */
    @Transactional
    public void deleteTestCase(Long testCaseId) {
        testCaseRepository.deleteById(testCaseId);
    }
}
