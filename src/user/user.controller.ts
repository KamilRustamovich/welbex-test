import { 
	Controller, 
	Get, 
	Post, 
	Body, 
	UsePipes, 
	ValidationPipe, 
	UseGuards,
	Put
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { UserResponseInterface } from '@app/interfaces/userResponse.interface';
import { LoginUserDto } from '@app/user/dto/login.dto';
import { User } from '@app/decorators/user.decorator';
import { UserEntity } from '@app/user/entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from '@app/user/dto/update-user.dto';


@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}


	@UsePipes(new ValidationPipe())
	@Post('register')
	async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
		const isRegistered = await this.userService.findRegisteredUser(createUserDto);

		if (isRegistered === false) {
			const newUser = await this.userService.createUser(createUserDto);

			return this.userService.buildUserResponse(newUser);
		}
	}


	@Post('login')
	@UsePipes(new ValidationPipe())
	async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
		const user = await this.userService.login(loginUserDto);

		return this.userService.buildUserResponse(user);
	}


	@Get()
	@UseGuards(AuthGuard)
	async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
		return this.userService.buildUserResponse(user);
	}


	@Put()
	@UseGuards(AuthGuard)
	async updateCurrentUser(
		@User('id') currentUserId: number,
		@Body('user') updateUserDto: UpdateUserDto
	): Promise<UserResponseInterface> {
		const user = await this.userService.updateUser(currentUserId, updateUserDto);

		return this.userService.buildUserResponse(user);
	}
}
