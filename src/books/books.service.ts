import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { SaveBookDTO } from './dto/saveBook.dto';
import { GetBooksQuery } from './queries/getBooks.query';
import { getPaginatedQuery } from 'src/lib/utils/paginatedQuery';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) { }
  async getBooks(query: GetBooksQuery) {
    const findQuery = getPaginatedQuery({query, searchByArray: ['title', 'description']});
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
      where: { id },
    });
  }
  async createBook(book: SaveBookDTO) {
    const newBook: BookEntity = await this.bookRepository.create(book);

    return await this.bookRepository.save(newBook);
  }
  async editBook(book: SaveBookDTO, id: string) {
    return await this.bookRepository.update({ id }, book);
  }
  deleteBookById(id) {
    return this.bookRepository.delete({ id });
  }
}
