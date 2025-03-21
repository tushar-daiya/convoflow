type GoogleDriveFile = {
    id: string;
    name: string;
    mimeType: string;
    parents?: string[];
  };
  
  type DropboxFile = {
    ".tag"?: string;
    name: string;
    path_lower: string;
    path_display: string;
    id: string;
    client_modified: string;
    server_modified: string;
    rev: string;
    size: number;
    is_downloadable: boolean;
    content_hash: string;
  };
  
  export type { GoogleDriveFile, DropboxFile };
  