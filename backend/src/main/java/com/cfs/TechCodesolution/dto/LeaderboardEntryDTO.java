package com.cfs.TechCodesolution.dto;

/**
 * Leaderboard entry DTO — one row per user in a contest leaderboard.
 * No Lombok — explicit getters/setters for reliable clean builds.
 */
public class LeaderboardEntryDTO {
    private int rank;
    private Long userId;
    private String username;
    private int totalSolved;
    private long totalPenaltyMinutes;

    public LeaderboardEntryDTO() {}

    public LeaderboardEntryDTO(int rank, Long userId, String username,
                                int totalSolved, long totalPenaltyMinutes) {
        this.rank = rank;
        this.userId = userId;
        this.username = username;
        this.totalSolved = totalSolved;
        this.totalPenaltyMinutes = totalPenaltyMinutes;
    }

    // ── Getters ────────────────────────────────────────────────────────────
    public int getRank()                    { return rank; }
    public Long getUserId()                 { return userId; }
    public String getUsername()             { return username; }
    public int getTotalSolved()             { return totalSolved; }
    public long getTotalPenaltyMinutes()    { return totalPenaltyMinutes; }

    // ── Setters ────────────────────────────────────────────────────────────
    public void setRank(int rank)                           { this.rank = rank; }
    public void setUserId(Long userId)                      { this.userId = userId; }
    public void setUsername(String username)                { this.username = username; }
    public void setTotalSolved(int totalSolved)             { this.totalSolved = totalSolved; }
    public void setTotalPenaltyMinutes(long totalPenalty)  { this.totalPenaltyMinutes = totalPenalty; }
}
