package com.cfs.TechCodesolution.model;

import jakarta.persistence.*;

/**
 * Represents a roadmap with an associated PDF.
 * No Lombok — explicit getters/setters for reliable clean builds.
 */
@Entity
@Table(name = "roadmaps")
public class Roadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String pdfPath;

    // ── Constructors ────────────────────────────────────────────────────────
    public Roadmap() {}

    public Roadmap(Long id, String title, String description, String pdfPath) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.pdfPath = pdfPath;
    }

    // ── Getters ────────────────────────────────────────────────────────────
    public Long getId()          { return id; }
    public String getTitle()     { return title; }
    public String getDescription(){ return description; }
    public String getPdfPath()   { return pdfPath; }

    // ── Setters ────────────────────────────────────────────────────────────
    public void setId(Long id)                 { this.id = id; }
    public void setTitle(String title)         { this.title = title; }
    public void setDescription(String description){ this.description = description; }
    public void setPdfPath(String pdfPath)     { this.pdfPath = pdfPath; }
}
