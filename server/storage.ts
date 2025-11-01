// This file is not used in the Kiranfolio application
// News data is fetched directly from News API and cached in-memory in routes.ts
// No persistent storage is needed for the MVP

export interface IStorage {
  // Placeholder - extend as needed for future features
}

export class MemStorage implements IStorage {
  constructor() {
    // Placeholder
  }
}

export const storage = new MemStorage();
