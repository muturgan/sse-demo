import { Controller, Get, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Controller()
export class FilesController {
	@Get()
	public index(@Res() res: FastifyReply): void {
		// @ts-ignore
		res.sendFile('index.html')
	}

	@Get('favicon.ico')
	public favicon(@Res() res: FastifyReply): void {
		res.status(204).send();
	}
}
