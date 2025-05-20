'use client'
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetList, useGetSingle } from "@/hooks/useFetch";
import { Manager } from "@/types/manager";
import { apiRoutes } from "@/constants/apiRoutes";
import { AdminWallet } from "@/types/adminWallet";
import { post } from "@/utils/apiClient";
import WAValidator from "multicoin-address-validator";
type InvestmentCreationDto = {
  amount: number;
  depositMeans: string;
  managerId: string | number;
  wallet: null | {
    adminWalletId: number;
    address: string;
    currency: string;
  };
};
const NewInvestmentForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [walletVerified, setWalletVerified] = useState(true);
  const [amount, setAmount] = useState(0);
  const [depositMeans, setDepositMeans] = useState("");
  const [address, setAddress] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<{
    id: number;
    currency: string;
  } | null>(null);

  const params = useParams();
console.log(params)
  const router = useRouter();
  const userId = 1;
  const rawManagerId = params.managerId;


  const managerId = Array.isArray(rawManagerId)
    ? rawManagerId[0]
    : rawManagerId;

  const {
    data: manager,
    loading: managerLoading,
    error: managerError,
  } = useGetSingle<Manager>(apiRoutes.manager.get(managerId ?? 0));
  console.log(manager)
  const {
    data: wallets,
    loading: walletsLoading,
    error: walletsError,
  } = useGetList<AdminWallet>(apiRoutes.adminWallet.list());

  if (managerLoading || walletsLoading) return <p>Loading...</p>;
  if (managerError || walletsError) return <p>Error loading data</p>;
  if (!manager) return <p>No manager found</p>;

  if (!managerId) return <div>No managerId</div>;
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAmount(value);
    if (value < manager.minimumInvestmentAmount) {
      setMessage(
        `Minimum amount must be at least ${manager.minimumInvestmentAmount} USD`
      );
    } else {
      setMessage("");
    }
  };

  const verifyAddress = (addr: string) => WAValidator.validate(addr);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    const valid = verifyAddress(value);
    setWalletVerified(valid);
  };

  const submitInvestment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (depositMeans === "CRYPTO" && !walletVerified) {
      setMessage("Invalid wallet address");
      return;
    }

    const payload: InvestmentCreationDto = {
      amount,
      managerId,
      depositMeans,
      wallet: depositMeans === "CRYPTO" && selectedWallet ? {adminWalletId:selectedWallet.id, currency:selectedWallet.currency, address } : null,
    };

    setSubmitting(true);

    try {
      const response = await post<
        InvestmentCreationDto,
        { investmentId: number | string }
      >(apiRoutes.investment.new(userId), payload);
      router.push(`/investment/${response.investmentId}`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit investment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {message && <p className="text-red-500">{message}</p>}
      <h6 className="text-center text-sm text-gray-400 mb-6">
        sCreate a managed portfolio
      </h6>
      <form className="space-y-6" onSubmit={submitInvestment} noValidate>
        <div>
          <label className="block text-white">Investment Manager *</label>
          <input
            type="text"
            value={`${manager.firstName} ${manager.lastName}`}
            readOnly
            className="w-full mt-1 bg-transparent border border-gray-700 text-white px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-white">
            Investment Amount (in USD) *
          </label>
          <input
            required
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="w-full mt-1 bg-transparent border border-gray-700 text-white px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-white">Preferred Deposit Means *</label>
          <select
            value={depositMeans}
            onChange={(e) => {
              setDepositMeans(e.target.value);
            }}
            className="w-full mt-1 bg-transparent border border-gray-700 text-white px-4 py-2 rounded"
          >
            <option value="">Select means of fund deposit</option>
            <option value="CRYPTO" className="text-black">
              Crypto Currency
            </option>
            <option value="FIAT" className="text-black">
              Fiat Deposit
            </option>
          </select>
        </div>

        {depositMeans === "CRYPTO" && (
          <>
            <select
              value={selectedWallet?.id ?? ""}
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                const wallet = wallets.find((w) => w.id === selectedId);
                if (wallet) {
                  setSelectedWallet({
                    id: wallet.id,
                    currency: wallet.currency,
                  });
                }
              }}
              className="w-full mt-1 bg-transparent border border-gray-700 text-white px-4 py-2 rounded"
            >
              <option value="">Select Deposit Crypto Currency</option>
              {wallets.map((wallet) => (
                <option
                  key={wallet.id}
                  value={wallet.id}
                  className="text-black"
                >
                  {wallet.currency}
                </option>
              ))}
            </select>

            <div>
              <label className="block text-white">
                Enter Your Wallet Address
              </label>
              <input
                required
                type="text"
                value={address}
                onChange={handleAddressChange}
                className="w-full mt-1 bg-transparent border border-gray-700 text-white px-4 py-2 rounded"
              />
              <p className="text-xs text-gray-400 mt-1">
                *This ensures you’re credited and receive your returns with
                ease.
              </p>
            </div>
          </>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-1/2 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
          >
            Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewInvestmentForm;
