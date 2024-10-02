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
    await this.bucket.upload(filePath, { destination });
    return `https://firebasestorage.googleapis.com/v0/b/${
      this.bucket.name
    }/o/${encodeURIComponent(destination)}`;
  }

  // fileKey는 Firebase Storage 버킷 내에서 파일이 저장된 경로
  // JSON 응답의 "name" 필드가 바로 Firebase Storage에서 해당 파일을 참조할 때 사용하는 fileKey입니다
  async getFileURL(fileKey: string): Promise<string> {
    return `https://firebasestorage.googleapis.com/v0/b/${
      this.bucket.name
    }/o/${encodeURIComponent(fileKey)}`;
  }

  async deleteFile(fileKey: string): Promise<void> {
    await this.bucket.file(fileKey).delete();
  }
}

/* prepare for S3 migration

//import * as AWS from "aws-sdk";
// import * as fs from "fs";

// const s3 = new AWS.S3();

// export class S3StorageService implements StorageService {
//   private bucketName = "your-s3-bucket";

//   async uploadFile(filePath: string, destination: string): Promise<string> {
//     const fileStream = fs.createReadStream(filePath);
//     const uploadResult = await s3
//       .upload({
//         Bucket: this.bucketName,
//         Key: destination,
//         Body: fileStream,
//       })
//       .promise();
//     return uploadResult.Location;
//   }

//   async getFileURL(fileKey: string): Promise<string> {
//     return s3.getSignedUrl("getObject", {
//       Bucket: this.bucketName,
//       Key: fileKey,
//       Expires: 60 * 60,
//     });
//   }

//   async deleteFile(fileKey: string): Promise<void> {
//     await s3
//       .deleteObject({
//         Bucket: this.bucketName,
//         Key: fileKey,
//       })
//       .promise();
//   }
// }

// if (process.env.STORAGE_PROVIDER === "firebase") {
//   storageService = new FirebaseStorageService();
// } else if (process.env.STORAGE_PROVIDER === "s3") {
//   storageService = new S3StorageService();
// }
*/

storageService = new FirebaseStorageService();

export { storageService };
