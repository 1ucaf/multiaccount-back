import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { SaveBookDTO } from './dto/saveBook.dto';
import { GetBooksQuery } from './queries/getBooks.query';
import { getPaginatedQuery } from 'src/common/utils/paginatedQuery';
import { TenantContextService } from 'src/auth/tenancy/tenant-context.service';

@Injectable()
export class BooksService {
  private account_id: string;
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    private readonly tenantContext: TenantContextService,
  ) {
    this.account_id = this.tenantContext.getContext().accountId
  }
  async getBooks(query: GetBooksQuery) {
    const findQuery = getPaginatedQuery({
      query,
      searchByArray: ['title', 'description'],
      otherWhereConditions: { account_id: this.account_id },}
    );
    const [results, count] = await this.bookRepository.findAndCount(findQuery);
    const totalPages = Math.ceil(count / query.pageSize);
    return {
      results,
      count,
      totalPages,
      page: query.page,
      pageSize: query.pageSize,
    }
  }
  getBookById(id) {
    return this.bookRepository.findOne({
      where: { id, account_id: this.account_id },
    });
  }
  async createBook(book: SaveBookDTO) {
    const newBook: BookEntity = await this.bookRepository.create({
      ...book,
      account_id: this.account_id
    });

    return await this.bookRepository.save(newBook);
  }
  async editBook(book: SaveBookDTO, id: string) {
    return await this.bookRepository.update({ id, account_id: this.account_id }, book);
  }
  deleteBookById(id) {
    return this.bookRepository.delete({ id, account_id: this.account_id });
  }
}
