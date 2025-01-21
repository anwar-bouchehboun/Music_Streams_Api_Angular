export interface ChansonResponse {
  id: string;
  titre: string;
  duree: number;
  trackNumber: number;
  description: string;
  categorie: string;
  dateAjout: string; // LocalDate devient string en format ISO
  audioFileId: string;
  audioFile?: File;
  albumId: string;
}
