export interface DatabaseModel {
  id: string;
  userId: string;
  createdAt: string;
  modifiedAt: string;

  // Temporary id to be handled while item does not have an id from the database
  temporaryId: string;
}
