package com.cfs.TechCodesolution.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

//@Service
//public class FileStorageService {
//    private final Path root = Paths.get("uploads/roadmaps");
//
//    public FileStorageService() {
//        try {
//            Files.createDirectories(root);
//        } catch (IOException e) {
//            throw new RuntimeException("Could not initialize folder for upload!");
//        }
//    }
//
//    public String save(MultipartFile file) {
//        try {
//            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
//            Files.copy(file.getInputStream(), this.root.resolve(filename));
//            return filename;
//        } catch (Exception e) {
//            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
//        }
//    }
//
//    public Path load(String filename) {
//        return root.resolve(filename);
//    }
//}


@Service
public class FileStorageService {

    private final Path rootLocation;

    public FileStorageService(@Value("${file.upload-dir:uploads}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public Path load(String filename) {
        // Normalize to prevent path traversal attacks
        Path resolvedPath = rootLocation.resolve(filename).normalize();

        // Security check — ensure file is within root
        if (!resolvedPath.startsWith(rootLocation)) {
            throw new RuntimeException("Cannot access file outside upload directory");
        }

        return resolvedPath;
    }

    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }


    public String save(MultipartFile file) {
        try {
            init(); // ensure directory exists
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));
            return filename;
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }
}