# TechCodeSolution - Programming Questions Reference (Example.md)

This file contains **10 programming questions** structured exactly for the **TechCodeSolution** platform. 
Each question contains its metadata, description, public/hidden test cases, escaped JSON strings for the admin panel, and solutions in five languages (Java, C++, C, Python, JavaScript).

---

## Question 1: Palindrome Number

- **Difficulty**: `EASY`
- **Type**: `program`
- **Tags**: `math,basic`

### Description
Given an integer x, return true if x is a palindrome, and false otherwise.

An integer is a palindrome when it reads the same backward as forward. For example, 121 is a palindrome while 123 is not.

### Constraints
```
-2^31 <= x <= 2^31 - 1
```

### Input Format
A single line containing the integer x.

### Output Format
Print true if x is a palindrome, and false otherwise.

### JSON Fields (For Admin Panel Copy-Paste)

#### Boilerplates (Copy into 'Boilerplates (JSON Map)'):
```json
{
  "java": "class Solution {\n    public boolean isPalindrome(int x) {\n        \n    }\n}",
  "cpp": "class Solution {\npublic:\n    bool isPalindrome(int x) {\n        \n    }\n};",
  "c": "#include <stdbool.h>\n\nbool isPalindrome(int x) {\n    \n}",
  "python": "class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        ",
  "javascript": "class Solution {\n    isPalindrome(x) {\n        \n    }\n}"
}
```

#### Driver Code (Copy into 'Driver Code (JSON Map)'):
```json
{
  "java": "import java.util.Scanner;\n\n// {{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int x = sc.nextInt();\n            Solution solver = new Solution();\n            System.out.println(solver.isPalindrome(x));\n        }\n    }\n}",
  "cpp": "#include <iostream>\nusing namespace std;\n\n// {{USER_CODE}}\n\nint main() {\n    int x;\n    if (cin >> x) {\n        Solution sol;\n        cout << (sol.isPalindrome(x) ? \"true\" : \"false\") << endl;\n    }\n    return 0;\n}",
  "c": "#include <stdio.h>\n#include <stdbool.h>\n\n// {{USER_CODE}}\n\nint main() {\n    int x;\n    if (scanf(\"%d\", &x) == 1) {\n        printf(\"%s\\n\", isPalindrome(x) ? \"true\" : \"false\");\n    }\n    return 0;\n}",
  "python3": "import sys\n\n// {{USER_CODE}}\n\ndef main():\n    lines = sys.stdin.read().split()\n    if not lines:\n        return\n    x = int(lines[0])\n    sol = Solution()\n    print(str(sol.isPalindrome(x)).lower())\n\nif __name__ == '__main__':\n    main()",
  "nodejs": "const fs = require('fs');\n\n// {{USER_CODE}}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === \"\") return;\n    const x = parseInt(input[0]);\n    const sol = new Solution();\n    console.log(sol.isPalindrome(x).toString());\n}\nmain();"
}
```

### Test Cases

#### Test Case 1 (Public)
- **Input**:
```
121
```
- **Expected Output**:
```
true
```
- **Explanation**: 121 reads as 121 from left to right and from right to left.

#### Test Case 2 (Public)
- **Input**:
```
-121
```
- **Expected Output**:
```
false
```
- **Explanation**: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.

#### Test Case 3 (Public)
- **Input**:
```
10
```
- **Expected Output**:
```
false
```
- **Explanation**: Reads 01 from right to left. Therefore it is not a palindrome.

#### Test Case 4 (Hidden)
- **Input**:
```
0
```
- **Expected Output**:
```
true
```
- **Explanation**: 0 reads the same backwards.

#### Test Case 5 (Hidden)
- **Input**:
```
12321
```
- **Expected Output**:
```
true
```
- **Explanation**: 12321 is symmetric.

### Solutions

#### Java Solution
```java
class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0) return false;
        int temp = x;
        long rev = 0;
        while (temp > 0) {
            rev = rev * 10 + (temp % 10);
            temp /= 10;
        }
        return rev == x;
    }
}
```

#### C++ Solution
```cpp
class Solution {
public:
    bool isPalindrome(int x) {
        if (x < 0) return false;
        long temp = x;
        long rev = 0;
        while (temp > 0) {
            rev = rev * 10 + (temp % 10);
            temp /= 10;
        }
        return rev == x;
    }
};
```

#### C Solution
```c
#include <stdbool.h>

bool isPalindrome(int x) {
    if (x < 0) return false;
    long temp = x;
    long rev = 0;
    while (temp > 0) {
        rev = rev * 10 + (temp % 10);
        temp /= 10;
    }
    return rev == x;
}
```

#### Python Solution
```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0:
            return False
        s = str(x)
        return s == s[::-1]
```

#### JavaScript Solution
```javascript
class Solution {
    isPalindrome(x) {
        if (x < 0) return false;
        const s = x.toString();
        return s === s.split('').reverse().join('');
    }
}
```

---

## Question 2: Fizz Buzz

- **Difficulty**: `EASY`
- **Type**: `program`
- **Tags**: `basic,string`

### Description
Given an integer n, return a space-separated sequence of strings from 1 to n where:
- Output 'Fizz' if divisible by 3
- Output 'Buzz' if divisible by 5
- Output 'FizzBuzz' if divisible by both 3 and 5
- Output the number itself as a string otherwise.

### Constraints
```
1 <= n <= 10^4
```

### Input Format
A single line containing the integer n.

### Output Format
Print the sequence of strings separated by spaces.

### JSON Fields (For Admin Panel Copy-Paste)

#### Boilerplates (Copy into 'Boilerplates (JSON Map)'):
```json
{
  "java": "import java.util.List;\n\nclass Solution {\n    public List<String> fizzBuzz(int n) {\n        \n    }\n}",
  "cpp": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<string> fizzBuzz(int n) {\n        \n    }\n};",
  "c": "#include <stdio.h>\n\nvoid fizzBuzz(int n) {\n    \n}",
  "python": "class Solution:\n    def fizzBuzz(self, n: int) -> list[str]:\n        ",
  "javascript": "class Solution {\n    fizzBuzz(n) {\n        \n    }\n}"
}
```

