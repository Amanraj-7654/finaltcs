package com.cfs.TechCodesolution.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a programming contest.
 * No Lombok — explicit getters/setters for reliable clean builds.
 */
@Entity
@Table(name = "contests")
public class Contest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMinutes;

    private Boolean isPublished = true;

    @ManyToMany
    @JoinTable(
        name = "contest_questions",
        joinColumns = @JoinColumn(name = "contest_id"),
        inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private List<Question> questions;

    // ── Constructors ────────────────────────────────────────────────────────
    public Contest() {}

    // ── Getters ────────────────────────────────────────────────────────────
    public Long getId()                   { return id; }
    public String getTitle()              { return title; }
    public String getDescription()        { return description; }
    public LocalDateTime getStartTime()   { return startTime; }
    public LocalDateTime getEndTime()     { return endTime; }
    public Integer getDurationMinutes()   { return durationMinutes; }
    public Boolean getIsPublished()       { return isPublished; }
    public List<Question> getQuestions()  { return questions; }

    // ── Setters ────────────────────────────────────────────────────────────
    public void setId(Long id)                           { this.id = id; }
    public void setTitle(String title)                   { this.title = title; }
    public void setDescription(String description)       { this.description = description; }
    public void setStartTime(LocalDateTime startTime)    { this.startTime = startTime; }
    public void setEndTime(LocalDateTime endTime)        { this.endTime = endTime; }
    public void setDurationMinutes(Integer durationMinutes){ this.durationMinutes = durationMinutes; }
    public void setIsPublished(Boolean isPublished)      { this.isPublished = isPublished; }
    public void setQuestions(List<Question> questions)   { this.questions = questions; }
}
