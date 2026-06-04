package com.cfs.TechCodesolution.service;

import com.cfs.TechCodesolution.repository.QuestionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class CodeExecutionServiceTest {

    @InjectMocks
    private CodeExecutionService codeExecutionService;

    @Mock
    private QuestionRepository questionRepository;

    @Test
    public void testExecute_NoJDoodleConfigured_ReturnsInternalError() {
        // When JDoodle credentials are not configured (unit test environment),
        // the service returns an Internal Error response.
        JsonNode result = codeExecutionService.execute("public class Solution {}", 62, "");

        // Assert
        assertNotNull(result);
        assertTrue(result.has("status"));
        assertEquals("Internal Error", result.get("status").get("description").asText());
        assertEquals(13, result.get("status").get("id").asInt());
    }
}
