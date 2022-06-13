import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Box, Flex, Text } from "@ledgerhq/native-ui";
import { Image } from "react-native";
import { ScreenName } from "../../../const";
import StyledStatusBar from "../../../components/StyledStatusBar";
import Button from "../../../components/wrappedUi/Button";
import { track, identify } from "../../../analytics";
import { useCurrentRouteName } from "../../../helpers/routeHooks";
import getOrCreateUser from "../../../user";

const RenderVertical = require("../../../../apps/ledger-live-mobile/assets/images/devices/3DRenderVertical.png");

type UserProperties = { [key: string]: any };

async function identifyUser(properties: UserProperties) {
  const { user } = await getOrCreateUser();
  identify(user.id, properties);
}

function OnboardingStepDoYouHaveALedgerDevice({ navigation }: any) {
  const { t } = useTranslation();

  // TODO analytics : if device detected : track("Has at least 1 device", true);

  const nextHaveALedger = useCallback(() => {
    identifyUser({ First_connection_has_device: true });

    track("button_clicked", {
      button: "Yes",
      screen: ScreenName.OnboardingDoYouHaveALedgerDevice,
    });

    // TODO: FIX @react-navigation/native using Typescript
    // @ts-ignore next-line
    navigation.navigate({
      name: ScreenName.OnboardingPostWelcomeSelection,
      params: {
        userHasDevice: true,
      },
    });
  }, [navigation]);

  const currentRoute = useCurrentRouteName();

  const nextDontHaveALedger = useCallback(() => {
    identifyUser({ First_connection_has_device: false });

    track("button_clicked", {
      First_connection_has_device: false,
      button: "No",
      screen: currentRoute,
    });

    // TODO: FIX @react-navigation/native using Typescript
    // @ts-ignore next-line
    navigation.navigate({
      name: ScreenName.OnboardingPostWelcomeSelection,
      params: {
        userHasDevice: false,
      },
    });
  }, [navigation]);

  return (
    <Flex flex={1}>
      <StyledStatusBar barStyle="light-content" />
      <Box flex={1} justifyContent="center" alignItems="center" mt={8} mx={7}>
        <Image
          source={RenderVertical}
          resizeMode={"contain"}
          style={{ flex: 1, width: "100%" }}
        />
      </Box>
      <Flex px={6} pb={6}>
        <Text variant="large" fontWeight="medium" color="neutral.c70" pb={2}>
          {t("onboarding.stepDoYouHaveALedgerDevice.subtitle")}
        </Text>
        <Text variant="h4" color="neutral.c100" pb={8}>
          {t("onboarding.stepDoYouHaveALedgerDevice.title")}
        </Text>
        <Button
          type="main"
          size="large"
          event="Onboarding - Start"
          onPress={nextHaveALedger}
          mb={6}
        >
          {t("common.yes")}
        </Button>
        <Button
          type="main"
          size="large"
          event="Onboarding - Start"
          onPress={nextDontHaveALedger}
        >
          {t("common.no")}
        </Button>
      </Flex>
    </Flex>
  );
}

export default OnboardingStepDoYouHaveALedgerDevice;
