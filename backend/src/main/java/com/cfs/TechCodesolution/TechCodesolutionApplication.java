package com.cfs.TechCodesolution;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import com.cfs.TechCodesolution.repository.QuestionRepository;
import com.cfs.TechCodesolution.repository.TestCaseRepository;
import com.cfs.TechCodesolution.model.Question;
import com.cfs.TechCodesolution.model.TestCase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Optional;

@SpringBootApplication
public class TechCodesolutionApplication {

	private static final Logger logger = LoggerFactory.getLogger(TechCodesolutionApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(TechCodesolutionApplication.class, args);

        logger.info(".......Application is Running...................");
	}

	@Bean
	public CommandLineRunner seedDatabase(QuestionRepository questionRepository, TestCaseRepository testCaseRepository) {
		return args -> {
			Optional<Question> existing = questionRepository.findAll().stream()
					.filter(q -> q.getTitle().equals("Two Sum (LeetCode Style)"))
					.findFirst();
			
			if (existing.isEmpty()) {
				logger.info("Seeding Two Sum (LeetCode Style) question...");
				Question q = new Question();
				q.setTitle("Two Sum (LeetCode Style)");
				q.setDescription("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.");
				q.setDifficulty("EASY");
				q.setType("program");
				q.setConstraints("2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9");
				
				// Boilerplates JSON
				String boilerplatesJson = "{"
						+ "\"java\":\"class Solution {\\n    public int[] twoSum(int[] nums, int target) {\\n        for (int i = 0; i < nums.length; i++) {\\n            for (int j = i + 1; j < nums.length; j++) {\\n                if (nums[i] + nums[j] == target) {\\n                    return new int[]{i, j};\\n                }\\n            }\\n        }\\n        return new int[]{};\\n    }\\n}\","
						+ "\"python\":\"class Solution:\\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\\n        for i in range(len(nums)):\\n            for j in range(i + 1, len(nums)):\\n                if nums[i] + nums[j] == target:\\n                    return [i, j]\\n        return []\","
						+ "\"cpp\":\"class Solution {\\npublic:\\n    vector<int> twoSum(vector<int>& nums, int target) {\\n        for (int i = 0; i < nums.size(); i++) {\\n            for (int j = i + 1; j < nums.size(); j++) {\\n                if (nums[i] + nums[j] == target) {\\n                    return {i, j};\\n                }\\n            }\\n        }\\n        return {};\\n    }\\n};\","
						+ "\"javascript\":\"class Solution {\\n    twoSum(nums, target) {\\n        for (let i = 0; i < nums.length; i++) {\\n            for (let j = i + 1; j < nums.length; j++) {\\n                if (nums[i] + nums[j] === target) {\\n                    return [i, j];\\n                }\\n            }\\n        }\\n        return [];\\n    }\\n}\""
						+ "}";
				q.setBoilerplates(boilerplatesJson);

				// Driver Code JSON
				String driverCodeJson = "{"
						+ "\"java\":\"import java.util.*;\\nimport java.io.*;\\n\\n// {{USER_CODE}}\\n\\npublic class Main {\\n    public static void main(String[] args) {\\n        Scanner sc = new Scanner(System.in);\\n        if (!sc.hasNextInt()) return;\\n        int n = sc.nextInt();\\n        int[] nums = new int[n];\\n        for (int i = 0; i < n; i++) {\\n            nums[i] = sc.nextInt();\\n        }\\n        int target = sc.nextInt();\\n        Solution solver = new Solution();\\n        int[] result = solver.twoSum(nums, target);\\n        System.out.println(result[0] + \\\" \\\" + result[1]);\\n    }\\n}\","
						+ "\"python3\":\"import sys\\n\\n# {{USER_CODE}}\\n\\ndef main():\\n    input_data = sys.stdin.read().split()\\n    if not input_data:\\n        return\\n    n = int(input_data[0])\\n    nums = [int(x) for x in input_data[1:n+1]]\\n    target = int(input_data[n+1])\\n    \\n    sol = Solution()\\n    res = sol.twoSum(nums, target)\\n    print(f\\\"{res[0]} {res[1]}\\\")\\n\\nif __name__ == '__main__':\\n    main()\","
						+ "\"cpp\":\"#include <iostream>\\n#include <vector>\\n\\nusing namespace std;\\n\\n// {{USER_CODE}}\\n\\nint main() {\\n    int n;\\n    if (!(cin >> n)) return 0;\\n    vector<int> nums(n);\\n    for (int i = 0; i < n; i++) cin >> nums[i];\\n    int target;\\n    cin >> target;\\n    Solution sol;\\n    vector<int> res = sol.twoSum(nums, target);\\n    cout << res[0] << \\\" \\\" << res[1] << endl;\\n    return 0;\\n}\","
						+ "\"nodejs\":\"const fs = require('fs');\\n\\n// {{USER_CODE}}\\n\\nfunction main() {\\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\\\s+/);\\n    if (input.length < 2) return;\\n    const n = parseInt(input[0]);\\n    const nums = [];\\n    for (let i = 0; i < n; i++) {\\n        nums.push(parseInt(input[i + 1]));\\n    }\\n    const target = parseInt(input[n + 1]);\\n    const sol = new Solution();\\n    const res = sol.twoSum(nums, target);\\n    console.log(res[0] + \\\" \\\" + res[1]);\\n}\\nmain();\""
						+ "}";
				q.setDriverCode(driverCodeJson);
				
				Question saved = questionRepository.save(q);

				// Add a public test case
				TestCase tc1 = new TestCase();
				tc1.setQuestion(saved);
				tc1.setInput("4\n2 7 11 15\n9");
				tc1.setExpectedOutput("0 1");
				tc1.setHidden(false);
				tc1.setExplanation("Because nums[0] + nums[1] == 9, we return [0, 1].");
				testCaseRepository.save(tc1);

				// Add another public testcase
				TestCase tc2 = new TestCase();
				tc2.setQuestion(saved);
				tc2.setInput("3\n3 2 4\n6");
				tc2.setExpectedOutput("1 2");
				tc2.setHidden(false);
				tc2.setExplanation("Because nums[1] + nums[2] == 6, we return [1, 2].");
				testCaseRepository.save(tc2);

				// Add a hidden testcase
				TestCase tc3 = new TestCase();
				tc3.setQuestion(saved);
				tc3.setInput("2\n3 3\n6");
				tc3.setExpectedOutput("0 1");
				tc3.setHidden(true);
				testCaseRepository.save(tc3);
				
				logger.info("Successfully seeded Two Sum (LeetCode Style) question.");
			}
		};
	}
}
