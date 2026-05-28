package com.cfs.TechCodesolution.service;

import com.cfs.TechCodesolution.dto.LeaderboardEntryDTO;
import com.cfs.TechCodesolution.model.Contest;
import com.cfs.TechCodesolution.model.Submission;
import com.cfs.TechCodesolution.repository.ContestRepository;
import com.cfs.TechCodesolution.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ContestRepository contestRepository;

    /**
     * Build leaderboard for a contest.
     * Ranking: most problems solved DESC, then least penalty ASC.
     * Penalty = sum of (submission time - contest start time) for each accepted problem.
     */
    public List<LeaderboardEntryDTO> getContestLeaderboard(Long contestId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new RuntimeException("Contest not found: " + contestId));

        List<Submission> contestSubmissions = submissionRepository.findByContestId(contestId);
        LocalDateTime contestStart = contest.getStartTime();

        // Group by user
        Map<Long, List<Submission>> byUser = contestSubmissions.stream()
                .filter(s -> s.getUser() != null)
                .collect(Collectors.groupingBy(s -> s.getUser().getId()));

        List<LeaderboardEntryDTO> entries = new ArrayList<>();

        for (Map.Entry<Long, List<Submission>> entry : byUser.entrySet()) {
            Long userId = entry.getKey();
            List<Submission> userSubs = entry.getValue();
            String username = userSubs.get(0).getUser().getUsername();

            // Find accepted submissions per question (first accepted only)
            Map<Long, Submission> firstAccepted = new LinkedHashMap<>();
            for (Submission sub : userSubs) {
                if ("ACCEPTED".equals(sub.getVerdict()) || "ACCEPTED".equals(sub.getStatus())) {
                    Long qId = sub.getQuestion() != null ? sub.getQuestion().getId() : null;
                    if (qId != null && !firstAccepted.containsKey(qId)) {
                        firstAccepted.put(qId, sub);
                    }
                }
            }

            int solved = firstAccepted.size();
            long penaltyMinutes = 0;
            if (contestStart != null) {
                for (Submission sub : firstAccepted.values()) {
                    if (sub.getSubmittedAt() != null) {
                        penaltyMinutes += Duration.between(contestStart, sub.getSubmittedAt()).toMinutes();
                    }
                }
            }

            entries.add(new LeaderboardEntryDTO(0, userId, username, solved, penaltyMinutes));
        }

        // Sort: solved DESC, penalty ASC
        entries.sort(Comparator.comparingInt(LeaderboardEntryDTO::getTotalSolved).reversed()
                .thenComparingLong(LeaderboardEntryDTO::getTotalPenaltyMinutes));

        // Assign ranks
        for (int i = 0; i < entries.size(); i++) {
            entries.get(i).setRank(i + 1);
        }

        return entries;
    }
}
