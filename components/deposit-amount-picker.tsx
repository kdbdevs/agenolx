"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type DepositAmountPickerProps = {
  amounts: number[];
  disabled?: boolean;
};

const MIN_DEPOSIT_AMOUNT = 10000;

function formatIdr(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

function digitsToAmount(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

export function DepositAmountPicker({ amounts, disabled = false }: DepositAmountPickerProps) {
  const initialAmount = amounts[0] ?? 50000;
  const [amountText, setAmountText] = useState(formatIdr(initialAmount));
  const amountInputRef = useRef<HTMLInputElement>(null);
  const selectedAmount = useMemo(() => digitsToAmount(amountText), [amountText]);
  const amountError = selectedAmount > 0 && selectedAmount < MIN_DEPOSIT_AMOUNT
    ? `Minimal deposit ${formatIdr(MIN_DEPOSIT_AMOUNT)}`
    : "";

  useEffect(() => {
    amountInputRef.current?.setCustomValidity(amountError);
  }, [amountError]);

  function setPresetAmount(amount: number) {
    setAmountText(formatIdr(amount));
  }

  function handleManualAmount(value: string) {
    const amount = digitsToAmount(value);
    setAmountText(amount ? formatIdr(amount) : "");
  }

  return (
    <>
      <div className="preset-amounts">
        <div className="preset-amounts__label">
          <span>Pilih nominal</span>
          <button type="button" className="btn btn--sm-round btn--brand">
            <i className="icon-gear icon--md" />
          </button>
        </div>
        <div className="preset-amounts__body">
          {amounts.map((amount) => {
            const isSelected = amount === selectedAmount;
            return (
              <div className={`preset-amounts__item${isSelected ? " preset-amounts__item--active" : ""}`} key={amount}>
                <button
                  type="button"
                  className="btn btn--flex btn--light"
                  aria-pressed={isSelected}
                  disabled={disabled}
                  onClick={() => setPresetAmount(amount)}
                >
                  {formatIdr(amount)}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="input__container">
        <label>Jumlah</label>
        <div className="input__root">
          <input type="hidden" name="amount" value={selectedAmount} />
          <input
            ref={amountInputRef}
            type="text"
            className="input"
            value={amountText}
            inputMode="numeric"
            placeholder={`Minimal ${formatIdr(MIN_DEPOSIT_AMOUNT)}`}
            aria-describedby="deposit-amount-error"
            onChange={(event) => handleManualAmount(event.target.value)}
            onFocus={(event) => event.currentTarget.select()}
            disabled={disabled}
            required
          />
          <i className="input__icon icon-coins icon--xs" />
        </div>
        {amountError ? (
          <p id="deposit-amount-error" className="input__error">
            {amountError}
          </p>
        ) : null}
      </div>
    </>
  );
}
