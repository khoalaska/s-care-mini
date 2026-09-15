import { transitions } from "../src/services/RequestService.js";

describe("Request State Machine", () => {
  // Valid transitions
  test("NEW -> REJECTED", () => {
    expect(transitions.NEW).toContain("REJECTED");
  });

  test("NEW -> CANCELLED", () => {
    expect(transitions.NEW).toContain("CANCELLED");
  });

  test("ASSIGNED -> IN_PROGRESS", () => {
    expect(transitions.ASSIGNED).toContain("IN_PROGRESS");
  });

  test("ASSIGNED -> REJECTED", () => {
    expect(transitions.ASSIGNED).toContain("REJECTED");
  });

  test("IN_PROGRESS -> DONE", () => {
    expect(transitions.IN_PROGRESS).toContain("DONE");
  });

  test("DONE -> CLOSED", () => {
    expect(transitions.DONE).toContain("CLOSED");
  });

  // Invalid transitions
  test("NEW -> DONE should be invalid", () => {
    expect(transitions.NEW).not.toContain("DONE");
  });

  test("NEW -> CLOSED should be invalid", () => {
    expect(transitions.NEW).not.toContain("CLOSED");
  });

  test("DONE -> REJECTED should be invalid", () => {
    expect(transitions.DONE).not.toContain("REJECTED");
  });
});
