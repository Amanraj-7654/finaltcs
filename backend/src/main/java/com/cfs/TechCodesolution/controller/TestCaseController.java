package com.cfs.TechCodesolution.controller;

import com.cfs.TechCodesolution.dto.TestCaseDTO;
import com.cfs.TechCodesolution.model.TestCase;
import com.cfs.TechCodesolution.service.TestCaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/questions/{questionId}/testcases")
public class TestCaseController {

    @Autowired
    private TestCaseService testCaseService;

    /** ADMIN: add a test case to a question */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TestCase> addTestCase(
            @PathVariable Long questionId,
            @RequestBody TestCaseDTO dto) {
        TestCase tc = testCaseService.addTestCase(questionId, dto);
        return ResponseEntity.ok(tc);
    }

    /**
     * PUBLIC: get only visible (non-hidden) test cases.
     * Hidden test cases are NEVER returned here.
     */
    @GetMapping("/public")
    public ResponseEntity<List<Map<String, Object>>> getPublicTestCases(@PathVariable Long questionId) {
        List<Map<String, Object>> result = testCaseService.getPublicTestCases(questionId)
                .stream()
                .map(tc -> Map.<String, Object>of(
                        "id", tc.getId(),
                        "input", tc.getInput() != null ? tc.getInput() : "",
                        "expectedOutput", tc.getExpectedOutput() != null ? tc.getExpectedOutput() : "",
                        "explanation", tc.getExplanation() != null ? tc.getExplanation() : ""
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    /** ADMIN: get all test cases including hidden */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllTestCases(@PathVariable Long questionId) {
        List<Map<String, Object>> result = testCaseService.getAllTestCases(questionId)
                .stream()
                .map(tc -> {
                    java.util.HashMap<String, Object> map = new java.util.HashMap<>();
                    map.put("id", tc.getId());
                    map.put("input", tc.getInput() != null ? tc.getInput() : "");
                    map.put("expectedOutput", tc.getExpectedOutput() != null ? tc.getExpectedOutput() : "");
                    map.put("explanation", tc.getExplanation() != null ? tc.getExplanation() : "");
                    map.put("isHidden", tc.isHidden());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    /** ADMIN: delete a test case */
    @DeleteMapping("/{testCaseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTestCase(
            @PathVariable Long questionId,
            @PathVariable Long testCaseId) {
        testCaseService.deleteTestCase(testCaseId);
        return ResponseEntity.ok().build();
    }
}
