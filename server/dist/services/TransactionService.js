import Investor from '../models/Investor';
import Transaction from '../models/Transaction';
import { CustomError } from '../utils/error/CustomError';
import logger from '../utils/logger/logger';
export class TransactionService {
    static async createTransaction(data) {
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
        }
        catch (error) {
            logger.error('Error creating transaction', { error });
            throw error;
        }
    }
    static async getTransactionById(id) {
        const transaction = await Transaction.findByPk(id, {
            include: [{ model: Investor, as: 'investor' }],
        });
        if (!transaction) {
            throw new CustomError(404, `Transaction with id ${id} not found`);
        }
        return transaction;
    }
    static async updateTransaction(id, data) {
        logger.info(`TransactionService.updateTransaction called for id=${id}`, { data });
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            throw new CustomError(404, `Transaction with id ${id} not found`);
        }
        if (data.amount !== undefined)
            transaction.amount = data.amount;
        if (data.participatingAccount !== undefined)
            transaction.participatingAccount = data.participatingAccount;
        if (data.narration !== undefined)
            transaction.narration = data.narration;
        if (data.date !== undefined)
            transaction.date = data.date;
        if (data.type !== undefined)
            transaction.type = data.type;
        if (data.receipt !== undefined)
            transaction.receipt = data.receipt;
        if (data.isConfirmed !== undefined)
            transaction.isConfirmed = data.isConfirmed;
        await transaction.save();
        logger.info(`Transaction updated successfully for id=${id}`);
        return transaction;
    }
    static async deleteTransaction(id) {
        logger.info(`TransactionService.deleteTransaction called for id=${id}`);
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            throw new CustomError(404, `Transaction with id ${id} not found`);
        }
        await transaction.destroy();
        logger.info(`Transaction deleted successfully for id=${id}`);
        return true;
    }
    static async confirmTransaction(id) {
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
    static async uploadReceipt(id, receiptUrl) {
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
