import { AbstractAttachment } from './attachment';
import { AbstractResultSet } from './resultset';
import { AbstractTransaction } from './transaction';

import {
	ExecuteOptions,
	ExecuteQueryOptions,
	FetchOptions,
	Statement
} from '..';


/** AbstractStatement implementation. */
export abstract class AbstractStatement implements Statement {
	resultSet: AbstractResultSet;

	/** Default query's execute options. */
	defaultExecuteOptions: ExecuteOptions;

	/** Default query's executeQuery options. */
	defaultExecuteQueryOptions: ExecuteQueryOptions;

	/** Default result set's fetch options. */
	defaultFetchOptions: FetchOptions;

	protected constructor(public attachment: AbstractAttachment) {
	}

	/** Disposes this statement's resources. */
	async dispose(): Promise<void> {
		if (this.resultSet)
			await this.resultSet.close();

		await this.internalDispose();

		this.attachment.statements.delete(this);
		this.attachment = null;
	}

	/** Executes a prepared statement that uses the SET TRANSACTION command. Returns the new transaction. */
	async executeTransaction(transaction: AbstractTransaction): Promise<AbstractTransaction> {
		//// TODO: check opened resultSet.
		return await this.internalExecuteTransaction(transaction);
	}

	/** Executes a prepared statement that has no result set. */
	async execute(transaction: AbstractTransaction, parameters?: Array<any>, options?: ExecuteOptions): Promise<void> {
		//// TODO: check opened resultSet.
		return await this.internalExecute(transaction, parameters,
			options || this.attachment.defaultExecuteOptions || this.attachment.client.defaultExecuteOptions);
	}

	/** Executes a prepared statement that has result set. */
	async executeQuery(transaction: AbstractTransaction, parameters?: Array<any>, options?: ExecuteQueryOptions):
			Promise<AbstractResultSet> {
		//// TODO: check opened resultSet.
		const resultSet = await this.internalExecuteQuery(transaction, parameters,
			options || this.attachment.defaultExecuteQueryOptions || this.attachment.client.defaultExecuteQueryOptions);
		this.resultSet = resultSet;
		return resultSet;
	}

	protected abstract async internalDispose(): Promise<void>;
	protected abstract async internalExecuteTransaction(transaction: AbstractTransaction): Promise<AbstractTransaction>;
	protected abstract async internalExecute(transaction: AbstractTransaction, parameters?: Array<any>, options?: ExecuteOptions):
		Promise<void>;
	protected abstract async internalExecuteQuery(transaction: AbstractTransaction, parameters?: Array<any>, options?: ExecuteQueryOptions):
		Promise<AbstractResultSet>;
}