import { describe, expect, it } from "vitest";

import { SITE_URL, getAbsoluteUrl } from "./seo";

describe("seo helpers", () => {
  it("returns the base site url when no path is provided", () => {
    expect(getAbsoluteUrl()).toBe(SITE_URL);
  });

  it("builds a full url when path starts with slash", () => {
    expect(getAbsoluteUrl("/pokemon/25")).toBe(`${SITE_URL}/pokemon/25`);
  });

  it("builds a full url when path is relative without slash", () => {
    expect(getAbsoluteUrl("pokemon/150")).toBe(`${SITE_URL}/pokemon/150`);
  });

  it("returns external urls unchanged", () => {
    const external = "https://example.com/resource";
    expect(getAbsoluteUrl(external)).toBe(external);
  });
});
