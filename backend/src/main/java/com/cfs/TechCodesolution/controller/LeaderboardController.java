package com.cfs.TechCodesolution.controller;

import com.cfs.TechCodesolution.dto.LeaderboardEntryDTO;
import com.cfs.TechCodesolution.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contests")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/{contestId}/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDTO>> getLeaderboard(@PathVariable Long contestId) {
        return ResponseEntity.ok(leaderboardService.getContestLeaderboard(contestId));
    }
}
