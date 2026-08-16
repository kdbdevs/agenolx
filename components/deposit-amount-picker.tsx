"use client";

import { useMemo, useState } from "react";

type DepositAmountPickerProps = {
  amounts: number[];
};

function formatIdr(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function DepositAmountPicker({ amounts }: DepositAmountPickerProps) {
  const [selectedAmount, setSelectedAmount] = useState(amounts[0] ?? 50000);
  const formattedAmount = useMemo(() => formatIdr(selectedAmount), [selectedAmount]);

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
                  onClick={() => setSelectedAmount(amount)}
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
          <input type="text" className="input" value={formattedAmount} readOnly />
          <i className="input__icon icon-coins icon--xs" />
        </div>
      </div>
    </>
  );
}