#### Driver Code (Copy into 'Driver Code (JSON Map)'):
```json
{
  "java": "import java.util.*;\n\n// {{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            Solution solver = new Solution();\n            List<String> res = solver.fizzBuzz(n);\n            System.out.println(String.join(\" \", res));\n        }\n    }\n}",
  "cpp": "#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\n// {{USER_CODE}}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        Solution sol;\n        vector<string> res = sol.fizzBuzz(n);\n        for (int i = 0; i < res.size(); i++) {\n            cout << res[i] << (i == res.size() - 1 ? \"\" : \" \");\n        }\n        cout << endl;\n    }\n    return 0;\n}",
  "c": "#include <stdio.h>\n\n// {{USER_CODE}}\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) == 1) {\n        fizzBuzz(n);\n        printf(\"\\n\");\n    }\n    return 0;\n}",
  "python3": "import sys\n\n// {{USER_CODE}}\n\ndef main():\n    lines = sys.stdin.read().split()\n    if not lines:\n        return\n    n = int(lines[0])\n    sol = Solution()\n    res = sol.fizzBuzz(n)\n    print(\" \".join(res))\n\nif __name__ == '__main__':\n    main()",
  "nodejs": "const fs = require('fs');\n\n// {{USER_CODE}}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === \"\") return;\n    const n = parseInt(input[0]);\n    const sol = new Solution();\n    const res = sol.fizzBuzz(n);\n    console.log(res.join(\" \"));\n}\nmain();"
}
```

### Test Cases

#### Test Case 1 (Public)
- **Input**:
```
3
```
- **Expected Output**:
```
1 2 Fizz
```
- **Explanation**: 1 is not divisible by 3 or 5. 2 is not. 3 is divisible by 3, so 'Fizz'.

#### Test Case 2 (Public)
- **Input**:
```
5
```
- **Expected Output**:
```
1 2 Fizz 4 Buzz
```
- **Explanation**: At 3 we output 'Fizz' and at 5 we output 'Buzz'.

#### Test Case 3 (Public)
- **Input**:
```
15
```
- **Expected Output**:
```
1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz
```
- **Explanation**: At 15, we output 'FizzBuzz' since 15 is divisible by both 3 and 5.

#### Test Case 4 (Hidden)
- **Input**:
```
1
```
- **Expected Output**:
```
1
```
- **Explanation**: Simple boundary condition.

### Solutions

#### Java Solution
```java
import java.util.*;

class Solution {
    public List<String> fizzBuzz(int n) {
        List<String> result = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            if (i % 3 == 0 && i % 5 == 0) {
                result.add("FizzBuzz");
            } else if (i % 3 == 0) {
                result.add("Fizz");
            } else if (i % 5 == 0) {
                result.add("Buzz");
            } else {
                result.add(String.valueOf(i));
            }
        }
        return result;
    }
}
```

#### C++ Solution
```cpp
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    vector<string> fizzBuzz(int n) {
        vector<string> result;
        for (int i = 1; i <= n; i++) {
            if (i % 3 == 0 && i % 5 == 0) {
                result.push_back("FizzBuzz");
            } else if (i % 3 == 0) {
                result.push_back("Fizz");
            } else if (i % 5 == 0) {
                result.push_back("Buzz");
            } else {
                result.push_back(to_string(i));
            }
        }
        return result;
    }
};
```

#### C Solution
```c
#include <stdio.h>

void fizzBuzz(int n) {
    for (int i = 1; i <= n; i++) {
        if (i % 3 == 0 && i % 5 == 0) {
            printf("FizzBuzz");
        } else if (i % 3 == 0) {
            printf("Fizz");
        } else if (i % 5 == 0) {
            printf("Buzz");
        } else {
            printf("%d", i);
        }
        if (i < n) printf(" ");
    }
}
```

#### Python Solution
```python
class Solution:
    def fizzBuzz(self, n: int) -> list[str]:
        res = []
        for i in range(1, n + 1):
            if i % 3 == 0 and i % 5 == 0:
                res.append("FizzBuzz")
            elif i % 3 == 0:
                res.append("Fizz")
            elif i % 5 == 0:
                res.append("Buzz")
            else:
                res.append(str(i))
        return res,

```

#### JavaScript Solution
```javascript
class Solution {
    fizzBuzz(n) {
        const res = [];
        for (let i = 1; i <= n; i++) {
            if (i % 3 === 0 && i % 5 === 0) {
                res.push("FizzBuzz");
            } else if (i % 3 === 0) {
                res.push("Fizz");
            } else if (i % 5 === 0) {
                res.push("Buzz");
            } else {
                res.push(i.toString());
            }
        }
        return res;
    }
}
```

---

## Question 3: Fibonacci Number

- **Difficulty**: `EASY`
- **Type**: `program`
- **Tags**: `recursion,math`

### Description
Calculate the N-th Fibonacci number.
The Fibonacci sequence F(n) is defined by:
- F(0) = 0
- F(1) = 1
- F(n) = F(n-1) + F(n-2) for n > 1

Given n, return F(n).

### Constraints
```
0 <= n <= 30
```

### Input Format
A single line containing the integer n.

### Output Format
Print the N-th Fibonacci number.

### JSON Fields (For Admin Panel Copy-Paste)

#### Boilerplates (Copy into 'Boilerplates (JSON Map)'):
```json
{
  "java": "class Solution {\n    public int fib(int n) {\n        \n    }\n}",
  "cpp": "class Solution {\npublic:\n    int fib(int n) {\n        \n    }\n};",
  "c": "int fib(int n) {\n    \n}",
  "python": "class Solution:\n    def fib(self, n: int) -> int:\n        ",
  "javascript": "class Solution {\n    fib(n) {\n        \n    }\n}"
}
```

#### Driver Code (Copy into 'Driver Code (JSON Map)'):
```json
{
  "java": "import java.util.Scanner;\n\n// {{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            Solution solver = new Solution();\n            System.out.println(solver.fib(n));\n        }\n    }\n}",
  "cpp": "#include <iostream>\nusing namespace std;\n\n// {{USER_CODE}}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        Solution sol;\n        cout << sol.fib(n) << endl;\n    }\n    return 0;\n}",
  "c": "#include <stdio.h>\n\n// {{USER_CODE}}\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) == 1) {\n        printf(\"%d\\n\", fib(n));\n    }\n    return 0;\n}",
  "python3": "import sys\n\n// {{USER_CODE}}\n\ndef main():\n    lines = sys.stdin.read().split()\n    if not lines:\n        return\n    n = int(lines[0])\n    sol = Solution()\n    print(sol.fib(n))\n\nif __name__ == '__main__':\n    main()",
  "nodejs": "const fs = require('fs');\n\n// {{USER_CODE}}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === \"\") return;\n    const n = parseInt(input[0]);\n    const sol = new Solution();\n    console.log(sol.fib(n));\n}\nmain();"
}
```

