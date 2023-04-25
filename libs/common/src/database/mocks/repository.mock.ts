import { Logger } from '@nestjs/common';
import { AbstractRepository } from '../repository.abstract';
import { AbstractDocument } from '../schema.abstract';
import {
  ClientSession,
  ClientSessionEvents,
  ClusterTime,
  CommonEvents,
  Document,
  GenericListener,
  MongoOptions,
  ServerSession,
  ServerSessionId,
  Timestamp,
  Transaction,
  TransactionOptions,
  WithTransactionCallback,
} from 'mongodb';

export class MockRepository<TDocument extends AbstractDocument>
  implements Partial<AbstractRepository<TDocument>>
{
  protected readonly logger: Logger;
  public create = jest.fn().mockImplementation((data) => ({
    ...data,
    save: () => Promise.resolve(),
  }));
  public findOne = jest.fn();
  public deleteOne = jest.fn();
  public find = jest.fn();
  public countDocuments = jest.fn();
  public startTransaction = jest.fn();
}

export class MockSession {
  public commitTransaction = jest.fn();
  public abortTransaction = jest.fn().mockImplementation(() => {});
  public endSession = jest.fn();

  hasEnded: boolean;
  clientOptions?: MongoOptions;
  supports: { causalConsistency: boolean };
  clusterTime?: ClusterTime;
  operationTime?: Timestamp;
  explicit: boolean;
  defaultTransactionOptions: TransactionOptions;
  transaction: Transaction;

  get id(): ServerSessionId {
    throw new Error('Method not implemented.');
  }
  get serverSession(): ServerSession {
    throw new Error('Method not implemented.');
  }
  get snapshotEnabled(): boolean {
    throw new Error('Method not implemented.');
  }
  get loadBalanced(): boolean {
    throw new Error('Method not implemented.');
  }
  get isPinned(): boolean {
    throw new Error('Method not implemented.');
  }
  advanceOperationTime(operationTime: Timestamp): void {
    throw new Error('Method not implemented.');
  }
  advanceClusterTime(clusterTime: ClusterTime): void {
    throw new Error('Method not implemented.');
  }
  equals(session: ClientSession): boolean {
    throw new Error('Method not implemented.');
  }
  incrementTransactionNumber(): void {
    throw new Error('Method not implemented.');
  }
  inTransaction(): boolean {
    throw new Error('Method not implemented.');
  }
  startTransaction(options?: TransactionOptions): void {
    throw new Error('Method not implemented.');
  }
  toBSON(): never {
    throw new Error('Method not implemented.');
  }
  withTransaction<T = void>(
    fn: WithTransactionCallback<T>,
    options?: TransactionOptions,
  ): Promise<Document> {
    throw new Error('Method not implemented.');
  }
  addListener<EventKey extends 'ended'>(
    event: EventKey,
    listener: ClientSessionEvents[EventKey],
  ): this;
  addListener(
    event: CommonEvents,
    listener: (eventName: string | symbol, listener: GenericListener) => void,
  ): this;
  addListener(event: string | symbol, listener: GenericListener): this;
  addListener(event: unknown, listener: unknown): this {
    throw new Error('Method not implemented.');
  }
  on<EventKey extends 'ended'>(
    event: EventKey,
    listener: ClientSessionEvents[EventKey],
  ): this;
  on(
    event: CommonEvents,
    listener: (eventName: string | symbol, listener: GenericListener) => void,
  ): this;
  on(event: string | symbol, listener: GenericListener): this;
  on(event: unknown, listener: unknown): this {
    throw new Error('Method not implemented.');
  }
  once<EventKey extends 'ended'>(
    event: EventKey,
    listener: ClientSessionEvents[EventKey],
  ): this;
  once(
    event: CommonEvents,
    listener: (eventName: string | symbol, listener: GenericListener) => void,
  ): this;
  once(event: string | symbol, listener: GenericListener): this;
  once(event: unknown, listener: unknown): this {
    throw new Error('Method not implemented.');
  }
  removeListener<EventKey extends 'ended'>(
    event: EventKey,
    listener: ClientSessionEvents[EventKey],
  ): this;
  removeListener(
    event: CommonEvents,
    listener: (eventName: string | symbol, listener: GenericListener) => void,
  ): this;
  removeListener(event: string | symbol, listener: GenericListener): this;
  removeListener(event: unknown, listener: unknown): this {
    throw new Error('Method not implemented.');
  }
  off<EventKey extends 'ended'>(
    event: EventKey,
    listener: ClientSessionEvents[EventKey],
  ): this;
  off(
    event: CommonEvents,
    listener: (eventName: string | symbol, listener: GenericListener) => void,
  ): this;
  off(event: string | symbol, listener: GenericListener): this;
  off(event: unknown, listener: unknown): this {
    throw new Error('Method not implemented.');
  }
  removeAllListeners<EventKey extends 'ended'>(
    event?: string | symbol | EventKey,
  ): this {
    throw new Error('Method not implemented.');
  }
  listeners<EventKey extends 'ended'>(
    event: string | symbol | EventKey,
  ): ClientSessionEvents[EventKey][] {
    throw new Error('Method not implemented.');
  }
  rawListeners<EventKey extends 'ended'>(
    event: string | symbol | EventKey,
  ): ClientSessionEvents[EventKey][] {
    throw new Error('Method not implemented.');
  }
  emit<EventKey extends 'ended'>(
    event: symbol | EventKey,
    ...args: Parameters<ClientSessionEvents[EventKey]>
  ): boolean {
    throw new Error('Method not implemented.');
  }
  listenerCount<EventKey extends 'ended'>(
    type: string | symbol | EventKey,
  ): number {
    throw new Error('Method not implemented.');
  }
  prependListener<EventKey extends 'ended'>(
    event: EventKey,
    listener: ClientSessionEvents[EventKey],
  ): this;
  prependListener(
    event: CommonEvents,
    listener: (eventName: string | symbol, listener: GenericListener) => void,
  ): this;
  prependListener(event: string | symbol, listener: GenericListener): this;
  prependListener(event: unknown, listener: unknown): this {
    throw new Error('Method not implemented.');
  }
  prependOnceListener<EventKey extends 'ended'>(
    event: EventKey,
    listener: ClientSessionEvents[EventKey],
  ): this;
  prependOnceListener(
    event: CommonEvents,
    listener: (eventName: string | symbol, listener: GenericListener) => void,
  ): this;
  prependOnceListener(event: string | symbol, listener: GenericListener): this;
  prependOnceListener(event: unknown, listener: unknown): this {
    throw new Error('Method not implemented.');
  }
  eventNames(): string[] {
    throw new Error('Method not implemented.');
  }
  getMaxListeners(): number {
    throw new Error('Method not implemented.');
  }
  setMaxListeners(n: number): this {
    throw new Error('Method not implemented.');
  }
}
