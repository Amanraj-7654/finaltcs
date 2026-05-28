package com.cfs.TechCodesolution.dto;

/**
 * Login request DTO.
 * No Lombok — explicit getters/setters for reliable clean builds.
 */
public class LoginRequest {
    private String email;
    private String password;
    private boolean isAdmin;

    public LoginRequest() {}

    // ── Getters ────────────────────────────────────────────────────────────
    public String getEmail()    { return email; }
    public String getPassword() { return password; }
    public boolean isAdmin()    { return isAdmin; }

    // ── Setters ────────────────────────────────────────────────────────────
    public void setEmail(String email)       { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setAdmin(boolean isAdmin)    { this.isAdmin = isAdmin; }
}
