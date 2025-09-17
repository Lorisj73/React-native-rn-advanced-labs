import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRobotsStore } from '../store/robotStore';
import { RobotFormValues, robotSchema } from '../validation/robotSchema';

interface RobotFormProps {
  mode: 'create' | 'edit';
  robotId?: string; // required in edit
  defaultValues?: Partial<RobotFormValues>;
  onSuccess?: () => void;
}

export const RobotForm: React.FC<RobotFormProps> = ({ mode, robotId, defaultValues, onSuccess }) => {
  const create = useRobotsStore(s => s.create);
  const update = useRobotsStore(s => s.update);
  const getById = useRobotsStore(s => s.getById);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const robot = mode === 'edit' && robotId ? getById(robotId) : undefined;

  // Refs pour navigation & scroll
  const scrollRef = useRef<ScrollView | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const labelRef = useRef<TextInput | null>(null);
  const yearRef = useRef<TextInput | null>(null);
  const [fieldPositions, setFieldPositions] = useState<Record<string, number>>({});

  const registerFieldPos = (key: string) => (e: any) => {
    const y = e.nativeEvent.layout.y;
    setFieldPositions(prev => prev[key] === y ? prev : { ...prev, [key]: y });
  };

  const scrollToField = useCallback((key: string) => {
    const y = fieldPositions[key];
    if (y != null) {
      scrollRef.current?.scrollTo({ y: Math.max(y - 12, 0), animated: true });
    }
  }, [fieldPositions]);

  const focusAndScroll = (key: string) => {
    if (key === 'label') {
      labelRef.current?.focus();
    } else if (key === 'year') {
      yearRef.current?.focus();
    } else if (key === 'type') {
      // Juste scroll sur le picker
    }
    scrollToField(key);
  };

  const { control, handleSubmit, register, setValue, formState: { errors, isValid, isSubmitting }, watch, getValues } = useForm<RobotFormValues>({
    resolver: zodResolver(robotSchema) as any,
    mode: 'onChange',
    defaultValues: {
      name: robot?.name ?? defaultValues?.name ?? '',
      label: robot?.label ?? defaultValues?.label ?? '',
      year: robot?.year ?? (defaultValues?.year as number) ?? new Date().getFullYear(),
      type: robot?.type ?? (defaultValues?.type as any) ?? 'industrial',
    }
  });

  // Register uncontrolled inputs
  useEffect(() => {
    register('name');
    register('label');
    register('year');
    register('type');
  }, [register]);

  const onSubmit = async (values: RobotFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const payload = { name: values.name.trim(), label: values.label.trim(), year: Number(values.year), type: values.type } as const;
      if (mode === 'create') {
        create(payload);
      } else if (mode === 'edit' && robotId) {
        update(robotId, payload);
      }
      setSubmitSuccess(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      onSuccess?.();
    } catch (e: any) {
      setSubmitError(e.message || 'Erreur lors de la sauvegarde');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
  };

  if (mode === 'edit' && robotId && !robot) {
    return <View style={styles.container}><Text>Robot introuvable.</Text></View>;
  }

  const yearValue = watch('year');

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.flex}>
      <View style={styles.flex}>
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={styles.scrollContent}
        >
          <View onLayout={registerFieldPos('name')}>
            <FieldLabel label="Name" error={errors.name?.message} />
            <TextInput
              ref={nameRef}
              style={styles.input}
              autoCapitalize='none'
              placeholder='Nom unique'
              returnKeyType='next'
              blurOnSubmit={false}
              onSubmitEditing={() => focusAndScroll('label')}
              onFocus={() => scrollToField('name')}
              onChangeText={t => setValue('name', t, { shouldValidate: true })}
              defaultValue={watch('name')}
            />
          </View>

          <View onLayout={registerFieldPos('label')}>
            <FieldLabel label="Label" error={errors.label?.message} />
            <TextInput
              ref={labelRef}
              style={styles.input}
              placeholder='Label descriptif'
              returnKeyType='next'
              blurOnSubmit={false}
              onSubmitEditing={() => focusAndScroll('year')}
              onFocus={() => scrollToField('label')}
              onChangeText={t => setValue('label', t, { shouldValidate: true })}
              defaultValue={watch('label')}
            />
          </View>

          <View onLayout={registerFieldPos('year')}>
            <FieldLabel label="Year" error={errors.year?.message} />
            <TextInput
              ref={yearRef}
              style={styles.input}
              placeholder='Année'
              keyboardType='number-pad'
              returnKeyType='next'
              blurOnSubmit={false}
              onSubmitEditing={() => focusAndScroll('type')}
              onFocus={() => scrollToField('year')}
              onChangeText={t => setValue('year', Number(t.replace(/[^0-9]/g, '')) || 0, { shouldValidate: true })}
              value={String(yearValue)}
            />
          </View>

          <View onLayout={registerFieldPos('type')}>
            <FieldLabel label="Type" error={errors.type?.message} />
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={watch('type')}
                onValueChange={val => {
                  setValue('type', val, { shouldValidate: true });
                }}
              >
                <Picker.Item label='Industrial' value='industrial' />
                <Picker.Item label='Service' value='service' />
                <Picker.Item label='Medical' value='medical' />
                <Picker.Item label='Educational' value='educational' />
                <Picker.Item label='Other' value='other' />
              </Picker>
            </View>
          </View>

          {submitError ? <Text style={styles.errorBox}>{submitError}</Text> : null}
          {submitSuccess ? <Text style={styles.success}>Enregistré ✅</Text> : null}

          {/* Espace pour ne pas masquer le dernier champ derrière le footer */}
          <View style={{ height: 40 }} />
        </ScrollView>
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [styles.button, (!isValid || isSubmitting) && styles.buttonDisabled, pressed && styles.buttonPressed]}
            disabled={!isValid || isSubmitting}
            onPress={handleSubmit(onSubmit as any)}
          >
            {isSubmitting ? <ActivityIndicator color='#fff' /> : <Text style={styles.buttonText}>{mode === 'create' ? 'Créer' : 'Mettre à jour'}</Text>}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const FieldLabel = ({ label, error }: { label: string; error?: string }) => (
  <View style={styles.labelRow}>
    <Text style={styles.label}>{label}</Text>
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 16, gap: 12 },
  scrollContent: { padding: 16, paddingBottom: 60, gap: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, backgroundColor: '#fff' },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontWeight: '600' },
  error: { color: '#c00', fontSize: 12 },
  errorBox: { backgroundColor: '#fee', padding: 8, borderRadius: 6, color: '#900' },
  success: { color: '#0a0' },
  pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, overflow: 'hidden' },
  button: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonPressed: { opacity: 0.8 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  footer: { padding: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#e2e8f0', backgroundColor: '#f8fafc' }
});

export default RobotForm;
