package com.cfs.TechCodesolution.dto;

/**
 * Signup/registration request DTO.
 * No Lombok — explicit getters/setters for reliable clean builds.
 */
public class SignupRequest {
    private String username;
    private String email;
    private String password;

    public SignupRequest() {}

    // ── Getters ────────────────────────────────────────────────────────────
    public String getUsername() { return username; }
    public String getEmail()    { return email; }
    public String getPassword() { return password; }

    // ── Setters ────────────────────────────────────────────────────────────
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email)       { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}
