package com.cfs.TechCodesolution.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a registered user.
 * No Lombok — explicit getters/setters for reliable clean builds.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String resetToken;
    private LocalDateTime resetTokenExpiry;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // ── Constructors ────────────────────────────────────────────────────────
    public User() {}

    public User(Long id, String username, String email, String password, Role role, String resetToken, LocalDateTime resetTokenExpiry, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.resetToken = resetToken;
        this.resetTokenExpiry = resetTokenExpiry;
        this.createdAt = createdAt;
    }

    // Builder pattern
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String username;
        private String email;
        private String password;
        private Role role;
        private String resetToken;
        private LocalDateTime resetTokenExpiry;
        private LocalDateTime createdAt;

        public Builder id(Long id)               { this.id = id; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder email(String email)       { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder role(Role role)           { this.role = role; return this; }
        public Builder resetToken(String token)  { this.resetToken = token; return this; }
        public Builder resetTokenExpiry(LocalDateTime t) { this.resetTokenExpiry = t; return this; }
        public Builder createdAt(LocalDateTime t){ this.createdAt = t; return this; }

        public User build() {
            return new User(id, username, email, password, role, resetToken, resetTokenExpiry, createdAt);
        }
    }

    // ── Getters ────────────────────────────────────────────────────────────
    public Long getId()                 { return id; }
    public String getUsername()         { return username; }
    public String getEmail()            { return email; }
    public String getPassword()         { return password; }
    public Role getRole()               { return role; }
    public String getResetToken()       { return resetToken; }
    public LocalDateTime getResetTokenExpiry() { return resetTokenExpiry; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ── Setters ────────────────────────────────────────────────────────────
    public void setId(Long id)                     { this.id = id; }
    public void setUsername(String username)       { this.username = username; }
    public void setEmail(String email)             { this.email = email; }
    public void setPassword(String password)       { this.password = password; }
    public void setRole(Role role)                 { this.role = role; }
    public void setResetToken(String resetToken)   { this.resetToken = resetToken; }
    public void setResetTokenExpiry(LocalDateTime t) { this.resetTokenExpiry = t; }
    public void setCreatedAt(LocalDateTime t)      { this.createdAt = t; }
}
