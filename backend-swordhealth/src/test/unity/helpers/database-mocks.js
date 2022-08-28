const mockQueryMethods = {
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  commit: jest.fn().mockReturnThis(),
  rollback: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  first: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  del: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  table: jest.fn().mockReturnThis(),
};

const mockTransaction = () => {
  const transaction = {};
  transaction.insert = mockQueryMethods.insert;
  transaction.into = mockQueryMethods.into;
  transaction.commit = mockQueryMethods.commit;
  transaction.rollback = mockQueryMethods.rollback;
  transaction.where = mockQueryMethods.where;
  transaction.andWhere = mockQueryMethods.andWhere;
  transaction.del = mockQueryMethods.del;
  transaction.update = mockQueryMethods.update;
  transaction.andWhere = mockQueryMethods.andWhere;
  transaction.table = mockQueryMethods.table;
  return { transaction };
};

const mockConnection = () => {
  const connection = {};
  connection.select = mockQueryMethods.select;
  connection.where = mockQueryMethods.where;
  connection.from = mockQueryMethods.from;
  connection.limit = mockQueryMethods.limit;
  connection.offset = mockQueryMethods.offset;
  connection.first = mockQueryMethods.first;
  connection.andWhere = mockQueryMethods.andWhere;
  return { connection };
};

module.exports = {
  mockQueryMethods,
  mockTransaction,
  mockConnection,
};
