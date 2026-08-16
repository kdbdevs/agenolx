"use client";

import { useMemo, useState } from "react";
import type { DepositPaymentTarget } from "@/lib/payment-providers";

type DepositBankSelectorProps = {
  targets: DepositPaymentTarget[];
  disabled?: boolean;
  inputName?: string;
  recommendedBankName?: string;
};

function hasDepositAccount(target: DepositPaymentTarget) {
  return Boolean(target.depositAccountName && target.depositAccountNumber);
}

function bankNameMatches(target: DepositPaymentTarget, bankName: string) {
  return target.name.toLocaleLowerCase("id-ID").includes(bankName.toLocaleLowerCase("id-ID"));
}

export function DepositBankSelector({
  targets,
  disabled = false,
  inputName,
  recommendedBankName
}: DepositBankSelectorProps) {
  const recommendedTarget = useMemo(() => {
    if (!recommendedBankName) return null;
    return targets.find((target) => bankNameMatches(target, recommendedBankName)) ?? null;
  }, [recommendedBankName, targets]);
  const fallbackTarget = targets.find(hasDepositAccount) ?? targets[0] ?? null;
  const initialTarget = recommendedTarget ?? fallbackTarget;
  const [selectedTargetId, setSelectedTargetId] = useState(initialTarget?.id ?? null);
  const [recommendation, setRecommendation] = useState("");
  const selectedTarget = targets.find((target) => target.id === selectedTargetId) ?? initialTarget;
  const selectedTargetReady = selectedTarget ? hasDepositAccount(selectedTarget) : false;
  const shouldRecommend = Boolean(recommendedTarget && recommendedBankName);

  function handleSelect(target: DepositPaymentTarget) {
    if (disabled) return;

    if (shouldRecommend && recommendedTarget && target.id !== recommendedTarget.id) {
      setSelectedTargetId(recommendedTarget.id);
      setRecommendation(
        `${target.name} sedang gangguan. Saat ini kami rekomendasikan ${recommendedBankName} agar deposit lebih cepat diproses.`
      );
      return;
    }

    setSelectedTargetId(target.id);
    setRecommendation("");
  }

  return (
    <>
      <div className="bank-select bank-select--d">
        <span className="bank-select__label">Pilih Bank</span>
        <div className="bank-select__body">
          {targets.map((bank) => {
            const isRecommendedBank = recommendedTarget?.id === bank.id;
            const isChecked = selectedTarget?.id === bank.id;
            return (
              <div
                className={`bank-select__item${isRecommendedBank ? " bank-select__item--recommended" : ""}`}
                key={bank.code}
              >
                <label role="button" htmlFor={`deposit-target-${bank.code}`}>
                  {bank.logoUrl ? <img src={bank.logoUrl} alt={bank.name} /> : <span>{bank.name}</span>}
                </label>
                <input
                  id={`deposit-target-${bank.code}`}
                  className="bank-select__input"
                  type="radio"
                  name={inputName}
                  value={bank.id}
                  checked={isChecked}
                  disabled={disabled}
                  onChange={() => handleSelect(bank)}
                />
                <i className="bank-select__icon icon-circle icon--xs" />
              </div>
            );
          })}
        </div>
      </div>
      {recommendation ? (
        <div className="alert alert--warning wallet-bank-recommendation">
          <i className="icon-info icon--lg" />
          <p>{recommendation}</p>
        </div>
      ) : null}
      {selectedTargetReady ? (
        <div className="wallet-detail wallet-detail__deposit-to">
          <span>Tujuan Deposit</span>
          <div>
            <strong>{selectedTarget.name}</strong>
            <p>{selectedTarget.depositAccountName}</p>
            <p>{selectedTarget.depositAccountNumber}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
