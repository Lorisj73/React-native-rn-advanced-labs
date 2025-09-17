import { Colors } from '@/constants/theme';
import React, { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, useColorScheme, View } from 'react-native';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export const TextField = forwardRef<TextInput, Props>(function TextField(
  { label, error, style, ...rest },
  ref
) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const showError = !!error;

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>
      <TextInput
        ref={ref}
        placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
        style={[
          styles.input,
          isDark && styles.inputDark,
          showError && styles.inputError,
          showError && isDark && styles.inputErrorDark,
          style,
        ]}
        {...rest}
      />
      {showError && <Text style={[styles.error, isDark && styles.errorDark]}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4, color: '#111827' },
  labelDark: { color: Colors.dark.text },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
    color: '#F9FAFB',
  },
  inputError: { borderColor: '#DC2626' },
  inputErrorDark: { borderColor: '#F87171' },
  error: { marginTop: 4, color: '#DC2626', fontSize: 12 },
  errorDark: { color: '#FCA5A5' },
});
