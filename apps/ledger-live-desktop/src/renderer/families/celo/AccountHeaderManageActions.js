// @flow
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import type { Account } from "@ledgerhq/live-common/lib/types";

import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { openModal } from "~/renderer/actions/modals";
import { useTranslation } from "react-i18next";
import { themeSelector } from "~/renderer/actions/general";
import theme from "~/renderer/styles/theme";

type Props = {
  account: Account,
};

const Icon = (props: *) => {
  const currentTheme = useSelector(themeSelector);

  return (
    <CryptoCurrencyIcon
      {...props}
      overrideColor={currentTheme === "dark" ? theme.colors.dark : theme.colors.white}
    />
  );
};

const AccountHeaderManageActions = ({ account }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentTheme = useSelector(themeSelector);

  const onClick = useCallback(() => {
    dispatch(
      openModal("MODAL_CELO_MANAGE", {
        account,
      }),
    );
  }, [dispatch, account]);

  return [
    {
      key: "celo",
      onClick: onClick,
      icon: Icon,
      disabled: false,
      label: t("celo.manage.title"),
    },
  ];
};

export default AccountHeaderManageActions;
