import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authApi } from '../../features/auth/authApi';
import { useAuthStore } from '../../features/auth/authStore';
import { Button } from '../../shared/ui/Button';
import { InputField } from '../../shared/ui/InputField';
import { Feather } from '../../shared/ui/icons';
import { SolarBackdrop } from '../../shared/ui/SolarBackdrop';
import { SolarBrand } from '../../shared/ui/SolarBrand';
import { solarTheme } from '../../shared/theme';

const schema = yup.object({
  email: yup.string().email('Valid email required').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

type FormData = { email: string; password: string };

function LanguagePill({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <View
      className="px-4 py-2 rounded-full"
      style={{
        backgroundColor: active ? solarTheme.colors.surface : 'transparent',
        borderWidth: active ? 1 : 0,
        borderColor: active ? solarTheme.colors.border : 'transparent',
      }}
    >
      <Text
        style={{
          color: active ? solarTheme.colors.primaryStrong : solarTheme.colors.textMuted,
          fontSize: 13,
          fontWeight: active ? '700' : '600',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function LoginScreen() {
  const { setAuth } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: yupResolver(schema) as any });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await authApi.login(data);
      await setAuth(result.token, result.user);
      router.replace('/(tabs)/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Login failed. Check your credentials.';
      Alert.alert('Login Failed', msg);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: solarTheme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 28,
          paddingVertical: 28,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center justify-center">
          <SolarBackdrop
            size={360}
            style={{
              position: 'absolute',
              top: 42,
            }}
          />

          <View className="items-center pt-10 pb-14">
            <SolarBrand
              size="hero"
              centered
              subtitle="Precision management for the modern energy enterprise."
            />
          </View>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Work Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="name@company.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email?.message}
              leftIcon={<Feather name="mail" size={18} color={solarTheme.colors.textSoft} />}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="********"
              secureTextEntry
              error={errors.password?.message}
              leftIcon={<Feather name="lock" size={18} color={solarTheme.colors.textSoft} />}
            />
          )}
        />

        <Text
          style={{
            alignSelf: 'flex-end',
            color: solarTheme.colors.primary,
            fontSize: 13,
            fontWeight: '700',
            marginBottom: 20,
          }}
        >
          Forgot?
        </Text>

        <Button
          title="Access Console"
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit as any)}
          icon={
            <Feather
              name="arrow-right"
              size={18}
              color={solarTheme.colors.white}
            />
          }
          iconPosition="right"
        />

        <View className="items-center mt-20">
          <View
            className="flex-row items-center rounded-full p-1"
            style={{
              backgroundColor: solarTheme.colors.surfaceAccent,
              borderWidth: 1,
              borderColor: solarTheme.colors.border,
            }}
          >
            <LanguagePill label="EN" active />
            <LanguagePill label="हिंदी" />
            <LanguagePill label="मराठी" />
          </View>

          <Text
            style={{
              color: solarTheme.colors.textSoft,
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginTop: 18,
            }}
          >
            Secure enterprise authentication
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
