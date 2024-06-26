import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
        const key = `uploads/${Date.now()}_${file.originalname}`;
        const fileUrl = await this.uploadService.uploadFile(file, key);
        return { url: fileUrl };
    }
}
