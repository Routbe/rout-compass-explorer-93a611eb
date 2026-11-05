import { hexToOklch } from "./wallet-color";
import { describe, expect, it } from "vitest";
import { GOOGLE_PASS_DESIGN, googleArtworkVersion } from "./google-premium-art";
import { googleCardObject, googleCardSaveClaims, walletCardPayload } from "./wallet-pass";

const card = walletCardPayload({ handle: "maker", space: "root", displayName: "Maker", tagline: "My work", themeBg: "#ff00ff", accent: "#ff0000", avatarSrc: null }, "https://rout.be", "RT-235Q-ABCD-X");
describe("premium Google pass rules", () => {
  it("harmonises saturated profile colours into a dark matte background", () => {
    const bg = googleCardObject(card, "3388").hexBackgroundColor;
    const lch = hexToOklch(bg)!;
    expect(lch.L).toBeGreaterThanOrEqual(0.149);
    expect(lch.L).toBeLessThanOrEqual(0.201);
    expect(lch.C).toBeLessThanOrEqual(0.036);
    expect(card.hexBackgroundColor).toBe("#ff00ff");
  });
  it("reserves exactly two front rows for card number and the profile hub", () => {
    const rows = googleCardSaveClaims(card, { issuerId: "3388", serviceAccountEmail: "fixture@example.invalid", origins: ["https://rout.be"] }).payload.genericClasses[0]?.classTemplateInfo.cardTemplateOverride.cardRowTemplateInfos;
    expect(rows?.map(r => r.oneItem.item.firstValue.fields[0]?.fieldPath)).toEqual(["object.textModulesData['card']", "object.textModulesData['hub']"]);
    expect(googleCardObject(card, "3388").textModulesData.some(m => m.id === "authentication")).toBe(true);
  });
  it("uses 660-square logo with 17.5 percent safe padding", () => {
    expect(GOOGLE_PASS_DESIGN.logoSize).toBe(660);
    expect(GOOGLE_PASS_DESIGN.logoPadding).toBe(0.175);
  });
  it("uses 1032x812 hero and 1200x375 strip dimensions", () => {
    expect([GOOGLE_PASS_DESIGN.heroWidth, GOOGLE_PASS_DESIGN.heroHeight]).toEqual([1032, 812]);
    expect([GOOGLE_PASS_DESIGN.stripWidth, GOOGLE_PASS_DESIGN.stripHeight]).toEqual([1200, 375]);
  });
  it("versions clean public PNG URLs when card data changes", () => {
    const object = googleCardObject(card, "3388");
    const uri = new URL(object.heroImage.sourceUri.uri);
    expect(uri.search).toBe("");
    expect(uri.pathname.endsWith("/hero.png")).toBe(true);
    expect(googleArtworkVersion({ ...card, displayName: "Changed" })).not.toBe(googleArtworkVersion(card));
  });
});
describe("Google pass follows the whole profile palette", () => {
  it("mixes canvas and accent in OKLab: same accent, different canvas → different tint", async () => {
    const { harmonizeProfileBackground, hexToOklch } = await import("./wallet-color");
    const blue = harmonizeProfileBackground("#1d4ed8", "#41db97");
    const red = harmonizeProfileBackground("#b91c1c", "#41db97");
    expect(blue).not.toBe(red);
    for (const hex of [blue, red]) {
      const lch = hexToOklch(hex)!;
      expect(lch.L).toBeGreaterThanOrEqual(0.149);
      expect(lch.L).toBeLessThanOrEqual(0.201);
      expect(lch.C).toBeLessThanOrEqual(0.036);
    }
  });
  it("a neutral canvas picks up the accent hue instead of staying grey", async () => {
    const { harmonizeProfileBackground, hexToOklch } = await import("./wallet-color");
    const lch = hexToOklch(harmonizeProfileBackground("#0b0b0b", "#e11d48"))!;
    expect(lch.C).toBeGreaterThan(0.012);
  });
  it("logo tone keeps readable contrast on the harmonised background", async () => {
    const { contrastRatio, LOGO_TONES, pickLogoTone } = await import("./wallet-color");
    const bg = googleCardObject(card, "3388").hexBackgroundColor;
    expect(contrastRatio(LOGO_TONES[pickLogoTone(bg)], bg)).toBeGreaterThanOrEqual(4.5);
  });
  it("member seal shows initials and, for verified members only, the check", async () => {
    const { googlePremiumArtworkSvg, walletMonogram } = await import("./google-premium-art");
    expect(walletMonogram("Daniel Delacroix", "dd")).toBe("DD");
    expect(walletMonogram("élodie", "x")).toBe("É");
    expect(walletMonogram("@", "maker")).toBe("M");
    const plain = googlePremiumArtworkSvg({ ...card, displayName: "Ada Lovelace" }, "hero");
    const verified = googlePremiumArtworkSvg({ ...card, displayName: "Ada Lovelace", verified: true }, "hero");
    expect(plain).toContain(">AL</text>");
    expect(verified.length).toBeGreaterThan(plain.length);
    expect(verified).toContain('stroke-linecap="round"');
    expect(plain).not.toContain('stroke-linecap="round"');
    const doc = new DOMParser().parseFromString(verified, "image/svg+xml");
    expect(doc.getElementsByTagName("parsererror").length).toBe(0);
  });
  it("artwork URL changes when the profile canvas or verification changes", () => {
    expect(googleArtworkVersion({ ...card, hexBackgroundColor: "#123456" })).not.toBe(googleArtworkVersion(card));
    expect(googleArtworkVersion({ ...card, verified: true })).not.toBe(googleArtworkVersion(card));
  });
});
