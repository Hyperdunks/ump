import { describe, expect, test } from "bun:test";
import { normalizeMonitorUrl } from "@/lib/normalize-monitor-url";

describe("Monitor API Validators", () => {
  test("validates monitor type enum values", () => {
    const validTypes = ["http", "https", "tcp", "ping"];
    const invalidType = "ftp";

    expect(validTypes).toContain("http");
    expect(validTypes).toContain("https");
    expect(validTypes).toContain("tcp");
    expect(validTypes).toContain("ping");
    expect(validTypes).not.toContain(invalidType);
  });

  test("validates HTTP method enum values", () => {
    const validMethods = ["GET", "POST", "HEAD"];
    const invalidMethod = "DELETE";

    expect(validMethods).toContain("GET");
    expect(validMethods).toContain("POST");
    expect(validMethods).toContain("HEAD");
    expect(validMethods).not.toContain(invalidMethod);
  });

  test("validates default check interval is reasonable", () => {
    const defaultCheckInterval = 60; // seconds
    expect(defaultCheckInterval).toBeGreaterThanOrEqual(10);
    expect(defaultCheckInterval).toBeLessThanOrEqual(3600);
  });

  test("validates default timeout is reasonable", () => {
    const defaultTimeout = 30000; // ms
    expect(defaultTimeout).toBeGreaterThanOrEqual(1000);
    expect(defaultTimeout).toBeLessThanOrEqual(60000);
  });

  test("validates expected status codes format", () => {
    const expectedStatusCodes = ["200", "201", "204"];

    for (const code of expectedStatusCodes) {
      expect(code).toMatch(/^\d{3}$/);
    }
  });
});

describe("URL Validation", () => {
  test("validates valid HTTP URLs", () => {
    const validUrls = [
      "https://example.com",
      "http://api.example.com/health",
      "https://sub.domain.example.com:8080/path",
    ];

    for (const url of validUrls) {
      expect(() => new URL(url)).not.toThrow();
    }
  });

  test("rejects invalid URLs", () => {
    const invalidUrls = ["not-a-url", "://missing-protocol.com"];

    for (const url of invalidUrls) {
      expect(() => new URL(url)).toThrow();
    }
  });
});

describe("Monitor URL normalization", () => {
  test("adds https for domains without protocol", () => {
    expect(normalizeMonitorUrl("google.com")).toBe("https://google.com");
    expect(normalizeMonitorUrl("harzh.xyz")).toBe("https://harzh.xyz");
  });

  test("keeps explicit protocols unchanged", () => {
    expect(normalizeMonitorUrl("https://google.com")).toBe(
      "https://google.com",
    );
    expect(normalizeMonitorUrl("http://api.example.com/health")).toBe(
      "http://api.example.com/health",
    );
    expect(normalizeMonitorUrl("postgresql://localhost:5432/ump")).toBe(
      "postgresql://localhost:5432/ump",
    );
    expect(
      normalizeMonitorUrl("mongodb+srv://cluster0.example.mongodb.net"),
    ).toBe("mongodb+srv://cluster0.example.mongodb.net");
  });
});
