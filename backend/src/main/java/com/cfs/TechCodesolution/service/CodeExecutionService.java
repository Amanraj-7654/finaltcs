package com.cfs.TechCodesolution.service;

import com.cfs.TechCodesolution.dto.VerdictResult;
import com.cfs.TechCodesolution.model.TestCase;
import com.cfs.TechCodesolution.model.Question;
import com.cfs.TechCodesolution.repository.QuestionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.Optional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * CodeExecutionService - Handles code execution and evaluation via Judge0.
 */
@Service
public class CodeExecutionService {

    @Autowired
    private QuestionRepository questionRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // @Value("${judge0.api.url:http://localhost:2358}")
    // private String judge0ApiUrl; // Judge0 disabled – JDoodle only

    @Value("${jdoodle.client.id:}")
    private String jdoodleClientId;

    @Value("${jdoodle.client.secret:}")
    private String jdoodleClientSecret;

    private static class JDoodleLanguage {
        String language;
        String versionIndex;

        JDoodleLanguage(String language, String versionIndex) {
            this.language = language;
            this.versionIndex = versionIndex;
        }
    }

    private JDoodleLanguage mapLanguageToJDoodle(int languageId) {
        switch (languageId) {
            case 62: // Java
                return new JDoodleLanguage("java", "4");
            case 54: // C++
                return new JDoodleLanguage("cpp", "5");
            case 50: // C
                return new JDoodleLanguage("c", "5");
            case 71: // Python
                return new JDoodleLanguage("python3", "4");
            case 63: // JavaScript
                return new JDoodleLanguage("nodejs", "4");
            default:
                return new JDoodleLanguage("python3", "4");
        }
    }

    private JsonNode executeJDoodle(String code, int languageId, String stdin) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            JDoodleLanguage jdLang = mapLanguageToJDoodle(languageId);

            Map<String, Object> bodyMap = new HashMap<>();
            bodyMap.put("clientId", jdoodleClientId);
            bodyMap.put("clientSecret", jdoodleClientSecret);
            bodyMap.put("script", code);
            bodyMap.put("stdin", stdin);
            bodyMap.put("language", jdLang.language);
            bodyMap.put("versionIndex", jdLang.versionIndex);