### Test Cases

#### Test Case 1 (Public)
- **Input**:
```
2
```
- **Expected Output**:
```
1
```
- **Explanation**: F(2) = F(1) + F(0) = 1 + 0 = 1.

#### Test Case 2 (Public)
- **Input**:
```
3
```
- **Expected Output**:
```
2
```
- **Explanation**: F(3) = F(2) + F(1) = 1 + 1 = 2.

#### Test Case 3 (Public)
- **Input**:
```
4
```
- **Expected Output**:
```
3
```
- **Explanation**: F(4) = F(3) + F(2) = 2 + 1 = 3.

#### Test Case 4 (Hidden)
- **Input**:
```
0
```
- **Expected Output**:
```
0
```
- **Explanation**: Boundary value F(0).

#### Test Case 5 (Hidden)
- **Input**:
```
10
```
- **Expected Output**:
```
55
```
- **Explanation**: F(10) is 55.

### Solutions

#### Java Solution
```java
class Solution {
    public int fib(int n) {
        if (n <= 1) return n;
        int a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}
```

#### C++ Solution
```cpp
class Solution {
public:
    int fib(int n) {
        if (n <= 1) return n;
        int a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
};
```

#### C Solution
```c
int fib(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}
```

#### Python Solution
```python
class Solution:
    def fib(self, n: int) -> int:
        if n <= 1:
            return n
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        return b
```

#### JavaScript Solution
```javascript
class Solution {
    fib(n) {
        if (n <= 1) return n;
        let a = 0, b = 1;
        for (let i = 2; i <= n; i++) {
            let c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}
```

---

## Question 4: Valid Anagram

- **Difficulty**: `EASY`
- **Type**: `program`
- **Tags**: `string,hashmap`

### Description
Given two strings s and t, return true if t is an anagram of s, and false otherwise.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

### Constraints
```
1 <= s.length, t.length <= 5 * 10^4
s and t consist of lowercase English letters.
```

### Input Format
Two lines: the first line contains string s, and the second line contains string t.

### Output Format
Print true if t is an anagram of s, and false otherwise.

### JSON Fields (For Admin Panel Copy-Paste)

#### Boilerplates (Copy into 'Boilerplates (JSON Map)'):
```json
{
  "java": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        \n    }\n}",
  "cpp": "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        \n    }\n};",
  "c": "#include <stdbool.h>\n\nbool isAnagram(char* s, char* t) {\n    \n}",
  "python": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        ",
  "javascript": "class Solution {\n    isAnagram(s, t) {\n        \n    }\n}"
}
```

#### Driver Code (Copy into 'Driver Code (JSON Map)'):
```json
{
  "java": "import java.util.Scanner;\n\n// {{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine().trim() : \"\";\n        String t = sc.hasNextLine() ? sc.nextLine().trim() : \"\";\n        Solution solver = new Solution();\n        System.out.println(solver.isAnagram(s, t));\n    }\n}",
  "cpp": "#include <iostream>\n#include <string>\nusing namespace std;\n\n// {{USER_CODE}}\n\nint main() {\n    string s, t;\n    if (getline(cin, s) && getline(cin, t)) {\n        Solution sol;\n        cout << (sol.isAnagram(s, t) ? \"true\" : \"false\") << endl;\n    }\n    return 0;\n}",
  "c": "#include <stdio.h>\n#include <string.h>\n#include <stdbool.h>\n\n// {{USER_CODE}}\n\nint main() {\n    char s[60000];\n    char t[60000];\n    if (fgets(s, sizeof(s), stdin) && fgets(t, sizeof(t), stdin)) {\n        s[strcspn(s, \"\\r\\n\")] = 0;\n        t[strcspn(t, \"\\r\\n\")] = 0;\n        printf(\"%s\\n\", isAnagram(s, t) ? \"true\" : \"false\");\n    }\n    return 0;\n}",
  "python3": "import sys\n\n// {{USER_CODE}}\n\ndef main():\n    lines = sys.stdin.read().splitlines()\n    s = lines[0].strip() if len(lines) > 0 else \"\"\n    t = lines[1].strip() if len(lines) > 1 else \"\"\n    sol = Solution()\n    print(str(sol.isAnagram(s, t)).lower())\n\nif __name__ == '__main__':\n    main()",
  "nodejs": "const fs = require('fs');\n\n// {{USER_CODE}}\n\nfunction main() {\n    const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/);\n    const s = lines[0] ? lines[0].trim() : \"\";\n    const t = lines[1] ? lines[1].trim() : \"\";\n    const sol = new Solution();\n    console.log(sol.isAnagram(s, t).toString());\n}\nmain();"
}
```

### Test Cases

#### Test Case 1 (Public)
- **Input**:
```
anagram
nagaram
```
- **Expected Output**:
```
true
```
- **Explanation**: t can be formed by rearranging characters of s.

#### Test Case 2 (Public)
- **Input**:
```
rat
car
```
- **Expected Output**:
```
false
```
- **Explanation**: 'r' and 'a' match, but 't' and 'c' do not.

#### Test Case 3 (Hidden)
- **Input**:
```
a
a
```
- **Expected Output**:
```
true
```
- **Explanation**: Single character matching.

#### Test Case 4 (Hidden)
- **Input**:
```
ab
ba
```
- **Expected Output**:
```
true
```
- **Explanation**: Two character matching anagram.

### Solutions

#### Java Solution
```java
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] counts = new int[26];
        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i) - 'a']++;
            counts[t.charAt(i) - 'a']--;
        }
        for (int c : counts) {
            if (c != 0) return false;
        }
        return true;
    }
}
```

#### C++ Solution
```cpp
class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.length() != t.length()) return false;
        int counts[26] = {0};
        for (int i = 0; i < s.length(); i++) {
            counts[s[i] - 'a']++;
            counts[t[i] - 'a']--;
        }
        for (int i = 0; i < 26; i++) {
            if (counts[i] != 0) return false;
        }
        return true;
    }
};
```

#### C Solution
```c
#include <stdbool.h>
#include <string.h>

bool isAnagram(char* s, char* t) {
    int lenS = strlen(s);
    int lenT = strlen(t);
    if (lenS != lenT) return false;
    int counts[26] = {0};
    for (int i = 0; i < lenS; i++) {
        counts[s[i] - 'a']++;
        counts[t[i] - 'a']--;
    }
    for (int i = 0; i < 26; i++) {
        if (counts[i] != 0) return false;
    }
    return true;
}
```

