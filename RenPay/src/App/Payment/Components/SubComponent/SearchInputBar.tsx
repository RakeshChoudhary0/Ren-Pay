import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS } from '../../../../Extras/Constants/colors';

interface SearchInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

const SearchInputBar = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search by name, UPI ID or email...',
}: SearchInputBarProps) => {
  return (
    <View style={styles.searchBar}>
      <Icon name="search" size={ms(18)} color={COLORS.TextSecondary} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.TextSecondary}
        value={value}
        onChangeText={onChangeText}
        style={styles.searchInput}
        autoFocus={true}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="x-circle" size={ms(16)} color={COLORS.TextSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.WhiteSmoke}20`,
    borderWidth: 1,
    borderColor: `${COLORS.PrimaryBorder}50`,
    borderRadius: ms(16),
    paddingHorizontal: ms(14),
    height: ms(50),
    gap: ms(10),
  },
  searchInput: {
    flex: 1,
    color: COLORS.White,
    fontSize: ms(14),
    fontWeight: '500',
    paddingVertical: 0,
  },
});

export default SearchInputBar;
