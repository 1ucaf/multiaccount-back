import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDTO {  
  @IsNotEmpty()
  @IsString()
  readonly current_password: string;
  
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly new_password: string;
}