#### Python Solution
```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        counts = [0] * 26
        for c1, c2 in zip(s, t):
            counts[ord(c1) - ord('a')] += 1
            counts[ord(c2) - ord('a')] -= 1
        return all(c == 0 for c in counts)
```

#### JavaScript Solution
```javascript
class Solution {
    isAnagram(s, t) {
        if (s.length !== t.length) return false;
        const counts = {};
        for (let i = 0; i < s.length; i++) {
            counts[s[i]] = (counts[s[i]] || 0) + 1;
            counts[t[i]] = (counts[t[i]] || 0) - 1;
        }
        for (let key in counts) {
            if (counts[key] !== 0) return false;
        }
        return true;
    }
}
```

---

## Question 5: Search Insert Position

- **Difficulty**: `EASY`
- **Type**: `program`
- **Tags**: `array,binary-search`

### Description
Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You must write an algorithm with O(log n) runtime complexity.

### Constraints
```
1 <= nums.length <= 10^4
-10^4 <= nums[i] <= 10^4
nums contains distinct values sorted in ascending order.
-10^4 <= target <= 10^4
```

### Input Format
The first line contains n (array size) and target.
The second line contains n space-separated integers representing the sorted array.

### Output Format
Print the index of the target or the index where it should be inserted.

### JSON Fields (For Admin Panel Copy-Paste)

#### Boilerplates (Copy into 'Boilerplates (JSON Map)'):
```json
{
  "java": "class Solution {\n    public int searchInsert(int[] nums, int target) {\n        \n    }\n}",
  "cpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        \n    }\n};",
  "c": "int searchInsert(int* nums, int numsSize, int target) {\n    \n}",
  "python": "class Solution:\n    def searchInsert(self, nums: list[int], target: int) -> int:\n        ",
  "javascript": "class Solution {\n    searchInsert(nums, target) {\n        \n    }\n}"
}
```

#### Driver Code (Copy into 'Driver Code (JSON Map)'):
```json
{
  "java": "import java.util.Scanner;\n\n// {{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int target = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) {\n            nums[i] = sc.nextInt();\n        }\n        Solution solver = new Solution();\n        System.out.println(solver.searchInsert(nums, target));\n    }\n}",
  "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\n// {{USER_CODE}}\n\nint main() {\n    int n, target;\n    if (cin >> n >> target) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) cin >> nums[i];\n        Solution sol;\n        cout << sol.searchInsert(nums, target) << endl;\n    }\n    return 0;\n}",
  "c": "#include <stdio.h>\n#include <stdlib.h>\n\n// {{USER_CODE}}\n\nint main() {\n    int n, target;\n    if (scanf(\"%d %d\", &n, &target) == 2) {\n        int* nums = (int*)malloc(sizeof(int) * n);\n        for (int i = 0; i < n; i++) {\n            if (scanf(\"%d\", &nums[i]) != 1) break;\n        }\n        printf(\"%d\\n\", searchInsert(nums, n, target));\n        free(nums);\n    }\n    return 0;\n}",
  "python3": "import sys\n\n// {{USER_CODE}}\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    target = int(input_data[1])\n    nums = [int(x) for x in input_data[2:n+2]]\n    sol = Solution()\n    print(sol.searchInsert(nums, target))\n\nif __name__ == '__main__':\n    main()",
  "nodejs": "const fs = require('fs');\n\n// {{USER_CODE}}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length < 2 || input[0] === \"\") return;\n    const n = parseInt(input[0]);\n    const target = parseInt(input[1]);\n    const nums = [];\n    for (let i = 0; i < n; i++) {\n        nums.push(parseInt(input[i + 2]));\n    }\n    const sol = new Solution();\n    console.log(sol.searchInsert(nums, target));\n}\nmain();"
}
```

### Test Cases

#### Test Case 1 (Public)
- **Input**:
```
4 5
1 3 5 6
```
- **Expected Output**:
```
2
```
- **Explanation**: Target 5 is found at index 2.

#### Test Case 2 (Public)
- **Input**:
```
4 2
1 3 5 6
```
- **Expected Output**:
```
1
```
- **Explanation**: Target 2 is not found, should be inserted at index 1 to maintain order.

#### Test Case 3 (Public)
- **Input**:
```
4 7
1 3 5 6
```
- **Expected Output**:
```
4
```
- **Explanation**: Target 7 is larger than all elements, goes to index 4 (end).

#### Test Case 4 (Hidden)
- **Input**:
```
4 0
1 3 5 6
```
- **Expected Output**:
```
0
```
- **Explanation**: Target 0 goes to index 0.

### Solutions

#### Java Solution
```java
class Solution {
    public int searchInsert(int[] nums, int target) {
        int low = 0, high = nums.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return low;
    }
}
```

#### C++ Solution
```cpp
class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int low = 0, high = nums.size() - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return low;
    }
};
```

#### C Solution
```c
int searchInsert(int* nums, int numsSize, int target) {
    int low = 0, high = numsSize - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return low;
}
```

#### Python Solution
```python
class Solution:
    def searchInsert(self, nums: list[int], target: int) -> int:
        low, high = 0, len(nums) - 1
        while low <= high:
            mid = (low + high) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                low = mid + 1
            else:
                high = mid - 1
        return low
```

#### JavaScript Solution
```javascript
class Solution {
    searchInsert(nums, target) {
        let low = 0, high = nums.length - 1;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (nums[mid] === target) return mid;
            else if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return low;
    }
}
```

---

## Question 6: Reverse Words in a String

- **Difficulty**: `MEDIUM`
- **Type**: `program`
- **Tags**: `string,two-pointers`

### Description
Given an input string s, reverse the order of the words.

A word is defined as a sequence of non-space characters. The words in s will be separated by at least one space.

Return a string of the words in reverse order concatenated by a single space.

Note that s may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words. Do not include any extra spaces.

### Constraints
```
1 <= s.length <= 10^4
s contains English letters (upper-case and lower-case), digits, and spaces.
```

### Input Format
A single line containing the string s.

### Output Format
Print the reversed words separated by a single space.

### JSON Fields (For Admin Panel Copy-Paste)

#### Boilerplates (Copy into 'Boilerplates (JSON Map)'):
```json
{
  "java": "class Solution {\n    public String reverseWords(String s) {\n        \n    }\n}",
  "cpp": "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string reverseWords(string s) {\n        \n    }\n};",
  "c": "void reverseWords(char* s, char* result) {\n    \n}",
  "python": "class Solution:\n    def reverseWords(self, s: str) -> str:\n        ",
  "javascript": "class Solution {\n    reverseWords(s) {\n        \n    }\n}"
}
```

