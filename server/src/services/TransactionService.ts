import Investor from '../models/Investor.js';
import Transaction from '../models/Transaction.js';
import { CustomError } from '../utils/error/CustomError.js';
import logger from '../utils/logger/logger.js';

interface TransactionCreateInput {
  amount: number;
  participatingAccount: 'Company' | 'Investor';
  narration: string;
  date: Date;
  type: 'Debit' | 'Credit';
  investorId: number;
  receipt?: string;
  isConfirmed?: boolean;
}

interface TransactionUpdateInput {
  amount?: number;
  participatingAccount?: 'Company' | 'Investor';
  narration?: string;
  date?: Date;
  type?: 'Debit' | 'Credit';
  receipt?: string;
  isConfirmed?: boolean;
}

export class TransactionService {
  static async createTransaction(data: TransactionCreateInput) {
    logger.info('TransactionService.createTransaction called', { data });
    try {
      // Validate investor existence
      const investor = await Investor.findByPk(data.investorId);
      if (!investor) {
        throw new CustomError(404, `Investor with id ${data.investorId} not found`);
      }

      const transaction = await Transaction.create(data);
      logger.info('Transaction created successfully', { id: transaction.id });
      return transaction;
    } catch (error) {
      logger.error('Error creating transaction', { error });
      throw error;
    }
  }

  static async getTransactionById(id: number) {
    const transaction = await Transaction.findByPk(id, {
      include: [{ model: Investor, as: 'investor' }],
    });
    if (!transaction) {
      throw new CustomError(404, `Transaction with id ${id} not found`);
    }
    return transaction;
  }

  static async updateTransaction(id: number, data: TransactionUpdateInput) {
    logger.info(`TransactionService.updateTransaction called for id=${id}`, { data });

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      throw new CustomError(404, `Transaction with id ${id} not found`);
    }

    if (data.amount !== undefined) transaction.amount = data.amount;
    if (data.participatingAccount !== undefined) transaction.participatingAccount = data.participatingAccount;
    if (data.narration !== undefined) transaction.narration = data.narration;
    if (data.date !== undefined) transaction.date = data.date;
    if (data.type !== undefined) transaction.type = data.type;
    if (data.receipt !== undefined) transaction.receipt = data.receipt;
    if (data.isConfirmed !== undefined) transaction.isConfirmed = data.isConfirmed;

    await transaction.save();
    logger.info(`Transaction updated successfully for id=${id}`);
    return transaction;
  }

  static async deleteTransaction(id: number) {
    logger.info(`TransactionService.deleteTransaction called for id=${id}`);

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      throw new CustomError(404, `Transaction with id ${id} not found`);
    }

    await transaction.destroy();
    logger.info(`Transaction deleted successfully for id=${id}`);
    return true;
  }

  static async confirmTransaction(id: number) {
    logger.info(`TransactionService.confirmTransaction called for id=${id}`);

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      throw new CustomError(404, `Transaction with id ${id} not found`);
    }

    transaction.isConfirmed = true;
    await transaction.save();
    logger.info(`Transaction confirmed for id=${id}`);

    return transaction;
  }

  static async uploadReceipt(id: number, receiptUrl: string) {
    logger.info(`TransactionService.uploadReceipt called for id=${id}`);

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      throw new CustomError(404, `Transaction with id ${id} not found`);
    }

    transaction.receipt = receiptUrl;
    await transaction.save();
    logger.info(`Receipt uploaded for transaction id=${id}`);

    return transaction;
  }
}
