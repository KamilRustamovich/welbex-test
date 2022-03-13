import { 
	HttpException, 
	HttpStatus, 
	Injectable, 
	Logger 
} from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/entities/user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from '@app/interfaces/userResponse.interface';
import { LoginUserDto } from '@app/user/dto/login.dto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from '@app/user/dto/update-user.dto';


@Injectable()
export class UserService {
	private readonly _logger = new Logger(UserService.name);

	constructor(
		@InjectRepository(UserEntity) 
		private readonly userRepo: Repository<UserEntity>,
	) {}


	async findRegisteredUser(createUserDto: CreateUserDto): Promise<boolean> {
		try {
			const userByUsername = await this.userRepo.findOne({
				username: createUserDto.username
			});

			if (userByUsername) {
				throw new HttpException('Username is already taken', HttpStatus.UNPROCESSABLE_ENTITY)
			};

			const userByEmail = await this.userRepo.findOne({
				email: createUserDto.email
			});

			if (userByEmail) {
				throw new HttpException('Email is already taken', HttpStatus.UNPROCESSABLE_ENTITY)
			};

			return false;
		} catch (error) {
			this._logger.debug(error, 'findRegisteredUser method error');

			throw error;
		}

	}


	async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
		try {
			const newUser = await this.userRepo.create(createUserDto);

			return await this.userRepo.save(newUser);
		} catch (error) {
			this._logger.debug(error, 'createUser method error');

			throw error;
		}
	}


	async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
		try {
			const user = await this.userRepo.findOne(
				{ email: loginUserDto.email },
				{ select: ['id', 'username', 'email', 'password'] },
			);

			if (!user) {
				throw new HttpException('Credentiala are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
			}

			const isPasswordCorrect = await compare(
				loginUserDto.password,
				user.password,
			);

			if (!isPasswordCorrect) {
				throw new HttpException('Credentiala are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
			}

			delete user.password;

			return user;
		} catch (error) {
			this._logger.debug(error, 'login method error');

			throw error;
		}
	}


	async findByUserId(id: number): Promise<UserEntity> {
		try { 
			const user = await this.userRepo.findOne(id);

			if (!user) {
				throw new HttpException('User not found', HttpStatus.NOT_FOUND);
			}

			return user;
		} catch (error) {
			this._logger.debug(error, 'findByUserId method error');

			throw error;
		}
	}


	async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
		const user = await this.findByUserId(userId);

		Object.assign(user, updateUserDto);
		
		return await this.userRepo.save(user);
	}


	generateJWT(user: UserEntity): string {
		const secret = process.env.JWT_SECRET;

		return sign({
			id: user.id,
			username: user.username,
			email: user.email,
		}, secret);
	}


	buildUserResponse(user: UserEntity): UserResponseInterface {
		return {
			user: {
				...user,
				token: this.generateJWT(user)
			}
		};
	}

	
}