#### Driver Code (Copy into 'Driver Code (JSON Map)'):
```json
{
  "java": "import java.util.Scanner;\n\n// {{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLine()) {\n            String s = sc.nextLine();\n            Solution solver = new Solution();\n            System.out.println(solver.reverseWords(s));\n        }\n    }\n}",
  "cpp": "#include <iostream>\n#include <string>\nusing namespace std;\n\n// {{USER_CODE}}\n\nint main() {\n    string s;\n    if (getline(cin, s)) {\n        Solution sol;\n        cout << sol.reverseWords(s) << endl;\n    }\n    return 0;\n}",
  "c": "#include <stdio.h>\n#include <string.h>\n\n// {{USER_CODE}}\n\nint main() {\n    char s[20000];\n    char result[20000] = {0};\n    if (fgets(s, sizeof(s), stdin)) {\n        s[strcspn(s, \"\\r\\n\")] = 0;\n        reverseWords(s, result);\n        printf(\"%s\\n\", result);\n    }\n    return 0;\n}",
  "python3": "import sys\n\n// {{USER_CODE}}\n\ndef main():\n    s = sys.stdin.read().strip()\n    sol = Solution()\n    print(sol.reverseWords(s))\n\nif __name__ == '__main__':\n    main()",
  "nodejs": "const fs = require('fs');\n\n// {{USER_CODE}}\n\nfunction main() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    const sol = new Solution();\n    console.log(sol.reverseWords(s));\n}\nmain();"
}
```

### Test Cases

#### Test Case 1 (Public)
- **Input**:
```
the sky is blue
```
- **Expected Output**:
```
blue is sky the
```
- **Explanation**: Simply reverse the words sequence.

#### Test Case 2 (Public)
- **Input**:
```
  hello world  
```
- **Expected Output**:
```
world hello
```
- **Explanation**: Remove leading/trailing spaces and reverse.

#### Test Case 3 (Public)
- **Input**:
```
a good   example
```
- **Expected Output**:
```
example good a
```
- **Explanation**: Reduce multiple spaces to a single space.

#### Test Case 4 (Hidden)
- **Input**:
```
singleword
```
- **Expected Output**:
```
singleword
```
- **Explanation**: Single word returns as-is.

### Solutions

#### Java Solution
```java
class Solution {
    public String reverseWords(String s) {
        String[] words = s.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = words.length - 1; i >= 0; i--) {
            sb.append(words[i]);
            if (i > 0) sb.append(" ");
        }
        return sb.toString();
    }
}
```

#### C++ Solution
```cpp
#include <string>
#include <sstream>
#include <vector>
using namespace std;

class Solution {
public:
    string reverseWords(string s) {
        stringstream ss(s);
        string word;
        vector<string> words;
        while (ss >> word) {
            words.push_back(word);
        }
        string res = "";
        for (int i = words.size() - 1; i >= 0; i--) {
            res += words[i];
            if (i > 0) res += " ";
        }
        return res;
    }
};
```

#### C Solution
```c
#include <string.h>

void reverseWords(char* s, char* result) {
    char* words[1000];
    int count = 0;
    char* token = strtok(s, " ");
    while (token != NULL) {
        words[count++] = token;
        token = strtok(NULL, " ");
    }
    for (int i = count - 1; i >= 0; i--) {
        strcat(result, words[i]);
        if (i > 0) {
            strcat(result, " ");
        }
    }
}
```

#### Python Solution
```python
class Solution:
    def reverseWords(self, s: str) -> str:
        return " ".join(s.split()[::-1])
```

#### JavaScript Solution
```javascript
class Solution {
    reverseWords(s) {
        return s.trim().split(/\s+/).reverse().join(' ');
    }
}
```

---

## Question 7: Longest Substring Without Repeating Characters

- **Difficulty**: `MEDIUM`
- **Type**: `program`
- **Tags**: `string,sliding-window`

### Description
Given a string s, find the length of the longest substring without repeating characters.

### Constraints
```
0 <= s.length <= 5 * 10^4
s consists of English letters, digits, symbols and spaces.
```

### Input Format
A single line containing the string s (could be empty).

### Output Format
Print an integer representing the length of the longest non-repeating substring.

### JSON Fields (For Admin Panel Copy-Paste)

#### Boilerplates (Copy into 'Boilerplates (JSON Map)'):
```json
{
  "java": "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}",
  "cpp": "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};",
  "c": "int lengthOfLongestSubstring(char* s) {\n    \n}",
  "python": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        ",
  "javascript": "class Solution {\n    lengthOfLongestSubstring(s) {\n        \n    }\n}"
}
```

#### Driver Code (Copy into 'Driver Code (JSON Map)'):
```json
{
  "java": "import java.util.Scanner;\n\n// {{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine() : \"\";\n        Solution solver = new Solution();\n        System.out.println(solver.lengthOfLongestSubstring(s));\n    }\n}",
  "cpp": "#include <iostream>\n#include <string>\nusing namespace std;\n\n// {{USER_CODE}}\n\nint main() {\n    string s;\n    getline(cin, s);\n    Solution sol;\n    cout << sol.lengthOfLongestSubstring(s) << endl;\n    return 0;\n}",
  "c": "#include <stdio.h>\n#include <string.h>\n\n// {{USER_CODE}}\n\nint main() {\n    char s[60000];\n    if (fgets(s, sizeof(s), stdin)) {\n        s[strcspn(s, \"\\r\\n\")] = 0;\n        printf(\"%d\\n\", lengthOfLongestSubstring(s));\n    } else {\n        printf(\"0\\n\");\n    }\n    return 0;\n}",
  "python3": "import sys\n\n// {{USER_CODE}}\n\ndef main():\n    s = sys.stdin.read()\n    if s.endsWith('\\n'):\n        s = s.slice(0, -1)\n    if s.endsWith('\\r'):\n        s = s.slice(0, -1)\n    sol = Solution()\n    print(sol.lengthOfLongestSubstring(s))\n\nif __name__ == '__main__':\n    main()",
  "nodejs": "const fs = require('fs');\n\n// {{USER_CODE}}\n\nfunction main() {\n    let s = fs.readFileSync(0, 'utf-8');\n    if (s.endsWith('\\n')) s = s.slice(0, -1);\n    if (s.endsWith('\\r')) s = s.slice(0, -1);\n    const sol = new Solution();\n    console.log(sol.lengthOfLongestSubstring(s));\n}\nmain();"
}
```

