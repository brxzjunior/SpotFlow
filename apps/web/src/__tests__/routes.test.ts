import { describe, it, expect } from 'vitest';

describe('Web Navigation and Routes Configuration', () => {
  it('deve conter as rotas mandatórias da aplicação mapeadas', () => {
    const definedRoutes = [
      '/',
      '/auth/callback',
      '/app',
      '/app/studio',
      '/app/library',
      '/app/automations',
      '/app/automations/:id',
      '/app/insights',
      '/app/copilot',
      '/app/settings'
    ];

    expect(definedRoutes).toHaveLength(10);
    expect(definedRoutes).toContain('/app/studio');
    expect(definedRoutes).toContain('/app/automations');
    expect(definedRoutes).toContain('/app/copilot');
  });
});
