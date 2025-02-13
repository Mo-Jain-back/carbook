import {  Router } from "express";
import multer from "multer";
import { google } from "googleapis";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure Multer (store files in `/tmp/`)
const upload = multer({ dest: "tmp/" });

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN as string;

// Google Drive OAuth2 Setup
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "http://localhost:3000");

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth: oauth2Client });

export const uploadRouter = Router();

uploadRouter.post("/", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        const filePath = req.file.path;

        const fileMetadata = {
            name: req.file.originalname,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID as string],
        };
        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(filePath),
        };

        // **🔹 Explicitly Refresh the Access Token Before Upload**
        const accessToken = await oauth2Client.getAccessToken();
        if (!accessToken) {
            throw new Error("Failed to obtain access token");
        }

        // Upload file to Google Drive
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

        // Delete temp file
        fs.unlinkSync(filePath);

        res.json({ url: `https://drive.google.com/uc?id=${response.data.id}` });
    } catch (e) {
        console.error("Upload Error:", e);
        res.status(500).json({ error: (e as Error).message });
    }
});

uploadRouter.post("/multiple", upload.array("files", 5), async (req, res) => {
    try {
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            res.status(400).json({ error: "No files uploaded" });
            return;
        }

        const files = req.files as Express.Multer.File[];
        const uploadedFiles = [];

        for (const file of files) {
            const filePath = file.path;
            console.log("Uploading:", file.originalname);

            const fileMetadata = {
                name: file.originalname,
                parents: [process.env.GOOGLE_DRIVE_FOLDER_ID as string],
            };

            const media = {
                mimeType: file.mimetype,
                body: fs.createReadStream(filePath),
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

            // Delete temp file
            fs.unlinkSync(filePath);

            uploadedFiles.push({
                name: file.originalname,
                url: `https://drive.google.com/uc?id=${response.data.id}`,
            });
        }

        res.json({ uploadedFiles });
    } catch (e) {
        res.status(500).json({ error: (e as Error).message });
    }
});