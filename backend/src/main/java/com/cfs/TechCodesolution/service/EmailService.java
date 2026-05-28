package com.cfs.TechCodesolution.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendRegistrationEmail(String toEmail, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to TechCodeSolution!");
        message.setText("Dear " + username + ",\n\n" +
                "Welcome to TechCodeSolution! Your registration was successful.\n\n" +
                "Thank you for joining us!\n\n" +
                "Best regards,\nTechCodeSolution Team"+"https://t.me/TC_solution");
        
        try {
            mailSender.send(message);
            System.out.println("Registration email sent successfully to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Password Reset Request - TechCodeSolution");
        message.setText("Dear User,\n\n" +
                "You have requested to reset your password.\n" +
                "Please click on the link below to reset your password:\n" +
                resetLink + "\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Best regards,\nTechCodeSolution Team");

        try {
            mailSender.send(message);
            System.out.println("Password reset email sent successfully to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }
}
