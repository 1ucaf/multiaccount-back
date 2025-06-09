import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";
import { CommonFiltersPaginated } from "src/lib/types/queries/baseQueries.query";
import { BooleanTransformer } from "src/lib/utils/boolean.transformer";

export class GetAccountsQuery extends CommonFiltersPaginated {
  @IsOptional()
  @IsBoolean()
  @Transform(BooleanTransformer)
  isActive: boolean;
}