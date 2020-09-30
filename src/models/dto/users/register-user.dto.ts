import { IsString, MinLength, MaxLength, Matches, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(16)
    @IsNotEmpty()
    username: string;

    @IsString()
    @MinLength(8)
    @Matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/,
        { message: 'Password is too weak!' }
    )
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MaxLength(20, { message: 'First name exceeds length limit'})
    @IsNotEmpty({ message: 'Please provide your first name'})
    firstname: string;

    @IsString()
    @MaxLength(20, { message: 'Last name exceeds length limit'})
    @IsNotEmpty({ message: 'Please provide your last name'})
    lastname: string;
}