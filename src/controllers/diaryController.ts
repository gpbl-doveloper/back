import { Request, Response } from "express";
import { storageService } from "../lib/storage";
import * as fs from "fs";
import { File } from "@prisma/client";
import prisma from "../lib/prisma";

export const addDiary = async (req: Request, res: Response) => {
  try {
    //// TODO: file upload 없앨거임
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadResults: File[] = [];

    for (const file of files) {
      const filePath = file.path;
      const destination = `uploads/${file.filename}`;
      const newFile = await storageService.uploadFile(filePath, destination);

      uploadResults.push(newFile);

      // 임시 파일 삭제
      fs.unlinkSync(filePath);
    }

    //// diary 생성
    const newDiary = await prisma.diary.create({
      data: { content: req.body.content },
    });

    //// file update
    // TODO file upload 없어지면 id list 받을거임
    await prisma.file.updateMany({
      where: { id: { in: uploadResults.map((file) => file.id) } },
      data: { diaryId: newDiary.id },
    });

    res.json({ diary: { ...newDiary, files: uploadResults } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
