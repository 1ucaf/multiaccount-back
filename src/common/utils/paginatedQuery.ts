import { FindManyOptions, FindOptionsWhere } from "typeorm";
import { CommonFiltersPaginated } from "../types/queries/baseQueries.query";
import { DomainEntity } from "../entities/domain.entity";
import { AccountDomainEntity } from "../entities/accountdomain.entity";

type GetPaginatedQueryType<TQuery, TEntity> = {
  query: TQuery;
  searchByArray: string[];
  otherWhereConditions?: FindOptionsWhere<TEntity>;
}

export const getPaginatedQuery = <TQuery extends CommonFiltersPaginated, TEntity extends DomainEntity | AccountDomainEntity>({
  query,
  searchByArray,
  otherWhereConditions = {},
}: GetPaginatedQueryType<TQuery, TEntity>) => {
  const {
    page = 0,
    pageSize = 10,
    search,
    endDate,
    startDate,
  } = query;

  const where: FindOptionsWhere<TEntity> = {
    ...otherWhereConditions,
  };

  // 1. Date filtering
  const dateConditions: any = {};
  if (startDate) dateConditions.$gte = startDate;
  if (endDate) dateConditions.$lte = endDate;
  if (Object.keys(dateConditions).length > 0) {
    where.date_created = dateConditions;
  }

  // 2. Search filtering
  if (search) {
    where["$or"] = searchByArray.map((field) => ({ [field]: { $regex: search, $options: 'i' } }));
  }

  // 3. Combine conditions with AND if both exist
  if (where.date_created && where["$or"]) {
    where["$and"] = [
      { date_created: where.date_created },
      { $or: where["$or"] }
    ];
    delete where.date_created;
    delete where["$or"];
  }
  const findQuery: FindManyOptions<TEntity> = {
    skip: (page) * pageSize,
    take: pageSize,
    where: where
  }
  return findQuery;
}