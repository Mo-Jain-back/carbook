"use server";

import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN as string;
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID as string;

// Google Drive OAuth2 Setup
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "http://localhost:3000");
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });


// 🚀 **Single File Upload**
export async function uploadToDrive(file: File,type:"name"|"id",folder:string ) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
   
    let newFolderId = FOLDER_ID;
    if(type === "name"){
        const folderMetadata = {
            name: folder,
            mimeType: "application/vnd.google-apps.folder",
            parents: [FOLDER_ID],
        };
        const newFolderResponse = await drive.files.create({
            requestBody: folderMetadata,
            fields: "id",
          });

        if (!newFolderResponse.data.id) throw new Error("Failed to create folder");

        newFolderId = newFolderResponse.data.id;
    }else{
        newFolderId = folder;
    }

    const fileMetadata = {
        name: file.name,
        parents: [newFolderId],
    };
    
    const media = {
      mimeType: file.type,
      body: BufferToStream(buffer),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id",
    });

    // Make file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id as string,
      requestBody: { role: "reader", type: "anyone" },
    });

    return { 
        url: `https://drive.google.com/uc?id=${response.data.id}` ,
        name:file.name,
        type:file.type,
        folderId:newFolderId
        };
  } catch (error) {
    console.error("Upload Error:", error);
    return { error: (error as Error).message };
  }
}

// 🚀 **Multiple Files Upload**
export async function uploadMultipleToDrive(files: File[],type:"name"|"id",folder:string) {
  const uploadedFiles = [];

  for (const file of files) {
    const result = await uploadToDrive(file,type,folder);
    if (result.error) {
      return { error: result.error };
    }
    uploadedFiles.push(result);
  }

  return { uploadedFiles };
}

// 🔄 Convert Buffer to Readable Stream
function BufferToStream(buffer: Buffer) {
  const { Readable } = require("stream");
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
