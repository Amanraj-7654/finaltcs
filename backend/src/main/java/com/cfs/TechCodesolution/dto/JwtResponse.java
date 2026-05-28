package com.cfs.TechCodesolution.dto;

/**
 * JWT authentication response DTO.
 * No Lombok — explicit getters for reliable clean builds.
 */
public class JwtResponse {
    private String token;
    private Long id;
    private String username;
    private String email;
    private String role;

    public JwtResponse(String token, Long id, String username, String email, String role) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    // ── Getters ────────────────────────────────────────────────────────────
    public String getToken()    { return token; }
    public Long getId()         { return id; }
    public String getUsername() { return username; }
    public String getEmail()    { return email; }
    public String getRole()     { return role; }

    // ── Setters ────────────────────────────────────────────────────────────
    public void setToken(String token)     { this.token = token; }
    public void setId(Long id)             { this.id = id; }
    public void setUsername(String u)      { this.username = u; }
    public void setEmail(String email)     { this.email = email; }
    public void setRole(String role)       { this.role = role; }
}
