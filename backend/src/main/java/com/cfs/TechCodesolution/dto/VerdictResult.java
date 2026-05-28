package com.cfs.TechCodesolution.dto;

/**
 * DTO returned after code execution/submission.
 * Contains verdict + test case stats for the frontend.
 * No Lombok — explicit getters/setters for reliability.
 */
public class VerdictResult {
    private String verdict;
    private int passedCount;
    private int totalCount;
    private String runtime;
    private Integer memory;
    private String stdout;
    private String stderr;
    private String compileOutput;
    private String failedInput;
    private int statusId;

    public VerdictResult() {}

    // ── Getters ──────────────────────────────────────────────────────────────
    public String getVerdict()       { return verdict; }
    public int getPassedCount()      { return passedCount; }
    public int getTotalCount()       { return totalCount; }
    public String getRuntime()       { return runtime; }
    public Integer getMemory()       { return memory; }
    public String getStdout()        { return stdout; }
    public String getStderr()        { return stderr; }
    public String getCompileOutput() { return compileOutput; }
    public String getFailedInput()   { return failedInput; }
    public int getStatusId()         { return statusId; }

    // ── Setters ──────────────────────────────────────────────────────────────
    public void setVerdict(String verdict)             { this.verdict = verdict; }
    public void setPassedCount(int passedCount)        { this.passedCount = passedCount; }
    public void setTotalCount(int totalCount)          { this.totalCount = totalCount; }
    public void setRuntime(String runtime)             { this.runtime = runtime; }
    public void setMemory(Integer memory)              { this.memory = memory; }
    public void setStdout(String stdout)               { this.stdout = stdout; }
    public void setStderr(String stderr)               { this.stderr = stderr; }
    public void setCompileOutput(String compileOutput) { this.compileOutput = compileOutput; }
    public void setFailedInput(String failedInput)     { this.failedInput = failedInput; }
    public void setStatusId(int statusId)              { this.statusId = statusId; }

    // ── Factory methods ───────────────────────────────────────────────────────
    public static VerdictResult accepted(int total, String runtime, Integer memory, String stdout) {
        VerdictResult r = new VerdictResult();
        r.setVerdict("ACCEPTED");
        r.setPassedCount(total);
        r.setTotalCount(total);
        r.setRuntime(runtime);
        r.setMemory(memory);
        r.setStdout(stdout);
        r.setStatusId(3);
        return r;
    }

    public static VerdictResult compilationError(String compileOutput) {
        VerdictResult r = new VerdictResult();
        r.setVerdict("COMPILATION_ERROR");
        r.setPassedCount(0);
        r.setTotalCount(0);
        r.setCompileOutput(compileOutput);
        r.setStatusId(6);
        return r;
    }
}
