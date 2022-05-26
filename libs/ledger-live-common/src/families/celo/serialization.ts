// @flow
import type { CeloResources, CeloResourcesRaw } from "./types";
import { BigNumber } from "bignumber.js";

export function toCeloResourcesRaw(r: CeloResources): CeloResourcesRaw {
  const {
    registrationStatus,
    lockedBalance,
    nonvotingLockedBalance,
    pendingWithdrawals,
    votes,
  } = r;
  return {
    registrationStatus,
    lockedBalance: lockedBalance.toString(),
    nonvotingLockedBalance: nonvotingLockedBalance.toString(),
    pendingWithdrawals: pendingWithdrawals?.map((withdrawal) => ({
      value: withdrawal.value.toString(),
      time: withdrawal.time.toString(),
      index: withdrawal.index.toString(),
    })),
    votes: votes?.map((vote) => ({
      validatorGroup: vote.validatorGroup.toString(),
      amount: vote.amount.toString(),
      activatable: vote.activatable,
      revokable: vote.revokable,
      type: vote.type,
      index: vote.index,
    })),
  };
}

export function fromCeloResourcesRaw(r: CeloResourcesRaw): CeloResources {
  const { registrationStatus, lockedBalance, nonvotingLockedBalance, votes } =
    r;
  return {
    registrationStatus,
    lockedBalance: new BigNumber(lockedBalance),
    nonvotingLockedBalance: new BigNumber(nonvotingLockedBalance),
    pendingWithdrawals: r.pendingWithdrawals?.map((u) => ({
      value: new BigNumber(u.value),
      time: new BigNumber(u.time),
      index: Number(u.index),
    })),
    votes: votes?.map((vote) => ({
      validatorGroup: vote.validatorGroup,
      amount: new BigNumber(vote.amount),
      activatable: vote.activatable,
      revokable: vote.revokable,
      type: vote.type,
      index: vote.index,
    })),
  };
}
