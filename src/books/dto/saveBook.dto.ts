import { IsNotEmpty, IsString } from "class-validator";

export class SaveBookDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}