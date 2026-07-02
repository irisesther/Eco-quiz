import { Platform } from 'react-native';
import mobileAds, {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
} from 'react-native-google-mobile-ads';

/**
 * Real Google AdMob integration for the native (Expo/React Native) app.
 *
 * AdMob runs natively (unlike the web). This module uses the real
 * `react-native-google-mobile-ads` SDK to show a genuine rewarded ad.
 *
 * NOTE: real ads require a dev/production build (EAS Build) — Expo Go cannot run
 * native ad modules. If the ad fails to load in an unsupported environment, the
 * call resolves as a simulated reward so gameplay is never blocked.
 *
 * To go to PRODUCTION:
 *   1. Create an AdMob account: https://admob.google.com
 *   2. Put your App IDs in app.json (react-native-google-mobile-ads plugin).
 *   3. Replace the rewarded Ad Unit IDs below with your real ones.
 *   4. Build with EAS: `eas build`.
 */

/** Real AdMob rewarded Ad Unit IDs — replace iOS once you get it from AdMob. */
export const REWARDED_AD_UNIT = {
  android: 'ca-app-pub-1405762716968051/8620251260', // Solidarité — Android
  ios: 'ca-app-pub-1405762716968051/6175262772', // Eco asso — iOS
};

/** Whether real (non-test) Ad Unit IDs have been configured. */
export const USING_TEST_IDS = false;

let initialized = false;

/**
 * Initializes the Google Mobile Ads SDK once. Safe to call multiple times.
 */
export async function initAdMob(): Promise<void> {
  if (initialized) return;
  try {
    await mobileAds().initialize();
    initialized = true;
  } catch {
    /* SDK unavailable (e.g. Expo Go) — showRewardedAd will fall back. */
  }
}

/** Result of showing a rewarded ad. */
export type RewardResult = {
  /** Whether the ad completed and the user earned the reward. */
  rewarded: boolean;
  /** Whether a real AdMob ad was shown (vs. the simulated fallback). */
  real: boolean;
};

/**
 * Shows a rewarded solidarity ad and resolves once it is closed or errors out.
 *
 * @returns a RewardResult indicating whether the reward was earned and whether a
 * real AdMob ad or the simulated fallback was used.
 */
export function showRewardedAd(): Promise<RewardResult> {
  return new Promise<RewardResult>((resolve) => {
    const unitId = Platform.OS === 'ios' ? REWARDED_AD_UNIT.ios : REWARDED_AD_UNIT.android;

    let settled = false;
    const settle = (result: RewardResult) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    // Fallback for environments where AdMob cannot run (e.g. Expo Go):
    // if nothing loads within a few seconds, grant a simulated reward.
    const fallbackTimer = setTimeout(() => settle({ rewarded: true, real: false }), 4000);

    try {
      const ad = RewardedAd.createForAdRequest(unitId, {
        requestNonPersonalizedAdsOnly: true,
      });
      let earned = false;

      const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
        clearTimeout(fallbackTimer);
        ad.show();
      });
      const unsubEarned = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        earned = true;
      });
      const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
        unsubLoaded();
        unsubEarned();
        unsubClosed();
        settle({ rewarded: earned, real: true });
      });
      const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
        unsubLoaded();
        unsubEarned();
        unsubClosed();
        unsubError();
        clearTimeout(fallbackTimer);
        // Fall back to a simulated reward on load/show error.
        settle({ rewarded: true, real: false });
      });

      ad.load();
    } catch {
      clearTimeout(fallbackTimer);
      settle({ rewarded: true, real: false });
    }
  });
}
