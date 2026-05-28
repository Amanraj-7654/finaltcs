package com.cfs.TechCodesolution.dto;

/**
 * DTO for admin to create/update test cases.
 * No Lombok — explicit getters/setters for reliable clean builds.
 */
public class TestCaseDTO {
    private String input;
    private String expectedOutput;
    private Boolean isHidden;
    private String explanation;

    // ── Constructors ────────────────────────────────────────────────────────
    public TestCaseDTO() {}

    public TestCaseDTO(String input, String expectedOutput, Boolean isHidden, String explanation) {
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.isHidden = isHidden;
        this.explanation = explanation;
    }

    // ── Getters ────────────────────────────────────────────────────────────
    public String getInput()           { return input; }
    public String getExpectedOutput()  { return expectedOutput; }
    public Boolean getIsHidden()       { return isHidden; }
    public String getExplanation()     { return explanation; }

    // ── Setters ────────────────────────────────────────────────────────────
    public void setInput(String input)                     { this.input = input; }
    public void setExpectedOutput(String expectedOutput)   { this.expectedOutput = expectedOutput; }
    public void setIsHidden(Boolean isHidden)              { this.isHidden = isHidden; }
    public void setExplanation(String explanation)         { this.explanation = explanation; }
}
