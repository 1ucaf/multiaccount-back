import { IsOptional } from 'class-validator';
import { CommonFiltersPaginated } from 'src/common/types/queries/baseQueries.query';

export class GetPaymentsQuery extends CommonFiltersPaginated {
  @IsOptional()
  account_id?: string;
}
