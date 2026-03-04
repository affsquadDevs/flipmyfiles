let totalConversions = 0;

export function incrementConversions(): void {
  totalConversions++;
}

export function getStats() {
  return {
    totalConversions,
    formatsSupported: 50,
  };
}
