import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';

interface SearchStatusBannerProps {
  message: string;
  isWarning?: boolean;
}

const SearchStatusBanner = ({
  message,
  isWarning = false,
}: SearchStatusBannerProps) => {
  if (!message) return null;

  return (
    <View
      style={[
        styles.errorBanner,
        isWarning ? styles.warningBanner : styles.criticalErrorBanner,
      ]}>
      <Icon
        name={isWarning ? 'info' : 'alert-triangle'}
        size={ms(16)}
        color={isWarning ? '#FBBF24' : '#F87171'}
        style={styles.errorBannerIcon}
      />
      <Text
        style={[
          styles.errorBannerText,
          isWarning ? styles.warningBannerText : styles.criticalErrorText,
        ]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ms(12),
    borderWidth: 1,
    paddingHorizontal: ms(12),
    paddingVertical: ms(10),
    marginTop: ms(12),
  },
  warningBanner: {
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    borderColor: 'rgba(251, 191, 36, 0.35)',
  },
  criticalErrorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  errorBannerIcon: {
    marginRight: ms(8),
  },
  errorBannerText: {
    flex: 1,
    fontSize: ms(12.5),
    fontWeight: '600',
    lineHeight: ms(17),
  },
  warningBannerText: {
    color: '#FDE68A',
  },
  criticalErrorText: {
    color: '#FCA5A5',
  },
});

export default SearchStatusBanner;
