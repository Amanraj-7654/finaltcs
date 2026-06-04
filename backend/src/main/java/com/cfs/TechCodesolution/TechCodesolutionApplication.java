package com.cfs.TechCodesolution;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@SpringBootApplication
public class TechCodesolutionApplication {

	private static final Logger logger = LoggerFactory.getLogger(TechCodesolutionApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(TechCodesolutionApplication.class, args);

		logger.info(".......Application is Running...................");
	}

}
