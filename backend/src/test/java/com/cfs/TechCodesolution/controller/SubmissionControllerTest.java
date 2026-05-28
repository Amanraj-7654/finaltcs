package com.cfs.TechCodesolution.controller;

import com.cfs.TechCodesolution.model.Question;
import com.cfs.TechCodesolution.model.User;
import com.cfs.TechCodesolution.repository.QuestionRepository;
import com.cfs.TechCodesolution.repository.SubmissionRepository;
import com.cfs.TechCodesolution.repository.UserRepository;
import com.cfs.TechCodesolution.service.CodeExecutionService;
import com.cfs.TechCodesolution.service.TestCaseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SubmissionControllerTest {

    @InjectMocks
    private SubmissionController submissionController;

    @Mock
    private UserRepository userRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private CodeExecutionService codeExecutionService;

    @Mock
    private TestCaseService testCaseService;  // required — prevents NPE in submitCode

    @BeforeEach
    public void setupSecurity() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("testuser");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    public void testSubmitCode() throws Exception {
        // Arrange
        User user = new User();
        user.setUsername("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        Question question = new Question();
        question.setId(1L);
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));

        // TestCaseService returns empty lists — triggers fallback mock execution path
        when(testCaseService.getPublicTestCases(anyLong())).thenReturn(Collections.emptyList());
        when(testCaseService.getHiddenTestCases(anyLong())).thenReturn(Collections.emptyList());

        ObjectMapper objectMapper = new ObjectMapper();
        String mockJson = "{\"stdout\": \"Success\", \"status\": {\"id\": 3, \"description\": \"Accepted\"}}";
        when(codeExecutionService.execute(any(), any(Integer.class), any()))
                .thenReturn(objectMapper.readTree(mockJson));

        Map<String, Object> request = new HashMap<>();
        request.put("code", "print('hello')");
        request.put("languageId", 71);

        // Act
        ResponseEntity<?> response = submissionController.submitCode(1L, request);

        // Assert
        assertEquals(200, response.getStatusCode().value());
    }
}
