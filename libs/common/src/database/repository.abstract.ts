import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, SaveOptions } from 'mongoose';
import { AbstractDocument } from './schema.abstract';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(
    document: Omit<TDocument, '_id'>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    verify = true,
  ): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document && verify) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async deleteOne(filterQuery: FilterQuery<TDocument>) {
    const document = await this.findOne(filterQuery);

    try {
      return await this.model.deleteOne(document);
    } catch (error) {
      this.logger.warn('Error or delete Document', document);
      throw new NotFoundException(
        'Please wait a few minutes before try again.',
      );
    }
  }

  async find(filterQuery: FilterQuery<TDocument>) {
    return this.model.find(filterQuery, {}, { lean: true });
  }
}
