package com.cfs.TechCodesolution.model;

import jakarta.persistence.*;

/**
 * Represents a single test case for a coding question.
 * No Lombok — explicit getters/setters for reliable clean builds.
 */
@Entity
@Table(name = "test_cases")
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(columnDefinition = "LONGTEXT")
    private String input;

    @Column(columnDefinition = "LONGTEXT")
    private String expectedOutput;

    @Column(name = "hidden", nullable = false)
    private boolean hidden = false;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    // ── Constructors ────────────────────────────────────────────────────────
    public TestCase() {}

    public TestCase(Long id, Question question, String input,
                    String expectedOutput, boolean hidden, String explanation) {
        this.id = id;
        this.question = question;
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.hidden = hidden;
        this.explanation = explanation;
    }

    // ── Getters ────────────────────────────────────────────────────────────
    public Long getId()               { return id; }
    public Question getQuestion()     { return question; }
    public String getInput()          { return input; }
    public String getExpectedOutput() { return expectedOutput; }
    public boolean isHidden()         { return hidden; }
    public String getExplanation()    { return explanation; }

    // ── Setters ────────────────────────────────────────────────────────────
    public void setId(Long id)                         { this.id = id; }
    public void setQuestion(Question question)         { this.question = question; }
    public void setInput(String input)                 { this.input = input; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }
    public void setHidden(boolean hidden)              { this.hidden = hidden; }
    public void setExplanation(String explanation)     { this.explanation = explanation; }
}
