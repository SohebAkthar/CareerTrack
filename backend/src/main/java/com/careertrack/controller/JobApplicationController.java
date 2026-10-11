package com.careertrack.controller;

import com.careertrack.model.JobApplication;
import com.careertrack.repository.JobApplicationRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class JobApplicationController {
    private final JobApplicationRepository repository;

    public JobApplicationController(JobApplicationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<JobApplication> getAll(@RequestParam(required = false) String status) {
        if (status != null && !status.isBlank()) {
            return repository.findByStatusIgnoreCaseOrderByCreatedAtDesc(status);
        }
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public JobApplication getById(@PathVariable Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplication create(@Valid @RequestBody JobApplication application) {
        application.setId(null);
        return repository.save(application);
    }

    @PutMapping("/{id}")
    public JobApplication update(@PathVariable Long id, @Valid @RequestBody JobApplication input) {
        JobApplication existing = getById(id);
        existing.setCompany(input.getCompany());
        existing.setRole(input.getRole());
        existing.setLocation(input.getLocation());
        existing.setPackageLpa(input.getPackageLpa());
        existing.setStatus(input.getStatus());
        existing.setAppliedDate(input.getAppliedDate());
        existing.setInterviewDate(input.getInterviewDate());
        existing.setJobUrl(input.getJobUrl());
        existing.setNotes(input.getNotes());
        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found");
        }
        repository.deleteById(id);
    }
}
