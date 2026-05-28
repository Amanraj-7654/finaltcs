package com.cfs.TechCodesolution.model;

import jakarta.persistence.*;

/**
 * Represents a coding question.
 * No Lombok — explicit getters/setters for reliable clean builds.
 */
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String difficulty; // EASY, MEDIUM, HARD
    private String type;       // Array, String, program, etc.

    // Visible test cases (public, first 2 shown on frontend) — JSON array
    @Column(columnDefinition = "TEXT")
    private String testCases;

    // Hidden test cases — NEVER serialized to public API responses
    @Column(columnDefinition = "LONGTEXT")
    private String hiddenTestCases;

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column(columnDefinition = "TEXT")
    private String inputFormat;

    @Column(columnDefinition = "TEXT")
    private String outputFormat;

    // Time limit in seconds (default 2)
    private Integer timeLimit = 2;

    // Memory limit in MB (default 256)
    private Integer memoryLimit = 256;

    // Comma-separated tags (e.g. "array,string,dp")
    private String tags;

    // JSON map of language -> boilerplate code
    @Column(columnDefinition = "LONGTEXT")
    private String boilerplates;

    // JSON map of language -> driver code
    @Column(columnDefinition = "LONGTEXT")
    private String driverCode;

    // External link (optional)
    private String link;

    // ── Constructors ────────────────────────────────────────────────────────
    public Question() {}

    // ── Getters ────────────────────────────────────────────────────────────
    public Long getId()               { return id; }
    public String getTitle()          { return title; }
    public String getDescription()    { return description; }
    public String getDifficulty()     { return difficulty; }
    public String getType()           { return type; }
    public String getTestCases()      { return testCases; }
    public String getHiddenTestCases(){ return hiddenTestCases; }
    public String getConstraints()    { return constraints; }
    public String getInputFormat()    { return inputFormat; }
    public String getOutputFormat()   { return outputFormat; }
    public Integer getTimeLimit()     { return timeLimit; }
    public Integer getMemoryLimit()   { return memoryLimit; }
    public String getTags()           { return tags; }
    public String getBoilerplates()   { return boilerplates; }
    public String getDriverCode()     { return driverCode; }
    public String getLink()           { return link; }

    // ── Setters ────────────────────────────────────────────────────────────
    public void setId(Long id)                           { this.id = id; }
    public void setTitle(String title)                   { this.title = title; }
    public void setDescription(String description)       { this.description = description; }
    public void setDifficulty(String difficulty)         { this.difficulty = difficulty; }
    public void setType(String type)                     { this.type = type; }
    public void setTestCases(String testCases)           { this.testCases = testCases; }
    public void setHiddenTestCases(String hiddenTestCases){ this.hiddenTestCases = hiddenTestCases; }
    public void setConstraints(String constraints)       { this.constraints = constraints; }
    public void setInputFormat(String inputFormat)       { this.inputFormat = inputFormat; }
    public void setOutputFormat(String outputFormat)     { this.outputFormat = outputFormat; }
    public void setTimeLimit(Integer timeLimit)          { this.timeLimit = timeLimit; }
    public void setMemoryLimit(Integer memoryLimit)      { this.memoryLimit = memoryLimit; }
    public void setTags(String tags)                     { this.tags = tags; }
    public void setBoilerplates(String boilerplates)     { this.boilerplates = boilerplates; }
    public void setDriverCode(String driverCode)         { this.driverCode = driverCode; }
    public void setLink(String link)                     { this.link = link; }
}
