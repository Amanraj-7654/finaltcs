package com.cfs.TechCodesolution.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a code submission by a user.
 * No Lombok — explicit getters/setters for reliable clean builds.
 */
@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @Column(columnDefinition = "TEXT")
    private String code;

    private String language;

    /** Legacy status field — kept for backwards compatibility */
    private String status; // ACCEPTED, WRONG_ANSWER, TLE, ERROR

    /** Rich verdict from evaluation engine */
    private String verdict; // ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, RUNTIME_ERROR, COMPILATION_ERROR

    private String runtime;   // e.g. "0.045" seconds
    private Integer memory;   // KB

    private Integer passedCount;  // how many test cases passed
    private Integer totalCount;   // total test cases evaluated

    /** Link to contest (null = standalone practice submission) */
    private Long contestId;

    private LocalDateTime submittedAt;

    @PrePersist
    protected void onSubmit() {
        submittedAt = LocalDateTime.now();
    }

    // ── Constructors ────────────────────────────────────────────────────────
    public Submission() {}

    // ── Getters ────────────────────────────────────────────────────────────
    public Long getId()               { return id; }
    public User getUser()             { return user; }
    public Question getQuestion()     { return question; }
    public String getCode()           { return code; }
    public String getLanguage()       { return language; }
    public String getStatus()         { return status; }
    public String getVerdict()        { return verdict; }
    public String getRuntime()        { return runtime; }
    public Integer getMemory()        { return memory; }
    public Integer getPassedCount()   { return passedCount; }
    public Integer getTotalCount()    { return totalCount; }
    public Long getContestId()        { return contestId; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }

    // ── Setters ────────────────────────────────────────────────────────────
    public void setId(Long id)                     { this.id = id; }
    public void setUser(User user)                 { this.user = user; }
    public void setQuestion(Question question)     { this.question = question; }
    public void setCode(String code)               { this.code = code; }
    public void setLanguage(String language)       { this.language = language; }
    public void setStatus(String status)           { this.status = status; }
    public void setVerdict(String verdict)         { this.verdict = verdict; }
    public void setRuntime(String runtime)         { this.runtime = runtime; }
    public void setMemory(Integer memory)          { this.memory = memory; }
    public void setPassedCount(Integer passedCount) { this.passedCount = passedCount; }
    public void setTotalCount(Integer totalCount)   { this.totalCount = totalCount; }
    public void setContestId(Long contestId)        { this.contestId = contestId; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
