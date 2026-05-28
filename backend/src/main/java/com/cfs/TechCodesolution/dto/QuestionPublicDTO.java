package com.cfs.TechCodesolution.dto;

import com.cfs.TechCodesolution.model.Question;

/**
 * Public-facing DTO for Question — hiddenTestCases is NEVER included.
 * No Lombok — explicit getters/setters for reliable clean builds.
 */
public class QuestionPublicDTO {
    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private String type;
    private String testCases;       // visible/sample test cases only
    private String constraints;
    private String inputFormat;
    private String outputFormat;
    private Integer timeLimit;
    private Integer memoryLimit;
    private String tags;
    private String boilerplates;    // JSON map per language
    private String link;

    public QuestionPublicDTO() {}

    public static QuestionPublicDTO from(Question q) {
        QuestionPublicDTO dto = new QuestionPublicDTO();
        dto.setId(q.getId());
        dto.setTitle(q.getTitle());
        dto.setDescription(q.getDescription());
        dto.setDifficulty(q.getDifficulty());
        dto.setType(q.getType());
        dto.setTestCases(q.getTestCases());
        dto.setConstraints(q.getConstraints());
        dto.setInputFormat(q.getInputFormat());
        dto.setOutputFormat(q.getOutputFormat());
        dto.setTimeLimit(q.getTimeLimit());
        dto.setMemoryLimit(q.getMemoryLimit());
        dto.setTags(q.getTags());
        dto.setBoilerplates(q.getBoilerplates());
        dto.setLink(q.getLink());
        return dto;
    }

    // ── Getters ────────────────────────────────────────────────────────────
    public Long getId()             { return id; }
    public String getTitle()        { return title; }
    public String getDescription()  { return description; }
    public String getDifficulty()   { return difficulty; }
    public String getType()         { return type; }
    public String getTestCases()    { return testCases; }
    public String getConstraints()  { return constraints; }
    public String getInputFormat()  { return inputFormat; }
    public String getOutputFormat() { return outputFormat; }
    public Integer getTimeLimit()   { return timeLimit; }
    public Integer getMemoryLimit() { return memoryLimit; }
    public String getTags()         { return tags; }
    public String getBoilerplates() { return boilerplates; }
    public String getLink()         { return link; }

    // ── Setters ────────────────────────────────────────────────────────────
    public void setId(Long id)                     { this.id = id; }
    public void setTitle(String title)             { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setDifficulty(String difficulty)   { this.difficulty = difficulty; }
    public void setType(String type)               { this.type = type; }
    public void setTestCases(String testCases)     { this.testCases = testCases; }
    public void setConstraints(String constraints) { this.constraints = constraints; }
    public void setInputFormat(String inputFormat) { this.inputFormat = inputFormat; }
    public void setOutputFormat(String outputFormat){ this.outputFormat = outputFormat; }
    public void setTimeLimit(Integer timeLimit)    { this.timeLimit = timeLimit; }
    public void setMemoryLimit(Integer memoryLimit){ this.memoryLimit = memoryLimit; }
    public void setTags(String tags)               { this.tags = tags; }
    public void setBoilerplates(String boilerplates){ this.boilerplates = boilerplates; }
    public void setLink(String link)               { this.link = link; }
}
