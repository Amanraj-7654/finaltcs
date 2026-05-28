package com.cfs.TechCodesolution.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class CodeExecutionServiceTest {

    @InjectMocks
    private CodeExecutionService codeExecutionService;

    @Test
    public void testExecute_MockResponse() {
        // Act
        JsonNode result = codeExecutionService.execute("public class Solution {}", 62, "");

        // Assert
        assertNotNull(result);
        assertTrue(result.has("status"));
        assertEquals("Accepted", result.get("status").get("description").asText());
        assertTrue(result.get("stdout").asText().contains("Mock Mode"));
    }
}