### Test Cases

#### Test Case 1 (Public)
- **Input**:
```
abcabcbb
```
- **Expected Output**:
```
3
```
- **Explanation**: The answer is 'abc', with the length of 3.

#### Test Case 2 (Public)
- **Input**:
```
bbbbb
```
- **Expected Output**:
```
1
```
- **Explanation**: The answer is 'b', with the length of 1.

#### Test Case 3 (Public)
- **Input**:
```
pwwkew
```
- **Expected Output**:
```
3
```
- **Explanation**: The answer is 'wke', with the length of 3. Note that the answer must be a substring, not a subsequence.

#### Test Case 4 (Hidden)
- **Input**:
```

```
- **Expected Output**:
```
0
```
- **Explanation**: An empty string returns 0.

### Solutions

#### Java Solution
```java
import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        int n = s.length(), ans = 0;
        Map<Character, Integer> map = new HashMap<>();
        for (int j = 0, i = 0; j < n; j++) {
            if (map.containsKey(s.charAt(j))) {
                i = Math.max(map.get(s.charAt(j)), i);
            }
            ans = Math.max(ans, j - i + 1);
            map.put(s.charAt(j), j + 1);
        }
        return ans;
    }
}
```

#### C++ Solution
```cpp
#include <unordered_map>
#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int n = s.length(), ans = 0;
        unordered_map<char, int> map;
        for (int j = 0, i = 0; j < n; j++) {
            if (map.count(s[j])) {
                i = max(map[s[j]], i);
            }
            ans = max(ans, j - i + 1);
            map[s[j]] = j + 1;
        }
        return ans;
    }
};
```

#### C Solution
```c
#include <string.h>

int lengthOfLongestSubstring(char* s) {
    int n = strlen(s);
    int ans = 0;
    int index[256];
    memset(index, -1, sizeof(index));
    int i = 0;
    for (int j = 0; j < n; j++) {
        if (index[(unsigned char)s[j]] >= i) {
            i = index[(unsigned char)s[j]] + 1;
        }
        int len = j - i + 1;
        if (len > ans) ans = len;
        index[(unsigned char)s[j]] = j;
    }
    return ans;
}
```

#### Python Solution
```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_map = {}
        left = 0
        max_len = 0
        for right in range(len(s)):
            if s[right] in char_map and char_map[s[right]] >= left:
                left = char_map[s[right]] + 1
            max_len = max(max_len, right - left + 1)
            char_map[s[right]] = right
        return max_len
```

#### JavaScript Solution
```javascript
class Solution {
    lengthOfLongestSubstring(s) {
        const map = new Map();
        let left = 0, maxLen = 0;
        for (let right = 0; right < s.length; right++) {
            if (map.has(s[right]) && map.get(s[right]) >= left) {
                left = map.get(s[right]) + 1;
            }
            maxLen = Math.max(maxLen, right - left + 1);
            map.set(s[right], right);
        }
        return maxLen;
    }
}
```

---

## Question 8: Container With Most Water

- **Difficulty**: `MEDIUM`
- **Type**: `program`
- **Tags**: `array,two-pointers`

### Description
You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

### Constraints
```
n == height.length
2 <= n <= 10^5
0 <= height[i] <= 10^4
```

### Input Format
The first line contains n (array size).
The second line contains n space-separated integers representing the height array.

### Output Format
Print an integer representing the maximum water container area.

### JSON Fields (For Admin Panel Copy-Paste)

#### Boilerplates (Copy into 'Boilerplates (JSON Map)'):
```json
{
  "java": "class Solution {\n    public int maxArea(int[] height) {\n        \n    }\n}",
  "cpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};",
  "c": "int maxArea(int* height, int heightSize) {\n    \n}",
  "python": "class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        ",
  "javascript": "class Solution {\n    maxArea(height) {\n        \n    }\n}"
}
```

#### Driver Code (Copy into 'Driver Code (JSON Map)'):
```json
{
  "java": "import java.util.Scanner;\n\n// {{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] height = new int[n];\n        for (int i = 0; i < n; i++) {\n            height[i] = sc.nextInt();\n        }\n        Solution solver = new Solution();\n        System.out.println(solver.maxArea(height));\n    }\n}",
  "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\n// {{USER_CODE}}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> height(n);\n        for (int i = 0; i < n; i++) cin >> height[i];\n        Solution sol;\n        cout << sol.maxArea(height) << endl;\n    }\n    return 0;\n}",
  "c": "#include <stdio.h>\n#include <stdlib.h>\n\n// {{USER_CODE}}\n\nint main() {\n    int n;\n    if (scanf(\"%d\", &n) == 1) {\n        int* height = (int*)malloc(sizeof(int) * n);\n        for (int i = 0; i < n; i++) {\n            if (scanf(\"%d\", &height[i]) != 1) break;\n        }\n        printf(\"%d\\n\", maxArea(height, n));\n        free(height);\n    }\n    return 0;\n}",
  "python3": "import sys\n\n// {{USER_CODE}}\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    height = [int(x) for x in input_data[1:n+1]]\n    sol = Solution()\n    print(sol.maxArea(height))\n\nif __name__ == '__main__':\n    main()",
  "nodejs": "const fs = require('fs');\n\n// {{USER_CODE}}\n\nfunction main() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length < 2 || input[0] === \"\") return;\n    const n = parseInt(input[0]);\n    const height = [];\n    for (let i = 0; i < n; i++) {\n        height.push(parseInt(input[i + 1]));\n    }\n    const sol = new Solution();\n    console.log(sol.maxArea(height));\n}\nmain();"
}
```

### Test Cases

#### Test Case 1 (Public)
- **Input**:
```
9
1 8 6 2 5 4 8 3 7
```
- **Expected Output**:
```
49
```
- **Explanation**: The maximum area is 49 (heights 8 at index 1 and 7 at index 8).

#### Test Case 2 (Public)
- **Input**:
```
2
1 1
```
- **Expected Output**:
```
1
```
- **Explanation**: Max area is min(1,1) * (1-0) = 1.

#### Test Case 3 (Hidden)
- **Input**:
```
5
4 3 2 1 4
```
- **Expected Output**:
```
16
```
- **Explanation**: Index 0 and index 4 both have height 4. Distance is 4, Area is 16.

### Solutions

#### Java Solution
```java
class Solution {
    public int maxArea(int[] height) {
        int maxArea = 0;
        int left = 0, right = height.length - 1;
        while (left < right) {
            int h = Math.min(height[left], height[right]);
            maxArea = Math.max(maxArea, h * (right - left));
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }
}
```

