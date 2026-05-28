package com.cfs.TechCodesolution.controller;

import com.cfs.TechCodesolution.model.Roadmap;
import com.cfs.TechCodesolution.repository.RoadmapRepository;
import com.cfs.TechCodesolution.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/roadmaps")
public class RoadmapController {
    @Autowired
    RoadmapRepository roadmapRepository;

    @Autowired
    FileStorageService fileStorageService;

    @GetMapping
    public List<Roadmap> getAllRoadmaps() {
        return roadmapRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Roadmap createRoadmap(@RequestParam("title") String title,
                                @RequestParam("description") String description,
                                @RequestParam("file") MultipartFile file) {
        String filename = fileStorageService.save(file);
        Roadmap roadmap = new Roadmap();
        roadmap.setTitle(title);
        roadmap.setDescription(description);
        roadmap.setPdfPath(filename);
        return roadmapRepository.save(roadmap);
    }

//    @GetMapping("/download/{filename:.+}")
//    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
//        try {
//            Path file = fileStorageService.load(filename);
//            Resource resource = new UrlResource(file.toUri());
//
//            if (resource.exists() || resource.isReadable()) {
//                return ResponseEntity.ok()
//                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
//                        .body(resource);
//            } else {
//                return ResponseEntity.notFound().build();
//            }
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }


    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        System.out.println("Download requested for: " + filename);
        try {
            // Sanitize filename — strip any path components
            String safeFilename = Paths.get(filename).getFileName().toString();
            System.out.println("Safe filename: " + safeFilename);

            Path file = fileStorageService.load(safeFilename);
            System.out.println("Resolved path: " + file.toAbsolutePath());
            
            Resource resource = new UrlResource(file.toUri());
            System.out.println("Resource exists: " + resource.exists());
            System.out.println("Resource readable: " + resource.isReadable());

            if (!resource.exists() || !resource.isReadable()) {
                System.out.println("Returning 404 because resource does not exist or is not readable.");
                return ResponseEntity.notFound().build();
            }

            // Detect content type
            String contentType = Files.probeContentType(file);
            System.out.println("Content type: " + contentType);
            if (contentType == null) {
                contentType = "application/octet-stream"; // fallback
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + resource.getFilename() + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .contentLength(resource.contentLength())
                    .body(resource);

        } catch (Exception e) {
            System.out.println("Exception in download: " + e.getMessage());
            e.printStackTrace(); // Check logs!
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteRoadmap(@PathVariable Long id) {
        roadmapRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
