export function isTekmetricMockMode(): boolean {
  return process.env.TEKMETRIC_MOCK_MODE === "true";
}

export function shouldShowTekmetricMockBadge(): boolean {
  return process.env.NODE_ENV === "development" && isTekmetricMockMode();
}