#### C++ Solution
```cpp
class Solution {
public:
    int maxArea(vector<int>& height) {
        int maxArea = 0;
        int left = 0, right = height.size() - 1;
        while (left < right) {
            int h = min(height[left], height[right]);
            maxArea = max(maxArea, h * (right - left));
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }
};
```

#### C Solution
```c
#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define MAX(a, b) ((a) > (b) ? (a) : (b))

int maxArea(int* height, int heightSize) {
    int maxArea = 0;
    int left = 0, right = heightSize - 1;
    while (left < right) {
        int h = MIN(height[left], height[right]);
        maxArea = MAX(maxArea, h * (right - left));
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxArea;
}
```

#### Python Solution
```python
class Solution:
    def maxArea(self, height: list[int]) -> int:
        max_area = 0
        left, right = 0, len(height) - 1
        while left < right:
            h = min(height[left], height[right])
            max_area = max(max_area, h * (right - left))
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        return max_area
```

#### JavaScript Solution
```javascript
class Solution {
    maxArea(height) {
        let maxArea = 0;
        let left = 0, right = height.length - 1;
        while (left < right) {
            const h = Math.min(height[left], height[right]);
            maxArea = Math.max(maxArea, h * (right - left));
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }
}
```

---

## Question 9: Longest Palindromic Substring

- **Difficulty**: `MEDIUM`
- **Type**: `program`
- **Tags**: `string,dynamic-programming`

### Description
Given a string s, return the longest palindromic substring in s.

### Constraints
```
1 <= s.length <= 1000
s consists of only digits and English letters.
```

### Input Format
A single line containing the string s.

### Output Format
Print the longest palindromic substring.

### JSON Fields (For Admin Panel Copy-Paste)

#### Boilerplates (Copy into 'Boilerplates (JSON Map)'):
```json
{
  "java": "class Solution {\n    public String longestPalindrome(String s) {\n        \n    }\n}",
  "cpp": "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string longestPalindrome(string s) {\n        \n    }\n};",
  "c": "void longestPalindrome(char* s, char* result) {\n    \n}",
  "python": "class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        ",
  "javascript": "class Solution {\n    longestPalindrome(s) {\n        \n    }\n}"
}
```

#### Driver Code (Copy into 'Driver Code (JSON Map)'):
```json
{
  "java": "import java.util.Scanner;\n\n// {{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLine()) {\n            String s = sc.nextLine().trim();\n            Solution solver = new Solution();\n            System.out.println(solver.longestPalindrome(s));\n        }\n    }\n}",
  "cpp": "#include <iostream>\n#include <string>\nusing namespace std;\n\n// {{USER_CODE}}\n\nint main() {\n    string s;\n    if (cin >> s) {\n        Solution sol;\n        cout << sol.longestPalindrome(s) << endl;\n    }\n    return 0;\n}",
  "c": "#include <stdio.h>\n#include <string.h>\n\n// {{USER_CODE}}\n\nint main() {\n    char s[2000];\n    char result[2000] = {0};\n    if (scanf(\"%1999s\", s) == 1) {\n        longestPalindrome(s, result);\n        printf(\"%s\\n\", result);\n    }\n    return 0;\n}",
  "python3": "import sys\n\n// {{USER_CODE}}\n\ndef main():\n    s = sys.stdin.read().strip()\n    sol = Solution()\n    print(sol.longestPalindrome(s))\n\nif __name__ == '__main__':\n    main()",
  "nodejs": "const fs = require('fs');\n\n// {{USER_CODE}}\n\nfunction main() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    const sol = new Solution();\n    console.log(sol.longestPalindrome(s));\n}\nmain();"
}
```

### Test Cases

#### Test Case 1 (Public)
- **Input**:
```
babad
```
- **Expected Output**:
```
bab
```
- **Explanation**: Note: 'aba' is also a valid answer. 'bab' is accepted.

#### Test Case 2 (Public)
- **Input**:
```
cbbd
```
- **Expected Output**:
```
bb
```
- **Explanation**: 'bb' is the longest palindrome substring.

#### Test Case 3 (Hidden)
- **Input**:
```
a
```
- **Expected Output**:
```
a
```
- **Explanation**: Single character is a palindrome.

#### Test Case 4 (Hidden)
- **Input**:
```
racecar
```
- **Expected Output**:
```
racecar
```
- **Explanation**: Full string is a palindrome.

### Solutions

#### Java Solution
```java
class Solution {
    public String longestPalindrome(String s) {
        if (s == null || s.length() < 1) return "";
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            int len1 = expandAroundCenter(s, i, i);
            int len2 = expandAroundCenter(s, i, i + 1);
            int len = Math.max(len1, len2);
            if (len > end - start) {
                start = i - (len - 1) / 2;
                end = i + len / 2;
            }
        }
        return s.substring(start, end + 1);
    }

    private int expandAroundCenter(String s, int left, int right) {
        int L = left, R = right;
        while (L >= 0 && R < s.length() && s.charAt(L) == s.charAt(R)) {
            L--;
            R++;
        }
        return R - L - 1;
    }
}
```

#### C++ Solution
```cpp
#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
    string longestPalindrome(string s) {
        if (s.empty()) return "";
        int start = 0, end = 0;
        auto expand = [&](int left, int right) {
            while (left >= 0 && right < s.length() && s[left] == s[right]) {
                left--;
                right++;
            }
            return right - left - 1;
        };
        for (int i = 0; i < s.length(); i++) {
            int len1 = expand(i, i);
            int len2 = expand(i, i + 1);
            int len = max(len1, len2);
            if (len > end - start) {
                start = i - (len - 1) / 2;
                end = i + len / 2;
            }
        }
        return s.substr(start, end - start + 1);
    }
};
```

#### C Solution
```c
#include <string.h>

void longestPalindrome(char* s, char* result) {
    int len = strlen(s);
    if (len == 0) return;
    int start = 0, maxLen = 1;
    for (int i = 0; i < len; i++) {
        int l = i, r = i;
        while (l >= 0 && r < len && s[l] == s[r]) {
            if (r - l + 1 > maxLen) {
                start = l;
                maxLen = r - l + 1;
            }
            l--;
            r++;
        }
        l = i, r = i + 1;
        while (l >= 0 && r < len && s[l] == s[r]) {
            if (r - l + 1 > maxLen) {
                start = l;
                maxLen = r - l + 1;
            }
            l--;
            r++;
        }
    }
    strncpy(result, s + start, maxLen);
    result[maxLen] = '\0';
}
```

