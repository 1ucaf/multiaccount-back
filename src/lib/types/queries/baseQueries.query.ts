import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { DateTransformer } from "src/lib/utils/date.transformer";

export interface PaginationBaseQuery {
  page?: number;
  pageSize?: number;
};

export interface SearchBaseQuery {
  search?: string;
};

export interface DatesBaseQuery {
  startDate?: Date;
  endDate?: Date;
};

export class CommonFiltersPaginated implements PaginationBaseQuery, SearchBaseQuery, DatesBaseQuery {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  page?: number = 0;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(DateTransformer)
  endDate?: Date;

  @IsOptional()
  @Transform(DateTransformer)
  startDate?: Date;
}