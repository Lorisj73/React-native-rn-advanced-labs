export type Photo = {
  id: string; // filename without extension or asset id
  uri: string; // file:// or content:// URI
  createdAt: number; // timestamp ms
  size?: number; // bytes
  // Added fields
  source?: 'app' | 'library';
  assetId?: string; // present when source === 'library'
};
