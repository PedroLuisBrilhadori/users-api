import { Logger } from '@nestjs/common';
import { AbstractRepository } from '../repository.abstract';
import { AbstractDocument } from '../schema.abstract';

export class MockRepository<
  TDocument extends AbstractDocument,
> extends AbstractRepository<TDocument> {
  protected readonly logger: Logger;
  public create = jest.fn();
  public findOne = jest.fn();
  public deleteOne = jest.fn();
  public find = jest.fn();
  public countDocuments = jest.fn();
  public startTransaction = jest.fn();
}
