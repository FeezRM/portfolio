import { personaTracks, type TrackId } from "./music";

export type PersonalTrack = { id: TrackId; file: Blob; name: string };
const databaseName = "faiz-persona-soundtrack";

async function openLibrary() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("tracks", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function readPersonalTracks(): Promise<PersonalTrack[]> {
  const database = await openLibrary();
  try {
    return await new Promise((resolve, reject) => {
      const request = database
        .transaction("tracks")
        .objectStore("tracks")
        .getAll();
      request.onsuccess = () =>
        resolve(
          request.result.filter(
            (item: PersonalTrack) =>
              personaTracks.some((track) => track.id === item.id) &&
              item.file instanceof Blob,
          ),
        );
      request.onerror = () => reject(request.error);
    });
  } finally {
    database.close();
  }
}

export async function writePersonalTracks(tracks: PersonalTrack[] | null) {
  const database = await openLibrary();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction("tracks", "readwrite");
      const store = transaction.objectStore("tracks");
      if (tracks) tracks.forEach((track) => store.put(track));
      else store.clear();
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    database.close();
  }
}
