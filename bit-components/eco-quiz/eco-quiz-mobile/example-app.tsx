/* eslint-disable jsx-a11y/accessible-emoji, react/no-unescaped-entities */
import { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import type { Cause } from './types';
import { QUESTIONS } from './questions';
import { showRewardedAd } from './admob';

const COLORS = {
  green: '#1fae87',
  greenDark: '#148f6d',
  greenLight: '#d3f5ea',
  blue: '#1f7fae',
  blueDark: '#14688f',
  blueLight: '#d3ecf5',
  ink: '#0f2f2a',
  muted: '#5c7a74',
  white: '#ffffff',
  wrong: '#e5806f',
  wrongBg: '#fbe4df',
};

const ENERGY_PER_CORRECT = 20;
const TIERS = [50, 100, 150, 200];
const GAUGE_MAX = TIERS[TIERS.length - 1];
const AD_REWARD = 0.5;

const CATEGORY_LABELS: Record<string, string> = {
  animaux: '🐾 Animaux',
  oceans: '🌊 Océans',
  environnement: '🌍 Environnement',
};

/**
 * Native Éco Quiz app — a free general-knowledge quiz about animals and the
 * environment, with an energy gauge, real Google AdMob rewarded ads (with a
 * simulated fallback), and virtual counters for the SPA and ocean protection.
 */
export default function ExampleApp() {
  const [index, setIndex] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [reachedTiers, setReachedTiers] = useState<number[]>([]);
  const [adTier, setAdTier] = useState<number | null>(null);
  const [adLoading, setAdLoading] = useState(false);
  const [adDone, setAdDone] = useState(false);
  const [finished, setFinished] = useState(false);
  const [causes, setCauses] = useState<Cause[]>([
    { key: 'spa', label: 'Récoltés pour la SPA', icon: '🐾', amount: 0 },
    { key: 'oceans', label: 'Protection des océans', icon: '🌊', amount: 0 },
  ]);

  const question = QUESTIONS[index];
  const totalFunds = useMemo(() => causes.reduce((s, c) => s + c.amount, 0), [causes]);
  const gaugePct = Math.min(100, (energy / GAUGE_MAX) * 100);

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === question.correctIndex) {
      const newEnergy = Math.min(GAUGE_MAX, energy + ENERGY_PER_CORRECT);
      setEnergy(newEnergy);
      setCorrectCount((c) => c + 1);
      const newTier = TIERS.find((t) => newEnergy >= t && !reachedTiers.includes(t));
      if (newTier !== undefined) {
        setReachedTiers((t) => [...t, newTier]);
        setAdTier(newTier);
        setAdDone(false);
      }
    }
  };

  const watchAd = async () => {
    setAdLoading(true);
    const result = await showRewardedAd();
    setAdLoading(false);
    if (result.rewarded) {
      setCauses((prev) =>
        prev.map((c) => {
          const target = (adTier ?? 0) % 2 === 0 ? 'spa' : 'oceans';
          return c.key === target ? { ...c, amount: c.amount + AD_REWARD } : c;
        }),
      );
      setAdDone(true);
    }
  };

  const handleNext = () => {
    setAdTier(null);
    setSelected(null);
    if (index + 1 >= QUESTIONS.length) setFinished(true);
    else setIndex((i) => i + 1);
  };

  const restart = () => {
    setIndex(0);
    setEnergy(0);
    setSelected(null);
    setCorrectCount(0);
    setReachedTiers([]);
    setAdTier(null);
    setAdDone(false);
    setFinished(false);
    setCauses([
      { key: 'spa', label: 'Récoltés pour la SPA', icon: '🐾', amount: 0 },
      { key: 'oceans', label: 'Protection des océans', icon: '🌊', amount: 0 },
    ]);
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Éco Quiz</Text>
            <Text style={styles.subtitle}>Anime la planète, une réponse à la fois</Text>
          </View>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>100 % GRATUIT</Text>
          </View>
        </View>

        {/* Energy gauge */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.energyLabel}>⚡ Jauge d'énergie solidaire</Text>
            <Text style={styles.energyValue}>
              {energy} / {GAUGE_MAX} pts
            </Text>
          </View>
          <View style={styles.gaugeTrack}>
            <View style={[styles.gaugeFill, { width: `${gaugePct}%` }]} />
          </View>
          <View style={styles.rowBetween}>
            {TIERS.map((t) => (
              <Text
                key={t}
                style={[styles.tier, energy >= t && styles.tierHit]}
              >
                {energy >= t ? '✓ ' : ''}
                {t}
              </Text>
            ))}
          </View>
        </View>

        {/* Funds */}
        <View style={styles.funds}>
          {causes.map((c) => (
            <View key={c.key} style={styles.fundCard}>
              <Text style={styles.fundIcon}>{c.icon}</Text>
              <Text style={styles.fundAmount}>{c.amount.toFixed(2)} €</Text>
              <Text style={styles.fundLabel}>{c.label}</Text>
            </View>
          ))}
        </View>

        {/* Rewarded AdMob ad */}
        {adTier !== null && (
          <View style={styles.ad}>
            <Text style={styles.adTag}>Publicité solidaire · Google AdMob</Text>
            <Text style={styles.adTitle}>Palier {adTier} atteint 🎉</Text>
            <Text style={styles.adText}>
              Regardez une courte pub récompensée pour reverser des fonds à la cause.
            </Text>
            {adDone && (
              <Text style={styles.adReward}>✓ Merci ! +{AD_REWARD.toFixed(2)} € reversés</Text>
            )}
            {!adDone && adLoading && (
              <ActivityIndicator color={COLORS.blue} style={{ marginTop: 10 }} />
            )}
            {!adDone && !adLoading && (
              <TouchableOpacity style={styles.adBtn} onPress={watchAd}>
                <Text style={styles.adBtnText}>▶ Regarder la pub récompensée</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Quiz / End */}
        {finished ? (
          <View style={styles.card}>
            <Text style={styles.endEmoji}>🎉</Text>
            <Text style={styles.endTitle}>Quiz terminé !</Text>
            <Text style={styles.endStat}>
              Bonnes réponses : {correctCount} / {QUESTIONS.length}
            </Text>
            <Text style={styles.endStat}>Énergie accumulée : {energy} pts</Text>
            <Text style={styles.endStatLabel}>Total récolté pour les causes</Text>
            <Text style={styles.endBig}>{totalFunds.toFixed(2)} €</Text>
            <TouchableOpacity style={styles.nextBtn} onPress={restart}>
              <Text style={styles.nextBtnText}>🔄 Rejouer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.catTag}>
              <Text style={styles.catTagText}>{CATEGORY_LABELS[question.category]}</Text>
            </View>
            <Text style={styles.progress}>
              Question {index + 1} / {QUESTIONS.length}
            </Text>
            <Text style={styles.question}>{question.text}</Text>
            {question.options.map((opt, i) => {
              const isCorrect = selected !== null && i === question.correctIndex;
              const isWrong = selected === i && i !== question.correctIndex;
              return (
                <TouchableOpacity
                  key={i}
                  disabled={selected !== null}
                  style={[
                    styles.option,
                    isCorrect && styles.optionCorrect,
                    isWrong && styles.optionWrong,
                  ]}
                  onPress={() => handleAnswer(i)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isCorrect && styles.optionTextCorrect,
                      isWrong && styles.optionTextWrong,
                    ]}
                  >
                    {opt}
                    {isCorrect ? '  ✓' : ''}
                    {isWrong ? '  ✕' : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {selected !== null && (
              <>
                <View style={styles.explanation}>
                  <Text style={styles.explanationText}>💡 {question.explanation}</Text>
                </View>
                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                  <Text style={styles.nextBtnText}>
                    {index + 1 >= QUESTIONS.length ? 'Voir mes résultats' : 'Question suivante →'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        <Text style={styles.footer}>
          Jeu 100 % gratuit · Aucun paiement{'\n'}
          Les pubs solidaires financent la SPA 🐾 et les océans 🌊
        </Text>
      </ScrollView>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.greenLight },
  scroll: { padding: 18, paddingTop: 54, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 24 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.ink },
  subtitle: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  freeBadge: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  freeBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    gap: 12,
    shadowColor: COLORS.greenDark,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  energyLabel: { fontWeight: '700', fontSize: 14, color: COLORS.ink },
  energyValue: { fontSize: 13, color: COLORS.muted, fontWeight: '600' },
  gaugeTrack: {
    height: 16,
    backgroundColor: COLORS.greenLight,
    borderRadius: 999,
    overflow: 'hidden',
  },
  gaugeFill: { height: '100%', backgroundColor: COLORS.green, borderRadius: 999 },
  tier: { fontSize: 11, color: COLORS.muted },
  tierHit: { color: COLORS.greenDark, fontWeight: '700' },
  funds: { flexDirection: 'row', gap: 12 },
  fundCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    shadowColor: COLORS.greenDark,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  fundIcon: { fontSize: 24 },
  fundAmount: { fontSize: 18, fontWeight: '800', color: COLORS.greenDark, marginVertical: 3 },
  fundLabel: { fontSize: 11, color: COLORS.muted, textAlign: 'center' },
  ad: {
    borderWidth: 2,
    borderColor: COLORS.blue,
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(31,127,174,0.06)',
    alignItems: 'center',
  },
  adTag: { fontSize: 10, color: COLORS.muted, letterSpacing: 1 },
  adTitle: { fontSize: 15, fontWeight: '700', color: COLORS.blueDark, marginVertical: 5 },
  adText: { fontSize: 13, color: COLORS.muted, textAlign: 'center', marginBottom: 10 },
  adBtn: { backgroundColor: COLORS.blue, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999 },
  adBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  adReward: { marginTop: 8, fontSize: 14, fontWeight: '700', color: COLORS.greenDark },
  catTag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.blueLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  catTagText: { fontSize: 11, fontWeight: '700', color: COLORS.blueDark },
  progress: { fontSize: 12, color: COLORS.muted, fontWeight: '600' },
  question: { fontSize: 18, fontWeight: '700', color: COLORS.ink, lineHeight: 25 },
  option: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.greenLight,
    backgroundColor: '#fbfffe',
  },
  optionCorrect: { borderColor: COLORS.green, backgroundColor: COLORS.greenLight },
  optionWrong: { borderColor: COLORS.wrong, backgroundColor: COLORS.wrongBg },
  optionText: { fontSize: 15, fontWeight: '600', color: COLORS.ink },
  optionTextCorrect: { color: COLORS.greenDark },
  optionTextWrong: { color: '#b2432f' },
  explanation: { backgroundColor: COLORS.blueLight, borderRadius: 14, padding: 12 },
  explanationText: { fontSize: 13, color: COLORS.blueDark, lineHeight: 19 },
  nextBtn: {
    backgroundColor: COLORS.green,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  nextBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  endEmoji: { fontSize: 50, textAlign: 'center' },
  endTitle: { fontSize: 22, fontWeight: '800', color: COLORS.ink, textAlign: 'center' },
  endStat: { fontSize: 14, color: COLORS.muted, textAlign: 'center' },
  endStatLabel: { fontSize: 13, color: COLORS.muted, textAlign: 'center', marginTop: 6 },
  endBig: { fontSize: 26, fontWeight: '800', color: COLORS.greenDark, textAlign: 'center' },
  footer: { textAlign: 'center', fontSize: 12, color: COLORS.muted, lineHeight: 18, marginTop: 8 },
});
