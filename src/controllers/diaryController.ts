import { Request, Response } from "express";
import { storageService } from "../lib/storage";
import * as fs from "fs";

export const uploadFiles = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[]; // 여러 파일 배열

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadResults: string[] = [];

    // 각 파일을 스토리지 서비스에 업로드
    for (const file of files) {
      const filePath = file.path;
      const destination = `uploads/${file.filename}`;
      const url = await storageService.uploadFile(filePath, destination);

      uploadResults.push(url);

      // 임시 파일 삭제
      fs.unlinkSync(filePath);
    }

    res.json({ files: uploadResults });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
