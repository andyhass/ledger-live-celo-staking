/* @flow */
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import type { Account } from "@ledgerhq/live-common/types/index";
import { ScreenName } from "../../const";
import SettingsRow from "../../components/SettingsRow";

type Props = {
  navigation: *,
  account: Account,
};

class AccountAdvancedLogsRow extends PureComponent<Props> {
  render() {
    const { navigation, account } = this.props;

    return (
      <SettingsRow
        event="AccountAdvancedLogsRow"
        title={<Trans i18nKey="account.settings.advanced.title" />}
        arrowRight
        onPress={() =>
          navigation.navigate(ScreenName.AdvancedLogs, {
            accountId: account.id,
          })
        }
      />
    );
  }
}

export default AccountAdvancedLogsRow;
