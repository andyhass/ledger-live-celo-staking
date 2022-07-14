// @flow
import { getAddressExplorer, getDefaultExplorerView } from "@ledgerhq/live-common/lib/explorers";
import type { Account } from "@ledgerhq/live-common/lib/types";
import invariant from "invariant";
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { urls } from "~/config/urls";
import { openModal } from "~/renderer/actions/modals";
import Alert from "~/renderer/components/Alert";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import TableContainer, { TableHeader } from "~/renderer/components/TableContainer";
import Text from "~/renderer/components/Text";
import IconChartLine from "~/renderer/icons/ChartLine";
import DelegateIcon from "~/renderer/icons/Delegate";
import { openURL } from "~/renderer/linking";
import { Header } from "./Header";
import { Row } from "./Row";
import { CeloVote } from "@ledgerhq/live-common/lib/families/celo/types";
import {
  availablePendingWithdrawals,
  activatableVotes,
} from "@ledgerhq/live-common/lib/families/celo/logic";
type Props = {
  account: Account,
};

const Wrapper = styled(Box).attrs(() => ({
  p: 3,
}))`
  border-radius: 4px;
  justify-content: space-between;
  align-items: center;
`;

const Vote = ({ account }: Props) => {
  const { celoResources } = account;
  invariant(celoResources, "celo account and resources expected");
  const dispatch = useDispatch();

  const { votes } = celoResources;

  const onEarnRewards = useCallback(() => {
    dispatch(
      openModal("MODAL_CELO_REWARDS_INFO", {
        account,
      }),
    );
  }, [account, dispatch]);

  const onDelegate = useCallback(() => {
    dispatch(
      openModal("MODAL_CELO_VOTE", {
        account,
      }),
    );
  }, [account, dispatch]);

  const onActivate = useCallback(() => {
    dispatch(
      openModal("MODAL_CELO_ACTIVATE", {
        account,
      }),
    );
  }, [account, dispatch]);

  const onWithdraw = useCallback(() => {
    dispatch(
      openModal("MODAL_CELO_WITHDRAW", {
        account,
      }),
    );
  }, [account, dispatch]);

  const onRedirect = useCallback(
    (vote: CeloVote, modalName: string) => {
      dispatch(
        openModal(modalName, {
          account,
          vote,
        }),
      );
    },
    [account, dispatch],
  );

  const explorerView = getDefaultExplorerView(account.currency);
  const withdrawEnabled = availablePendingWithdrawals(account).length;
  const activatingEnabled = activatableVotes(account).length;

  const onExternalLink = useCallback(
    (vote: CeloVote) => {
      const url = getAddressExplorer(explorerView, vote.validatorGroup);

      if (url) {
        openURL(url);
      }
    },
    [explorerView],
  );

  const hasVotes = votes.length > 0;

  return (
    <>
      {!!withdrawEnabled && (
        <Alert
          type="warning"
          learnMoreLabel={<Trans i18nKey="celo.withdraw.title" />}
          learnMoreOnRight
          onLearnMore={onWithdraw}
          learnMoreIsInternal={true}
          mb={3}
        >
          <Trans i18nKey={`celo.alerts.withdrawableAssets`} />
        </Alert>
      )}
      {!!activatingEnabled && (
        <Alert
          type="warning"
          learnMoreLabel={<Trans i18nKey="celo.activate.title" />}
          learnMoreOnRight
          onLearnMore={onActivate}
          learnMoreIsInternal={true}
          mb={3}
        >
          <Trans i18nKey={`celo.alerts.activatableVotes`} />
        </Alert>
      )}
      <TableContainer mb={6}>
        <TableHeader title={<Trans i18nKey="celo.delegation.listHeader" />} />
        {hasVotes ? (
          <>
            <Header />
            {votes.map(vote => (
              <Row
                vote={vote}
                key={vote.validatorGroup + vote.index}
                account={account}
                onManageAction={onRedirect}
                onExternalLink={onExternalLink}
              />
            ))}
          </>
        ) : (
          <Wrapper horizontal>
            <Box style={{ maxWidth: "65%" }}>
              <Text ff="Inter|Medium|SemiBold" color="palette.text.shade60" fontSize={4}>
                <Trans
                  i18nKey="celo.delegation.emptyState.description"
                  values={{ name: account.currency.name }}
                />
              </Text>
              <Box mt={2}>
                <LinkWithExternalIcon
                  label={<Trans i18nKey="celo.delegation.emptyState.info" />}
                  onClick={() => openURL(urls.celo.learnMore)}
                />
              </Box>
            </Box>
            <Box>
              <Button primary small onClick={onEarnRewards}>
                <Box horizontal flow={1} alignItems="center">
                  <IconChartLine size={12} />
                  <Box>
                    <Trans i18nKey="celo.delegation.emptyState.delegation" />
                  </Box>
                </Box>
              </Button>
            </Box>
          </Wrapper>
        )}
      </TableContainer>
    </>
  );
};

const Votes = ({ account }: Props) => {
  if (!account.celoResources) return null;

  return <Vote account={account} />;
};

export default Votes;
