import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { SaveBookDTO } from './dto/saveBook.dto';
import { GetBooksQuery } from './queries/getBooks.query';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/permissions/dictionary/permissions.dictionary';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

@Controller('books')
@UseGuards(AuthGuard(), RolesGuard, PermissionsGuard)
@Roles(Role.USER)
export class BooksController {
  constructor(private booksService: BooksService) {}
  @Get()
  @Permissions(Permission.BOOKS_GET)
  getBooks(@Query() query: GetBooksQuery) {
    return this.booksService.getBooks(query);
  }
  @Get(":id")
  @Permissions(Permission.BOOKS_GET)
  getBooksById(@Param("id") id) {
    return this.booksService.getBookById(id);
  }
  @Post()
  @Permissions(Permission.BOOKS_CREATE)
  createBook(@Body() body: SaveBookDTO) {
    return this.booksService.createBook(body);
  }
  @Put(":id")
  @Permissions(Permission.BOOKS_EDIT)
  updateBook(@Param("id") id, @Body() body) {
    return this.booksService.editBook(body, id);
  }
  @Delete(":id")
  @Permissions(Permission.BOOKS_DELETE)
  deleteBook(@Param("id") id) {
    return this.booksService.deleteBookById(id);
  }
}
