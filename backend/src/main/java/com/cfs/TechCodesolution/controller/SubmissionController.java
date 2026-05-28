package com.cfs.TechCodesolution.controller;

import com.cfs.TechCodesolution.dto.VerdictResult;
import com.cfs.TechCodesolution.model.Question;
import com.cfs.TechCodesolution.model.Submission;
import com.cfs.TechCodesolution.model.TestCase;
import com.cfs.TechCodesolution.model.User;
import com.cfs.TechCodesolution.repository.QuestionRepository;
import com.cfs.TechCodesolution.repository.SubmissionRepository;
import com.cfs.TechCodesolution.repository.UserRepository;
import com.cfs.TechCodesolution.service.CodeExecutionService;
import com.cfs.TechCodesolution.service.TestCaseService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired SubmissionRepository submissionRepository;
    @Autowired UserRepository userRepository;
    @Autowired QuestionRepository questionRepository;
    @Autowired CodeExecutionService codeExecutionService;
    @Autowired TestCaseService testCaseService;

    /** Run code against custom stdin — does NOT save a submission */
    @PostMapping("/run")
    public ResponseEntity<?> runCode(@RequestBody Map<String, Object> request) {
        String code = (String) request.get("code");
        Object langIdObj = request.get("languageId");
        int languageId = langIdObj instanceof Number ? ((Number) langIdObj).intValue() : 0;
        String stdin = (String) request.getOrDefault("stdin", "");
        
        Long questionId = null;
        if (request.containsKey("questionId") && request.get("questionId") != null) {
            try {
                questionId = Long.valueOf(request.get("questionId").toString());
            } catch (Exception e) {}
        }

        JsonNode result = codeExecutionService.execute(code, languageId, stdin, questionId);
        return ResponseEntity.ok(result);
    }

    /**
     * Submit code — runs against ALL test cases (visible + hidden).
     * Saves submission with full verdict. Returns VerdictResult.
     */
    @PostMapping("/submit/{questionId}")
    public ResponseEntity<?> submitCode(
            @PathVariable Long questionId,
            @RequestBody Map<String, Object> request) {
        try {
            String code = (String) request.get("code");
            Object langIdObj = request.get("languageId");
            int languageId = langIdObj instanceof Number ? ((Number) langIdObj).intValue() : 0;
            
            Long contestId = request.containsKey("contestId") && request.get("contestId") != null
                    ? Long.parseLong(request.get("contestId").toString()) : null;

            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));
            Question question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new RuntimeException("Question not found: " + questionId));

            // Gather ALL test cases (public + hidden)
            List<TestCase> publicTc = testCaseService.getPublicTestCases(questionId);
            List<TestCase> hiddenTc = testCaseService.getHiddenTestCases(questionId);
            List<TestCase> allTc = new ArrayList<>();
            allTc.addAll(publicTc);
            allTc.addAll(hiddenTc);

            // Evaluate
            VerdictResult verdict;
            if (allTc.isEmpty()) {
                // Fallback: run with empty stdin for mock
                JsonNode result = codeExecutionService.execute(code, languageId, "", questionId);
                verdict = new VerdictResult();
                verdict.setVerdict(result.path("status").path("description").asText("ACCEPTED")
                        .toUpperCase().replace(" ", "_"));
                verdict.setPassedCount(0);
                verdict.setTotalCount(0);
                verdict.setRuntime(result.path("time").asText("0.000"));
                verdict.setMemory(result.path("memory").asInt(0));
                verdict.setStdout(result.path("stdout").asText(null));
                verdict.setStatusId(result.path("status").path("id").asInt(3));
            } else {
                verdict = codeExecutionService.evaluateAgainstTestCases(code, languageId, allTc);
            }

            // Save submission
            Submission submission = new Submission();
            submission.setUser(user);
            submission.setQuestion(question);
            submission.setCode(code);
            submission.setLanguage(String.valueOf(languageId));
            submission.setVerdict(verdict.getVerdict());
            submission.setStatus(verdict.getVerdict()); // keep legacy field in sync
            submission.setRuntime(verdict.getRuntime());
            submission.setMemory(verdict.getMemory());
            submission.setPassedCount(verdict.getPassedCount());
            submission.setTotalCount(verdict.getTotalCount());
            submission.setContestId(contestId);
            submissionRepository.save(submission);

            return ResponseEntity.ok(verdict);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "error", e.getMessage() != null ? e.getMessage() : "Unknown error",
                    "cause", String.valueOf(e.getCause())
            ));
        }
    }

    /** Get all submissions for a user */
    @GetMapping("/user/{userId}")
    public List<Submission> getUserSubmissions(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return submissionRepository.findByUser(user);
    }

    /** Get submissions for a specific question (ordered newest first) */
    @GetMapping("/question/{questionId}")
    public List<Submission> getQuestionSubmissions(@PathVariable Long questionId) {
        return submissionRepository.findByQuestionIdOrderBySubmittedAtDesc(questionId);
    }

    /** Get submissions for a contest */
    @GetMapping("/contest/{contestId}")
    public List<Submission> getContestSubmissions(@PathVariable Long contestId) {
        return submissionRepository.findByContestId(contestId);
    }
}
