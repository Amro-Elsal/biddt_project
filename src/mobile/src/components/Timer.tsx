// src/components/Timer.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme, typography, spacing } from '../theme';

interface TimerProps {
  endTime: Date;
  theme: Theme;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  endTime,
  theme,
  size = 'md',
  showLabels = true,
}) => {
  const { colors } = theme;
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      expired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const getSize = () => {
    switch (size) {
      case 'sm': return { box: 40, font: typography.sizes.body, label: typography.sizes.overline };
      case 'md': return { box: 56, font: typography.sizes.h3, label: typography.sizes.caption };
      case 'lg': return { box: 72, font: typography.sizes.h2, label: typography.sizes.body };
      default: return { box: 56, font: typography.sizes.h3, label: typography.sizes.caption };
    }
  };

  const { box, font, label } = getSize();

  const TimeBox = ({ value, labelText }: { value: number; labelText: string }) => (
    <View style={{ alignItems: 'center' }}>
      <View
        style={[
          styles.box,
          {
            width: box,
            height: box,
            backgroundColor: colors.surfaceSecondary,
            borderRadius: 8,
          },
        ]}
      >
        <Text
          style={[
            styles.value,
            {
              fontSize: font,
              color: colors.textPrimary,
              fontFamily: typography.fontFamily.bold,
            },
          ]}
        >
          {String(value).padStart(2, '0')}
        </Text>
      </View>
      {showLabels && (
        <Text
          style={[
            styles.label,
            {
              fontSize: label,
              color: colors.textMuted,
              fontFamily: typography.fontFamily.medium,
              marginTop: spacing.xs,
            },
          ]}
        >
          {labelText}
        </Text>
      )}
    </View>
  );

  if (timeLeft.expired) {
    return (
      <View style={styles.container}>
        <Text style={[styles.expired, { color: colors.error }]} >Auction Ended</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {timeLeft.days > 0 && (
        <>
          <TimeBox value={timeLeft.days} labelText="DAYS" />
          <Text style={[styles.separator, { color: colors.textMuted }]} >:</Text>
        </>
      )}
      <TimeBox value={timeLeft.hours} labelText="HRS" />
      <Text style={[styles.separator, { color: colors.textMuted }]} >:</Text>
      <TimeBox value={timeLeft.minutes} labelText="MINS" />
      <Text style={[styles.separator, { color: colors.textMuted }]} >:</Text>
      <TimeBox value={timeLeft.seconds} labelText="SECS" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {},
  label: {
    textTransform: 'uppercase',
  },
  separator: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 4,
    marginTop: 12,
  },
  expired: {
    fontSize: typography.sizes.h3,
    fontFamily: typography.fontFamily.bold,
  },
});
