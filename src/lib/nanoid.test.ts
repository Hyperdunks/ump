import { describe, expect, test } from "bun:test";
import { nanoid, shortId } from "@/lib/nanoid";

describe("nanoid utilities", () => {
    test("nanoid generates 21-character string", () => {
        const id = nanoid();
        expect(id).toHaveLength(21);
    });

    test("shortId generates 12-character string", () => {
        const id = shortId();
        expect(id).toHaveLength(12);
    });

    test("nanoid only uses alphanumeric characters", () => {
        const id = nanoid();
        expect(id).toMatch(/^[0-9A-Za-z]+$/);
    });

    test("nanoid generates unique IDs", () => {
        const ids = new Set(Array.from({ length: 100 }, () => nanoid()));
        expect(ids.size).toBe(100);
    });
});
