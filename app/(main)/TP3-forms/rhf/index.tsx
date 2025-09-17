import { Colors } from '@/constants/theme';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextField } from './components/TextField';
import { formSchema, FormValues } from './validation/schema';

const defaultValues: FormValues = {
  email: '',
  password: '',
  confirmPassword: '',
  displayName: '',
  termsAccepted: false,
};

export default function TP3RHFZodFormScreen() {
  const scheme = useColorScheme();
  const palette = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const confirmRef = useRef<TextInput | null>(null);
  const displayNameRef = useRef<TextInput | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [fieldOffsets, setFieldOffsets] = useState<Record<string, number>>({});

  const { control, handleSubmit, formState, setValue, watch, reset, trigger } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  const values = watch();
  const { errors, isSubmitting, isValid, dirtyFields } = formState;

  const disableSubmit = !isValid || isSubmitting || Object.keys(dirtyFields).length === 0;

  const submit = async (data: FormValues) => {
    setSubmitted(false);
    try {
      await new Promise((r) => setTimeout(r, 800));
      reset(defaultValues);
      setSubmitted(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const submitAttempt = () => {
    if (disableSubmit) {
      trigger();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    handleSubmit(submit)();
  };

  const registerOffset = (name: string, y: number) => {
    setFieldOffsets((prev) => (prev[name] === y ? prev : { ...prev, [name]: y }));
  };
  const ensureVisible = (name: string) => {
    const y = fieldOffsets[name];
    if (y == null) return;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: Math.max(y - 40, 0), animated: true });
    });
  };

  React.useEffect(() => {
    const showEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const hideEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
    const onShow = (e: any) => setKeyboardHeight(e.endCoordinates?.height ?? 0);
    const onHide = () => setKeyboardHeight(0);
    const s1 = Keyboard.addListener(showEvent, onShow);
    const s2 = Keyboard.addListener(hideEvent, onHide);
    return () => { s1.remove(); s2.remove(); };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.container, { backgroundColor: palette.background, paddingBottom: 60 + keyboardHeight }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: palette.text }]}>TP3 – RHF + Zod</Text>
          <View style={{ width: '100%' }}>
            <View onLayout={(e) => registerOffset('email', e.nativeEvent.layout.y)}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    ref={emailRef}
                    label="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    onFocus={() => ensureVisible('email')}
                  />
                )}
              />
            </View>
            <View onLayout={(e) => registerOffset('password', e.nativeEvent.layout.y)}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    ref={passwordRef}
                    label="Mot de passe"
                    secureTextEntry
                    returnKeyType="next"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    onSubmitEditing={() => confirmRef.current?.focus()}
                    onFocus={() => ensureVisible('password')}
                  />
                )}
              />
            </View>
            <View onLayout={(e) => registerOffset('confirmPassword', e.nativeEvent.layout.y)}>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    ref={confirmRef}
                    label="Confirmer mot de passe"
                    secureTextEntry
                    returnKeyType="next"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmPassword?.message}
                    onSubmitEditing={() => displayNameRef.current?.focus()}
                    onFocus={() => ensureVisible('confirmPassword')}
                  />
                )}
              />
            </View>
            <View onLayout={(e) => registerOffset('displayName', e.nativeEvent.layout.y)}>
              <Controller
                control={control}
                name="displayName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    ref={displayNameRef}
                    label="Nom affiché"
                    returnKeyType="done"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.displayName?.message}
                    onSubmitEditing={submitAttempt}
                    onFocus={() => ensureVisible('displayName')}
                  />
                )}
              />
            </View>

            {/* Checkbox terms */}
            <Pressable
              onPress={() => setValue('termsAccepted', !values.termsAccepted, { shouldDirty: true, shouldValidate: true })}
              style={styles.checkboxRow}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: values.termsAccepted }}
            >
              <View style={[styles.checkboxBox, values.termsAccepted && styles.checkboxBoxChecked]}>
                {values.termsAccepted && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={[styles.checkboxLabel, { color: palette.text }]}>J'accepte les conditions générales</Text>
            </Pressable>
            {errors.termsAccepted?.message && (
              <Text style={styles.error}>{errors.termsAccepted.message}</Text>
            )}

            <Pressable
              onPress={submitAttempt}
              disabled={disableSubmit}
              style={({ pressed }) => [
                styles.submitBtn,
                disableSubmit ? styles.submitBtnDisabled : styles.submitBtnEnabled,
                pressed && !disableSubmit && styles.submitBtnPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ disabled: disableSubmit }}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitLabel}>Valider</Text>
              )}
            </Pressable>

            {submitted && (
              <Text style={[styles.successMsg, { color: scheme === 'dark' ? '#10B981' : '#047857' }]}>Succès ✅ Formulaire envoyé.</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFF',
  },
  checkboxBoxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkboxTick: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  checkboxLabel: { flex: 1 },
  submitBtn: {
    marginTop: 8,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnEnabled: { backgroundColor: '#2563EB' },
  submitBtnDisabled: { backgroundColor: '#93C5FD' },
  submitBtnPressed: { opacity: 0.9 },
  submitLabel: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  error: { color: '#DC2626', fontSize: 12, marginBottom: 4 },
  successMsg: { marginTop: 16, fontWeight: '600' },
});