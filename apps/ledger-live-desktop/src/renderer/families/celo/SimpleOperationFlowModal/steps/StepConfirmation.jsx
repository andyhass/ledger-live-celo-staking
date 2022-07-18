// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { withTheme } from "styled-components";
import { SyncOneAccountOnMount } from "@ledgerhq/live-common/bridge/react/index";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import RetryButton from "~/renderer/components/RetryButton";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import SuccessDisplay from "~/renderer/components/SuccessDisplay";
import BroadcastErrorDisclaimer from "~/renderer/components/BroadcastErrorDisclaimer";
import * as S from "./StepConfirmation.styles";
import type { StepProps } from "../types";

export const StepConfirmationFooter = ({
  transitionTo,
  account,
  parentAccount,
  onRetry,
  error,
  openModal,
  onClose,
  optimisticOperation,
  mode,
}: StepProps) => {
  const openManageModal = useCallback(() => {
    onClose();
    if (account) {
      openModal("MODAL_CELO_MANAGE", {
        account: account,
      });
    }
  }, [account, onClose, openModal]);

  return (
    <Box horizontal alignItems="right">
      {error ? (
        <RetryButton primary ml={2} onClick={onRetry} />
      ) : (
        <Button ml={2} primary onClick={openManageModal}>
          <Trans i18nKey={`celo.simpleOperation.steps.confirmation.modes.${mode}.success.cta`} />
        </Button>
      )}
    </Box>
  );
};

const StepConfirmation = ({
  account,
  t,
  optimisticOperation,
  error,
  theme,
  device,
  signed,
  transaction,
  mode,
}: StepProps & { theme: * }) => {
  if (optimisticOperation) {
    return (
      <S.Container>
        <TrackPage category="Celo SimpleOperation" name="Step Confirmed" />
        <SyncOneAccountOnMount priority={10} accountId={optimisticOperation.accountId} />
        <SuccessDisplay
          title={
            <Trans
              i18nKey={`celo.simpleOperation.steps.confirmation.modes.${mode}.success.title`}
            />
          }
          description={
            <div>
              <Trans i18nKey={`celo.simpleOperation.steps.confirmation.modes.${mode}.success.text`}>
                <b></b>
              </Trans>
            </div>
          }
        />
      </S.Container>
    );
  }

  if (error) {
    return (
      <S.Container shouldSpace={signed}>
        <TrackPage category="Celo SimpleOperation" name="Step Confirmation Error" />
        {signed ? (
          <BroadcastErrorDisclaimer
            title={<Trans i18nKey="celo.simpleOperation.steps.confirmation.broadcastError" />}
          />
        ) : null}
        <ErrorDisplay error={error} withExportLogs />
      </S.Container>
    );
  }

  return null;
};

export default withTheme(StepConfirmation);
