package com.cfs.TechCodesolution.controller;

import com.cfs.TechCodesolution.model.Contest;
import com.cfs.TechCodesolution.model.Submission;
import com.cfs.TechCodesolution.repository.ContestRepository;
import com.cfs.TechCodesolution.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contests")
public class ContestController {
    @Autowired
    ContestRepository contestRepository;

    @Autowired
    SubmissionRepository submissionRepository;

    @GetMapping
    public List<Contest> getAllContests() {
        return contestRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contest> getContestById(@PathVariable Long id) {
        return contestRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Contest createContest(@RequestBody Contest contest) {
        return contestRepository.save(contest);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteContest(@PathVariable Long id) {
        return contestRepository.findById(id)
                .map(contest -> {
                    // 1. Delete all submissions associated with this contest
                    List<Submission> submissions = submissionRepository.findByContestId(id);
                    submissionRepository.deleteAll(submissions);

                    // 2. Delete the contest itself
                    contestRepository.delete(contest);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

