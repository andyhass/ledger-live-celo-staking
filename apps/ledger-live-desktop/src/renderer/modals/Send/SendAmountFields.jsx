// @flow
import React from "react";
import type {
  Account,
  Transaction,
  TransactionStatus,
  FeeStrategy,
} from "@ledgerhq/live-common/types/index";

import byFamily from "~/renderer/generated/SendAmountFields";

type Props = {
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
  onChange: Transaction => void,
  updateTransaction: (updater: any) => void,
  mapStrategies?: FeeStrategy => FeeStrategy & { [string]: * },
};

const AmountRelatedField = (props: Props) => {
  const module = byFamily[props.account.currency.family];
  if (!module) return null;
  const Cmp = module.component;
  return <Cmp {...props} />;
};

export default AmountRelatedField;
