// Use legacy API to avoid deprecation errors with SDK 54 while keeping current calls
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { Photo } from './types';

const BASE_DIR: string = (FileSystem as any).documentDirectory ?? (FileSystem as any).cacheDirectory;
const PHOTOS_DIR = `${BASE_DIR}photos/`;

export class StorageError extends Error {
  constructor(public code: 'WRITE_FAILED' | 'NOT_FOUND' | 'READ_FAILED' | 'DELETE_FAILED', message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export async function ensureDir() {
  try {
    const info = await FileSystem.getInfoAsync(PHOTOS_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
    }
  } catch (e: any) {
    throw new StorageError('WRITE_FAILED', "Impossible de préparer le dossier photos (espace disque insuffisant ou permissions)");
  }
}

function inferExtFromUri(uri: string | undefined): '.jpg' | '.jpeg' | '.png' {
  if (!uri) return '.jpg';
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return '.png';
  if (lower.endsWith('.jpeg')) return '.jpeg';
  return '.jpg';
}

// Overloads for convenience
export async function savePhoto(tempUri: string): Promise<Photo>;
export async function savePhoto(input: { base64: string; extension?: 'jpg' | 'jpeg' | 'png' } | { tempUri: string }): Promise<Photo>;
export async function savePhoto(arg: any): Promise<Photo> {
  await ensureDir();
  const id = `photo_${Date.now()}`;

  const isString = typeof arg === 'string';
  const tempUri: string | undefined = isString ? (arg as string) : (arg?.tempUri as string | undefined);
  const base64: string | undefined = !isString ? (arg?.base64 as string | undefined) : undefined;

  const ext = base64
    ? (('.' + ((arg?.extension ?? 'jpg') as string)) as '.jpg' | '.jpeg' | '.png')
    : inferExtFromUri(tempUri);

  const dest = `${PHOTOS_DIR}${id}${ext}`;

  try {
    if (base64) {
      await FileSystem.writeAsStringAsync(dest, base64, { encoding: (FileSystem as any).EncodingType?.Base64 ?? 'base64' });
    } else if (tempUri) {
      await FileSystem.copyAsync({ from: tempUri, to: dest });
    } else {
      throw new StorageError('WRITE_FAILED', 'Source de photo invalide');
    }
  } catch (e: any) {
    // Échec d'écriture/copie: souvent disque plein ou fichier source invalide
    throw new StorageError('WRITE_FAILED', "Échec d'enregistrement de la photo (espace disque insuffisant ou fichier source invalide)");
  }

  try {
    const info = (await FileSystem.getInfoAsync(dest)) as any;
    return {
      id,
      uri: dest,
      createdAt: Date.now(),
      size: info?.size,
      source: 'app',
    };
  } catch {
    throw new StorageError('READ_FAILED', "Photo enregistrée mais lecture des métadonnées échouée");
  }
}

export async function listPhotos(): Promise<Photo[]> {
  await ensureDir();
  try {
    const names = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    const photos: Photo[] = [];
    for (const name of names) {
      if (!name.toLowerCase().match(/\.(jpg|jpeg|png)$/)) continue;
      const uri = PHOTOS_DIR + name;
      const info = (await FileSystem.getInfoAsync(uri)) as any;
      const base = name.replace(/\.(jpg|jpeg|png)$/i, '');
      let createdAt = Date.now();
      const m = base.match(/^photo_(\d{10,})$/);
      if (m) createdAt = Number(m[1]);
      photos.push({ id: base, uri, createdAt, size: info?.size, source: 'app' });
    }
    photos.sort((a, b) => b.createdAt - a.createdAt);
    return photos;
  } catch (e) {
    throw new StorageError('READ_FAILED', 'Lecture de la galerie échouée');
  }
}

export async function getPhoto(id: string): Promise<Photo | undefined> {
  const candidates = ['.jpg', '.jpeg', '.png'];
  for (const ext of candidates) {
    const uri = `${PHOTOS_DIR}${id}${ext}`;
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists) {
        const anyInfo = info as any;
        const mt = anyInfo?.modificationTime;
        return { id, uri, createdAt: mt ? mt * 1000 : Date.now(), size: anyInfo?.size, source: 'app' };
      }
    } catch {
      // continue and try next extension
    }
  }
  return undefined;
}

export async function deletePhoto(id: string): Promise<void> {
  const photo = await getPhoto(id);
  if (!photo) {
    // idempotent: nothing to delete
    return;
  }
  try {
    await FileSystem.deleteAsync(photo.uri, { idempotent: true });
  } catch {
    throw new StorageError('DELETE_FAILED', 'Suppression échouée');
  }
}

// List photos from the device library (requires permissions granted beforehand)
export async function listLibraryPhotos(limit = 200): Promise<Photo[]> {
  const assets = await MediaLibrary.getAssetsAsync({ mediaType: 'photo', first: limit, sortBy: [[MediaLibrary.SortBy.creationTime, false]] });
  const rows: Photo[] = assets.assets.map((a) => ({
    id: a.id,
    assetId: a.id,
    uri: a.uri ?? '',
    createdAt: (a.creationTime ?? Date.now()) * 1000, // asset times are seconds
    // size is not available in typed API; can be fetched via getAssetInfoAsync and cast if needed
    size: undefined,
    source: 'library',
  }));
  return rows;
}

export async function getLibraryPhoto(id: string): Promise<Photo | undefined> {
  try {
    const info = await MediaLibrary.getAssetInfoAsync(id);
    return {
      id,
      assetId: id,
      uri: info.localUri ?? info.uri ?? '',
      createdAt: (info.creationTime ?? Date.now()) * 1000,
      size: undefined,
      source: 'library',
    };
  } catch {
    return undefined;
  }
}

export async function deleteLibraryPhoto(id: string): Promise<void> {
  try {
    await MediaLibrary.deleteAssetsAsync([id]);
  } catch {}
}