#### Python Solution
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        if not s:
            return ""
        start, end = 0, 0
        def expand(left, right):
            while left >= 0 and right < len(s) and s[left] == s[right]:
                left -= 1
                right += 1
            return right - left - 1
        for i in range(len(s)):
            len1 = expand(i, i)
            len2 = expand(i, i + 1)
            length = max(len1, len2)
            if length > end - start:
                start = i - (length - 1) // 2
                end = i + length // 2
        return s[start:end + 1]
```

#### JavaScript Solution
```javascript
class Solution {
    longestPalindrome(s) {
        if (!s || s.length < 1) return "";
        let start = 0, end = 0;
        const expand = (left, right) => {
            while (left >= 0 && right < s.length && s[left] === s[right]) {
                left--;
                right++;
            }
            return right - left - 1;
        };
        for (let i = 0; i < s.length; i++) {
            const len1 = expand(i, i);
            const len2 = expand(i, i + 1);
            const len = Math.max(len1, len2);
            if (len > end - start) {
                start = i - Math.floor((len - 1) / 2);
                end = i + Math.floor(len / 2);
            }
        }
        return s.substring(start, end + 1);
    }
}
```

---

## Question 10: Edit Distance

- **Difficulty**: `HARD`
- **Type**: `program`
- **Tags**: `string,dynamic-programming`

### Description
Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.

You have the following three operations permitted on a word:
1. Insert a character
2. Delete a character
3. Replace a character

### Constraints
```
0 <= word1.length, word2.length <= 500
word1 and word2 consist of lowercase English letters.
```

### Input Format
Two lines: the first line contains word1, and the second line contains word2.

### Output Format
Print the minimum operations as an integer.

### JSON Fields (For Admin Panel Copy-Paste)

#### Boilerplates (Copy into 'Boilerplates (JSON Map)'):
```json
{
  "java": "class Solution {\n    public int minDistance(String word1, String word2) {\n        \n    }\n}",
  "cpp": "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        \n    }\n};",
  "c": "int minDistance(char* word1, char* word2) {\n    \n}",
  "python": "class Solution:\n    def minDistance(self, word1: str, word2: str) -> int:\n        ",
  "javascript": "class Solution {\n    minDistance(word1, word2) {\n        \n    }\n}"
}
```

#### Driver Code (Copy into 'Driver Code (JSON Map)'):
```json
{
  "java": "import java.util.Scanner;\n\n// {{USER_CODE}}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String word1 = sc.hasNextLine() ? sc.nextLine().trim() : \"\";\n        String word2 = sc.hasNextLine() ? sc.nextLine().trim() : \"\";\n        Solution solver = new Solution();\n        System.out.println(solver.minDistance(word1, word2));\n    }\n}",
  "cpp": "#include <iostream>\n#include <string>\nusing namespace std;\n\n// {{USER_CODE}}\n\nint main() {\n    string word1, word2;\n    getline(cin, word1);\n    getline(cin, word2);\n    Solution sol;\n    cout << sol.minDistance(word1, word2) << endl;\n    return 0;\n}",
  "c": "#include <stdio.h>\n#include <string.h>\n\n// {{USER_CODE}}\n\nint main() {\n    char word1[1000] = {0};\n    char word2[1000] = {0};\n    if (fgets(word1, sizeof(word1), stdin)) {\n        word1[strcspn(word1, \"\\r\\n\")] = 0;\n    }\n    if (fgets(word2, sizeof(word2), stdin)) {\n        word2[strcspn(word2, \"\\r\\n\")] = 0;\n    }\n    printf(\"%d\\n\", minDistance(word1, word2));\n    return 0;\n}",
  "python3": "import sys\n\n// {{USER_CODE}}\n\ndef main():\n    lines = sys.stdin.read().splitlines()\n    word1 = lines[0].strip() if len(lines) > 0 else \"\"\n    word2 = lines[1].strip() if len(lines) > 1 else \"\"\n    sol = Solution()\n    print(sol.minDistance(word1, word2))\n\nif __name__ == '__main__':\n    main()",
  "nodejs": "const fs = require('fs');\n\n// {{USER_CODE}}\n\nfunction main() {\n    const lines = fs.readFileSync(0, 'utf-8').split(/\\r?\\n/);\n    const word1 = lines[0] ? lines[0].trim() : \"\";\n    const word2 = lines[1] ? lines[1].trim() : \"\";\n    const sol = new Solution();\n    console.log(sol.minDistance(word1, word2));\n}\nmain();"
}
```

### Test Cases

#### Test Case 1 (Public)
- **Input**:
```
horse
ros
```
- **Expected Output**:
```
3
```
- **Explanation**: horse -> rorse (replace 'h' with 'r'), rorse -> rose (remove 'r'), rose -> ros (remove 'e')

#### Test Case 2 (Public)
- **Input**:
```
intention
execution
```
- **Expected Output**:
```
5
```
- **Explanation**: Five operations are required: replace 'i'->'e', replace 'n'->'x', replace 't'->'u', insert 'c', insert 'u'...

#### Test Case 3 (Hidden)
- **Input**:
```
a
b
```
- **Expected Output**:
```
1
```
- **Explanation**: Replace 'a' with 'b'.

#### Test Case 4 (Hidden)
- **Input**:
```
abc

```
- **Expected Output**:
```
3
```
- **Explanation**: Delete all three characters.

### Solutions

#### Java Solution
```java
class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1])) + 1;
                }
            }
        }
        return dp[m][n];
    }
}
```

#### C++ Solution
```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.length(), n = word2.length();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1));
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = min(dp[i - 1][j - 1], min(dp[i - 1][j], dp[i][j - 1])) + 1;
                }
            }
        }
        return dp[m][n];
    }
};
```

#### C Solution
```c
#include <string.h>

int min(int a, int b) { return a < b ? a : b; }

int minDistance(char* word1, char* word2) {
    int m = strlen(word1), n = strlen(word2);
    int dp[502][502];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = min(dp[i - 1][j - 1], min(dp[i - 1][j], dp[i][j - 1])) + 1;
            }
        }
    }
    return dp[m][n];
}
```

#### Python Solution
```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1): dp[i][0] = i
        for j in range(n + 1): dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]) + 1
        return dp[m][n]
```

#### JavaScript Solution
```javascript
class Solution {
    minDistance(word1, word2) {
        const m = word1.length, n = word2.length;
        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (word1[i - 1] === word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]) + 1;
                }
            }
        }
        return dp[m][n];
    }
}
```

---

