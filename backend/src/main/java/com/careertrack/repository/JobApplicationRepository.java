package com.careertrack.repository;

import com.careertrack.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByStatusIgnoreCaseOrderByCreatedAtDesc(String status);
    List<JobApplication> findAllByOrderByCreatedAtDesc();
}
