import { HttpException, Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, SaveOptions, Connection } from 'mongoose';

export interface FindOptions {
  skip: number;
  limit: number;
  select: string;
}

export abstract class AbstractRepository<TDocument> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

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
    let document: TDocument;

    try {
      document = await this.model.findOne(filterQuery, {}, { lean: true });
    } catch (error) {
      throw new HttpException(
        'Please wait a few minutes before try again.',
        500,
      );
    }

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
      throw new HttpException(
        'Please wait a few minutes before try again.',
        500,
      );
    }
  }

  async find(
    filterQuery: FilterQuery<TDocument>,
    options?: FindOptions,
  ): Promise<TDocument[]> {
    if (!options) return await this.model.find(filterQuery, {}, { lean: true });

    return await this.model
      .find(filterQuery, {}, { lean: true })
      .skip(options.skip)
      .limit(options.limit)
      .select(options.select);
  }

  async countDocuments() {
    return await this.model.countDocuments();
  }

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}