            String requestBody = objectMapper.writeValueAsString(bodyMap);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.jdoodle.com/v1/execute"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                throw new RuntimeException(
                        "JDoodle returned error code: " + response.statusCode() + " body: " + response.body());
            }

            return decodeJDoodleResponse(response.body(), jdLang.language);

        } catch (Exception e) {
            e.printStackTrace();
            return getErrorJsonResponse("JDoodle execution failed: " + e.getMessage());
        }
    }

    private JsonNode decodeJDoodleResponse(String responseBody, String language) {
        try {
            JsonNode raw = objectMapper.readTree(responseBody);
            com.fasterxml.jackson.databind.node.ObjectNode decoded = objectMapper.createObjectNode();

            if (raw.has("error") && !raw.path("error").isNull() && !raw.path("error").asText("").trim().isEmpty()) {
                return getErrorJsonResponse(raw.path("error").asText());
            }

            String output = raw.path("output").asText("");

            // Check for compilation error indicators
            boolean isCompileError = false;
            if (output != null) {
                if ("java".equals(language) && (output.contains("error:") || output.contains("compiler error")
                        || output.contains("Compilation problem"))) {
                    isCompileError = true;
                } else if (("cpp".equals(language) || "c".equals(language))
                        && (output.contains("error:") || output.contains("In function"))) {
                    isCompileError = true;
                }
            }

            if (isCompileError) {
                decoded.put("compile_output", output);
                decoded.putNull("stdout");
                decoded.putNull("stderr");
                com.fasterxml.jackson.databind.node.ObjectNode status = objectMapper.createObjectNode();
                status.put("id", 6); // Compilation Error
                status.put("description", "Compilation Error");
                decoded.set("status", status);
            } else {
                // Check for common runtime errors
                boolean isRuntimeError = false;
                if (output != null) {
                    if (output.contains("Exception in thread") || output.contains("NullPointerException") ||
                            output.contains("ArrayIndexOutOfBoundsException")
                            || output.contains("Traceback (most recent call last):") ||
                            output.contains("RuntimeError") || output.contains("ReferenceError")
                            || output.contains("TypeError")) {
                        isRuntimeError = true;
                    }
                }

                if (isRuntimeError) {
                    decoded.putNull("compile_output");
                    decoded.putNull("stdout");
                    decoded.put("stderr", output);
                    com.fasterxml.jackson.databind.node.ObjectNode status = objectMapper.createObjectNode();
                    status.put("id", 11); // Runtime Error
                    status.put("description", "Runtime Error");
                    decoded.set("status", status);
                } else {
                    decoded.putNull("compile_output");
                    decoded.put("stdout", output);
                    decoded.putNull("stderr");
                    com.fasterxml.jackson.databind.node.ObjectNode status = objectMapper.createObjectNode();
                    status.put("id", 3); // Accepted
                    status.put("description", "Accepted");
                    decoded.set("status", status);
                }
            }

            // Map time and memory
            String cpuTime = raw.path("cpuTime").asText("0.00");
            decoded.put("time", cpuTime);

            String memStr = raw.path("memory").asText("0");
            try {
                if (memStr != null && !memStr.isEmpty()) {
                    decoded.put("memory", Integer.parseInt(memStr.trim()));
                } else {
                    decoded.put("memory", 0);
                }
            } catch (Exception e) {
                decoded.put("memory", 0);
            }

            return decoded;
        } catch (Exception e) {
            return getErrorJsonResponse(e.getMessage());
        }
    }

    /**
     * Execute code with a single custom stdin — used for "Run" button.
     */
    public JsonNode execute(String code, int languageId, String stdin) {
        return execute(code, languageId, stdin, null);
    }

    public JsonNode execute(String code, int languageId, String stdin, Long questionId) {
        String wrappedCode = code;
        if (questionId != null) {
            try {
                Optional<Question> qOpt = questionRepository.findById(questionId);
                if (qOpt.isPresent()) {
                    Question question = qOpt.get();
                    String driverCodeJson = question.getDriverCode();
                    if (driverCodeJson != null && !driverCodeJson.trim().isEmpty()) {
                        JsonNode drivers = objectMapper.readTree(driverCodeJson);
                        // Map languageId to JDoodle language string: "java", "cpp", "c", "python3",
                        // "nodejs"
                        String jdLangStr = mapLanguageToJDoodle(languageId).language;
                        if (drivers.has(jdLangStr)) {
                            String template = drivers.path(jdLangStr).asText();
                            if (template != null && template.contains("// {{USER_CODE}}")) {
                                wrappedCode = template.replace("// {{USER_CODE}}", code);
                            } else if (template != null && template.contains("/*{{USER_CODE}}*/")) {
                                wrappedCode = template.replace("/*{{USER_CODE}}*/", code);
                            }
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to wrap code with driver template: " + e.getMessage());
            }
        }

        if (jdoodleClientId != null && !jdoodleClientId.trim().isEmpty()
                && !jdoodleClientId.equals("YOUR_JDOODLE_CLIENT_ID")) {
            return executeJDoodle(wrappedCode, languageId, stdin);
        }
        // JDoodle is the only supported compiler. If JDoodle credentials are missing,
        // return a clear error response.
        return getErrorJsonResponse("JDoodle not configured – code execution unavailable.");
    }

    /**
     * Evaluate code against a list of test cases — used for "Submit" button.
     */
    public VerdictResult evaluateAgainstTestCases(String code, int languageId, List<TestCase> testCases) {
        if (testCases == null || testCases.isEmpty()) {
            return VerdictResult.accepted(0, "0.000", 0, "No test cases defined.");
        }

        Long questionId = null;
        if (testCases.get(0).getQuestion() != null) {
            questionId = testCases.get(0).getQuestion().getId();
        }

        int passedCount = 0;
        int totalCount = testCases.size();
        double maxRuntime = 0.0;
        int maxMemory = 0;

        for (TestCase tc : testCases) {
            JsonNode execution = execute(code, languageId, tc.getInput(), questionId);

            int statusId = execution.path("status").path("id").asInt(0);

            double time = 0.0;
            try {
                String timeStr = execution.path("time").asText("0.0");
                if (timeStr != null && !timeStr.isEmpty()) {
                    time = Double.parseDouble(timeStr);
                }
            } catch (Exception e) {
            }
            if (time > maxRuntime) {
                maxRuntime = time;
            }

            int memory = execution.path("memory").asInt(0);
            if (memory > maxMemory) {
                maxMemory = memory;
            }

            // If compilation error, fail early
            if (statusId == 6) {
                VerdictResult result = new VerdictResult();
                result.setVerdict("COMPILATION_ERROR");
                result.setPassedCount(passedCount);
                result.setTotalCount(totalCount);
                result.setCompileOutput(execution.path("compile_output").asText(""));
                result.setStatusId(6);
                return result;
            }

            // If runtime error or memory/time limits or any other failure
            if (statusId != 3) {
                String verdict = "WRONG_ANSWER";
                if (statusId == 5) {
                    verdict = "TIME_LIMIT_EXCEEDED";
                } else if (statusId >= 7 && statusId <= 12) {
                    verdict = "RUNTIME_ERROR";
                }

                VerdictResult result = new VerdictResult();
                result.setVerdict(verdict);
                result.setPassedCount(passedCount);
                result.setTotalCount(totalCount);
                result.setRuntime(String.format("%.3f", maxRuntime));
                result.setMemory(maxMemory);
                result.setStdout(execution.path("stdout").asText(""));
                result.setStderr(execution.path("stderr").asText(""));
                result.setFailedInput(tc.getInput());
                result.setStatusId(statusId);
                return result;
            }

            // Check output mismatch
            String actualOutput = execution.path("stdout").asText("");
            String expectedOutput = tc.getExpectedOutput();

            if (!compareOutputs(actualOutput, expectedOutput)) {
                VerdictResult result = new VerdictResult();
                result.setVerdict("WRONG_ANSWER");
                result.setPassedCount(passedCount);
                result.setTotalCount(totalCount);
                result.setRuntime(String.format("%.3f", maxRuntime));
                result.setMemory(maxMemory);
                result.setStdout(actualOutput);
                result.setFailedInput(tc.getInput());
                result.setStatusId(4); // Wrong Answer
                return result;
            }

            passedCount++;
        }

        VerdictResult result = new VerdictResult();
        result.setVerdict("ACCEPTED");
        result.setPassedCount(passedCount);
        result.setTotalCount(totalCount);
        result.setRuntime(String.format("%.3f", maxRuntime));
        result.setMemory(maxMemory);
        result.setStatusId(3);
        return result;
    }

    private boolean compareOutputs(String actual, String expected) {
        if (actual == null)
            actual = "";
        if (expected == null)
            expected = "";

        String[] actualLines = actual.replace("\r", "").split("\n");
        String[] expectedLines = expected.replace("\r", "").split("\n");

        int actualLen = actualLines.length;
        int expectedLen = expectedLines.length;

        while (actualLen > 0 && actualLines[actualLen - 1].trim().isEmpty()) {
            actualLen--;
        }
        while (expectedLen > 0 && expectedLines[expectedLen - 1].trim().isEmpty()) {
            expectedLen--;
        }

        if (actualLen != expectedLen) {
            return false;
        }

        for (int i = 0; i < actualLen; i++) {
            if (!actualLines[i].stripTrailing().equals(expectedLines[i].stripTrailing())) {
                return false;
            }
        }

        return true;
    }

    private JsonNode getErrorJsonResponse(String errMsg) {
        try {
            String errJson = "{\"stdout\": null, \"stderr\": \"" + errMsg + "\", \"compile_output\": null, "
                    + "\"time\": null, \"memory\": null, "
                    + "\"status\": {\"id\": 13, \"description\": \"Internal Error\"}}";
            return objectMapper.readTree(errJson);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to generate error response");
        }
    }
}
