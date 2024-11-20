import * as admin from "firebase-admin";

interface StorageService {
  uploadFile(filePath: string, destination: string): Promise<string>;
  getFileURL(fileKey: string): Promise<string>;
  deleteFile(fileKey: string): Promise<void>;
}

let storageService: StorageService;

export class FirebaseStorageService implements StorageService {
  private bucket = admin.storage().bucket();

  async uploadFile(filePath: string, destination: string): Promise<string> {
    const [file] = await this.bucket.upload(filePath, { destination });

    const downloadURL = await file.getSignedUrl({
      action: "read",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // now + 7 days
    });

    return downloadURL[0];
  }

  // fileKey: location of the file at Firebase Storage
  async getFileURL(fileKey: string): Promise<string> {
    const file = this.bucket.file(fileKey);

    const downloadURL = await file.getSignedUrl({
      action: "read",
      expires: new Date(Date.now() + 7 * 24 * 3600 * 1000), // now + 7 days
    });

    return downloadURL[0];
  }

  async deleteFile(fileKey: string): Promise<void> {
    await this.bucket.file(fileKey).delete();
  }
}

import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as fs from "fs";

const s3 = new S3Client({ region: process.env.AWS_REGION as string });

export class S3StorageService implements StorageService {
  private bucketName = process.env.AWS_BUCKET_NAME as string;

  async uploadFile(filePath: string, destination: string): Promise<string> {
    try {
      const fileStream = fs.createReadStream(filePath);

      const upload = new Upload({
        client: s3,
        params: {
          Bucket: this.bucketName,
          Key: destination,
          Body: fileStream,
        },
      });

      const { Location } = await upload.done(); // FIXME: undefined -> throw error

      return Location ? Location : "";
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw new Error("File upload failed");
    }
  }

  async getFileURL(fileKey: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      // Generate a pre-signed URL with an expiration of 7 days
      const url = await getSignedUrl(s3, command, {
        expiresIn: 7 * 24 * 3600,
      });
      return url;
    } catch (error) {
      console.error("Error generating S3 file URL:", error);
      throw new Error("Failed to get file URL");
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      await s3.send(command);
      console.log(`Deleted file with key: ${fileKey}`);
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      throw new Error("File deletion failed");
    }
  }
}

if (process.env.STORAGE_PROVIDER === "firebase") {
  storageService = new FirebaseStorageService();
} else if (process.env.STORAGE_PROVIDER === "s3") {
  storageService = new S3StorageService();
}

// storageService = new FirebaseStorageService();

export { storageService };
