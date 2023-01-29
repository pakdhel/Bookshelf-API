const { nanoid } = require('nanoid');
const arrayBooks = require('./arrayBooks');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  try {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });

      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });

      response.code(400);
      return response;
    }
  } catch (error) {
    return h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    }).code(500);
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  arrayBooks.push(newBook);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });

  response.code(201);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBook = arrayBooks;
  if (name !== undefined) {
    filteredBook = filteredBook
      .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    filteredBook = filteredBook
      .filter((book) => book.reading === (reading === '1'));
  }

  if (finished !== undefined) {
    filteredBook = filteredBook
      .filter((book) => book.finished === (finished === '1'));
  }

  const books = filteredBook.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books,
    },
  }).code(200);
};

const getDetailBook = (request, h) => {
  const { id } = request.params;
  const book = arrayBooks.filter((b) => b.bookId === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });

    response.code(200);
    return response;
  }

  return h.response({ status: 'fail', message: 'Buku tidak ditemukan' }).code(404);
};

const editBook = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const finished = (pageCount === readPage);
  const updatedAt = new Date().toISOString();

  const isName = name !== undefined;
  // eslint-disable-next-line camelcase
  const page = !((readPage > pageCount));
  const index = arrayBooks.findIndex((b) => b.bookId === id);

  if (!isName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // eslint-disable-next-line camelcase
  if (!page) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  arrayBooks[index] = {
    ...arrayBooks[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });

  response.code(200);
  return response;
};

const deleteBook = (request, h) => {
  const { id } = request.params;
  const index = arrayBooks.findIndex((b) => b.bookId === id);

  if (index !== -1) {
    arrayBooks.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBooksHandler, getDetailBook, editBook, deleteBook,
};
