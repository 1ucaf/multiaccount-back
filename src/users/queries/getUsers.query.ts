import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Role } from "src/auth/enums/role.enum";
import { CommonFiltersPaginated } from "src/common/types/queries/baseQueries.query";
import { BooleanTransformer } from "src/common/utils/boolean.transformer";

export class GetUsersQuery extends CommonFiltersPaginated {
  @IsOptional()
  @IsString()
  role: Role;

  @IsOptional()
  @IsBoolean()
  @Transform(BooleanTransformer)
  isActive: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(BooleanTransformer)
  showDeleted: boolean;
}