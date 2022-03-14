import { Injectable, Logger } from '@nestjs/common';
import { FileElementResponse } from '@app/files/dto/file-elem.response';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { MFile } from '@app/types/mfile.class';
import * as sharp from 'sharp';


@Injectable()
export class FilesService {
	private readonly _logger = new Logger(FilesService.name);


	async saveFiles(file: MFile): Promise<FileElementResponse> {
		try {
			const dateFolder = format(new Date(), 'yyyy-MM-dd');
			const uploadFolder = `${path}/uploads/${dateFolder}`;
			let res: FileElementResponse;

			await ensureDir(uploadFolder);
			await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);

			res = ({ 
				url: `${dateFolder}/${file.originalname}`, 
				name: file.originalname
			});
			
			return res;
		} catch (error) {
			this._logger.debug(error, 'saveFiles method error');
	
			throw error;
		}
	}


	async convertImage(file: Express.Multer.File): Promise<MFile> {
		try {
			let saveImage: MFile = new MFile(file);

			if(file.mimetype.includes('image')) {
				const buffer = await this.convertToWebP(file.buffer);
				saveImage = new MFile({ 
					originalname: `${file.originalname.split('.')[0]}.webp`,
					buffer
				});
			} 

			return saveImage;
		} catch (error) {
			this._logger.debug(error, 'convertImage method error');
	
			throw error;
		}
	}


	convertToWebP(file: Buffer) {
		try {
			return sharp(file)
				.webp()
				.toBuffer();
		} catch (error) {
			this._logger.debug(error, 'convertToWebP method error');
	
			throw error;
		}
	}
}
